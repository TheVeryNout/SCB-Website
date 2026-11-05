import { createHash } from "node:crypto";
import { access, mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

import sharp from "sharp";

const SUPPORTED_FORMATS = new Set(["jpeg", "png", "webp"]);
const MANIFEST_NAME = "image-prepare-manifest.json";
const DEFAULT_MAX_EDGE = 2560;
const DEFAULT_QUALITY = 80;
const WEBP_EFFORT = 5;
const PATH_COLLATOR = new Intl.Collator("en", { numeric: true });

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer.`);
  }
}

function validateOptions(options) {
  const normalized = {
    ...options,
    maxEdge: options.maxEdge ?? DEFAULT_MAX_EDGE,
    quality: options.quality ?? DEFAULT_QUALITY,
  };

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized.slug)) {
    throw new Error("slug must contain lowercase letters, numbers, and single hyphens only.");
  }

  assertPositiveInteger(normalized.maxEdge, "maxEdge");
  assertPositiveInteger(normalized.quality, "quality");

  if (normalized.quality > 100) {
    throw new Error("quality must not exceed 100.");
  }

  return normalized;
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function listInputFiles(root) {
  const files = [];

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const path = resolve(directory, entry.name);

      if (entry.isDirectory()) {
        await visit(path);
      } else if (entry.isFile()) {
        files.push(path);
      } else {
        throw new Error(`Unsupported non-regular input: ${relative(root, path)}`);
      }
    }
  }

  await visit(root);
  return files.sort((left, right) => {
    const leftPath = relative(root, left);
    const rightPath = relative(root, right);
    return PATH_COLLATOR.compare(leftPath, rightPath) || leftPath.localeCompare(rightPath, "en");
  });
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function isWithin(parent, child) {
  const path = relative(parent, child);
  return path !== "" && !path.startsWith(`..${sep}`) && path !== ".." && !isAbsolute(path);
}

async function inspectInputs(inputRoot, slug) {
  const files = await listInputFiles(inputRoot);

  if (files.length === 0) {
    throw new Error("Input folder contains no files.");
  }

  return Promise.all(
    files.map(async (absolutePath, index) => {
      const buffer = await readFile(absolutePath);
      const inputSha256 = sha256(buffer);
      let metadata;

      try {
        metadata = await sharp(buffer, { failOn: "error" }).metadata();
      } catch (error) {
        throw new Error(`Cannot read image ${relative(inputRoot, absolutePath)}: ${String(error)}`);
      }

      if (!metadata.format || !SUPPORTED_FORMATS.has(metadata.format)) {
        throw new Error(
          `Unsupported image format for ${relative(inputRoot, absolutePath)}: ${metadata.format ?? "unknown"}`,
        );
      }

      if (!metadata.width || !metadata.height) {
        throw new Error(`Image dimensions are unavailable for ${relative(inputRoot, absolutePath)}.`);
      }

      return {
        absolutePath,
        relativePath: relative(inputRoot, absolutePath).split(sep).join("/"),
        inputBytes: buffer.byteLength,
        inputFormat: metadata.format,
        inputWidth: metadata.width,
        inputHeight: metadata.height,
        inputSha256,
        outputName: `${slug}-${String(index + 1).padStart(2, "0")}-${inputSha256.slice(0, 10)}.webp`,
      };
    }),
  );
}

async function writeJsonAtomically(path, value) {
  const temporaryPath = `${path}.tmp-${process.pid}`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });

  try {
    await rename(temporaryPath, path);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    throw error;
  }
}

export async function prepareImages(options) {
  const settings = validateOptions(options);
  const inputRoot = resolve(settings.input);
  const outputRoot = resolve(settings.output);

  if (inputRoot === outputRoot || isWithin(inputRoot, outputRoot)) {
    throw new Error("Output folder must be separate from and outside the input folder.");
  }

  const inputs = await inspectInputs(inputRoot, settings.slug);
  const manifestPath = resolve(outputRoot, MANIFEST_NAME);
  const outputPaths = inputs.map((input) => resolve(outputRoot, input.outputName));

  await mkdir(outputRoot, { recursive: true });

  for (const path of [manifestPath, ...outputPaths]) {
    if (await pathExists(path)) {
      throw new Error(`Refusing to overwrite existing output: ${path}`);
    }
  }

  const createdPaths = [];

  try {
    const entries = [];

    for (const [index, input] of inputs.entries()) {
      const outputPath = outputPaths[index];
      const temporaryPath = `${outputPath}.tmp-${process.pid}`;

      try {
        const result = await sharp(input.absolutePath, { failOn: "error" })
          .autoOrient()
          .resize({
            width: settings.maxEdge,
            height: settings.maxEdge,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: settings.quality, effort: WEBP_EFFORT })
          .toFile(temporaryPath);

        await rename(temporaryPath, outputPath);
        createdPaths.push(outputPath);
        const outputBuffer = await readFile(outputPath);

        entries.push({
          order: index + 1,
          input: {
            path: input.relativePath,
            format: input.inputFormat,
            width: input.inputWidth,
            height: input.inputHeight,
            bytes: input.inputBytes,
            sha256: input.inputSha256,
          },
          output: {
            path: input.outputName,
            format: "webp",
            width: result.width,
            height: result.height,
            bytes: result.size,
            sha256: sha256(outputBuffer),
          },
        });
      } catch (error) {
        await rm(temporaryPath, { force: true });
        throw new Error(`Conversion failed for ${input.relativePath}: ${String(error)}`);
      }
    }

    const manifest = {
      version: 1,
      settings: {
        slug: settings.slug,
        maxEdge: settings.maxEdge,
        quality: settings.quality,
        effort: WEBP_EFFORT,
        format: "webp",
        sharpVersion: sharp.versions.sharp,
      },
      entries,
    };

    await writeJsonAtomically(manifestPath, manifest);
    createdPaths.push(manifestPath);
    return manifest;
  } catch (error) {
    await Promise.all(createdPaths.map((path) => rm(path, { force: true })));
    throw error;
  }
}

function parseCliArguments(args) {
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }

    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${argument}.`);
    }

    switch (argument) {
      case "--input":
        options.input = value;
        break;
      case "--output":
        options.output = value;
        break;
      case "--slug":
        options.slug = value;
        break;
      case "--max-edge":
        options.maxEdge = Number(value);
        break;
      case "--quality":
        options.quality = Number(value);
        break;
      default:
        throw new Error(`Unknown argument: ${argument}`);
    }

    index += 1;
  }

  return options;
}

