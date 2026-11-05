import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import sharp from "sharp";

import { prepareImages } from "./prepare_images.mjs";

const temporaryRoots = [];

async function createWorkspace() {
  const root = await mkdtemp(join(tmpdir(), "scb-image-prepare-"));
  const input = join(root, "input");
  const output = join(root, "output");
  temporaryRoots.push(root);
  await mkdir(input);
  return { root, input, output };
}

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((path) => rm(path, { recursive: true, force: true })));
});

describe("prepareImages", () => {
  test("converts practical numbered batches in deterministic path order and writes a hashed manifest", async () => {
    const { input, output } = await createWorkspace();
    await sharp({
      create: { width: 3000, height: 1500, channels: 3, background: "#d34d2f" },
    })
      .jpeg({ quality: 92 })
      .toFile(join(input, "image-10.jpg"));
    await sharp({
      create: { width: 120, height: 200, channels: 4, background: { r: 10, g: 20, b: 30, alpha: 0.4 } },
    })
      .png()
      .toFile(join(input, "image-2.png"));

    const manifest = await prepareImages({ input, output, slug: "test-gallery", maxEdge: 1000, quality: 87 });

    expect(manifest.entries.map((entry) => entry.input.path)).toEqual(["image-2.png", "image-10.jpg"]);
    expect(manifest.entries.map((entry) => [entry.output.width, entry.output.height])).toEqual([
      [120, 200],
      [1000, 500],
    ]);
    expect(manifest.entries.every((entry) => /^[a-f0-9]{64}$/.test(entry.output.sha256))).toBe(true);
    expect(manifest.entries.every((entry) => entry.output.path.endsWith(".webp"))).toBe(true);

    const savedManifest = JSON.parse(await readFile(join(output, "image-prepare-manifest.json"), "utf8"));
    expect(savedManifest).toEqual(manifest);
    expect((await sharp(join(output, manifest.entries[0].output.path)).metadata()).format).toBe("webp");
  });

  test("records the default quality of 80 in the manifest", async () => {
    const { input, output } = await createWorkspace();
    await sharp({ create: { width: 40, height: 40, channels: 3, background: "#336699" } })
      .jpeg()
      .toFile(join(input, "image.jpg"));

    const manifest = await prepareImages({ input, output, slug: "default-quality" });

    expect(manifest.settings).toMatchObject({ quality: 80, effort: 5 });
  });

  test("auto-orients images and strips orientation metadata", async () => {
    const { input, output } = await createWorkspace();
    await sharp({ create: { width: 20, height: 40, channels: 3, background: "#225588" } })
      .withMetadata({ orientation: 6 })
      .jpeg()
      .toFile(join(input, "rotated.jpg"));

    const manifest = await prepareImages({ input, output, slug: "orientation-check" });
    const metadata = await sharp(join(output, manifest.entries[0].output.path)).metadata();

    expect([metadata.width, metadata.height]).toEqual([40, 20]);
    expect(metadata.orientation).toBe(undefined);
    expect(metadata.exif).toBe(undefined);
  });

  test("rejects an existing output instead of overwriting it", async () => {
    const { input, output } = await createWorkspace();
    await sharp({ create: { width: 40, height: 40, channels: 3, background: "#000000" } })
      .webp()
      .toFile(join(input, "image.webp"));

    await prepareImages({ input, output, slug: "collision-check" });
    const before = await readdir(output);

    let error;
    try {
      await prepareImages({ input, output, slug: "collision-check" });
    } catch (caught) {
      error = caught;
    }
    expect(String(error)).toContain("Refusing to overwrite existing output");
    expect(await readdir(output)).toEqual(before);
  });

  test("fails unsupported batches before creating converted output", async () => {
    const { input, output } = await createWorkspace();
    await writeFile(join(input, "notes.txt"), "not an image");

    let error;
    try {
      await prepareImages({ input, output, slug: "unsupported-check" });
    } catch (caught) {
      error = caught;
    }
    expect(String(error)).toContain("Cannot read image notes.txt");
    expect(await readdir(output).catch(() => [])).toEqual([]);
  });

  test("rejects output folders nested inside the input folder", async () => {
    const { input } = await createWorkspace();
    let error;
    try {
      await prepareImages({ input, output: join(input, "review"), slug: "unsafe-output" });
    } catch (caught) {
      error = caught;
    }
    expect(String(error)).toContain("outside the input folder");
  });
});