function printUsage() {
  console.log(`Prepare JPEG, PNG, or WebP files for review as bounded WebP publication assets.

Usage:
  bun run images:prepare -- --input <folder> --output <folder> --slug <slug> [options]

Options:
  --max-edge <pixels>  Longest output edge (default: ${DEFAULT_MAX_EDGE})
  --quality <1-100>    WebP quality (default: ${DEFAULT_QUALITY})
  --help               Show this help

WebP encoding effort is fixed at ${WEBP_EFFORT}.

The command never deletes input files and refuses to overwrite outputs.`);
}

async function main() {
  const options = parseCliArguments(process.argv.slice(2));

  if (options.help) {
    printUsage();
    return;
  }

  if (!options.input || !options.output || !options.slug) {
    printUsage();
    throw new Error("--input, --output, and --slug are required.");
  }

  const manifest = await prepareImages(options);
  const inputBytes = manifest.entries.reduce((sum, entry) => sum + entry.input.bytes, 0);
  const outputBytes = manifest.entries.reduce((sum, entry) => sum + entry.output.bytes, 0);

  console.log(`Prepared ${manifest.entries.length} image(s).`);
  console.log(`Input:  ${inputBytes} bytes`);
  console.log(`Output: ${outputBytes} bytes`);
  console.log(`Manifest: ${resolve(options.output, MANIFEST_NAME)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
