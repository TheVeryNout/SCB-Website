(function registerScbPostPreview() {
  const CMS = window.CMS;
  const h = window.h;

  if (!CMS || !h) {
    console.error("SCB CMS preview could not initialize because Decap CMS is unavailable.");
    return;
  }

  // Decap's German "Neue(r/s) …" button cannot know the noun's gender.
  const germanPhrases = CMS.getLocale("de");
  if (germanPhrases?.collection?.collectionTop) {
    germanPhrases.collection.collectionTop.newButton = "%{collectionLabel} erstellen";
  }

  function value(entry, field, fallback = "") {
    const fieldValue = entry.getIn(["data", field]);

    return fieldValue === undefined || fieldValue === null || fieldValue === ""
      ? fallback
      : fieldValue;
  }

  function PostPreview({ entry, getAsset, widgetFor }) {
    const coverImage = value(entry, "coverImage");
    const coverAlt = value(entry, "coverAlt", value(entry, "title"));
    const coverCaption = value(entry, "coverCaption");
    const coverMode = value(entry, "coverMode", "wide");
    const publishedAt = value(entry, "publishedAt");
    const draft = value(entry, "draft", false);
    const gallery = entry.getIn(["data", "gallery"]);
    const galleryItems = gallery && typeof gallery.toJS === "function" ? gallery.toJS() : [];

    return h(
      "main",
      { className: "scb-preview" },
      h(
        "article",
        { className: "scb-preview__article" },
        h(
          "header",
          { className: "scb-preview__header" },
          h("p", { className: "scb-preview__eyebrow" }, draft ? "Entwurf" : value(entry, "category", "Neuigkeiten")),
          h("h1", null, value(entry, "title", "Beitragstitel")),
          h("p", { className: "scb-preview__excerpt" }, value(entry, "excerpt", "Kurztext des Beitrags")),
          publishedAt ? h("time", null, new Date(publishedAt).toLocaleDateString("de-DE")) : null,
        ),
        coverImage
          ? h(
              "figure",
              { className: `scb-preview__cover scb-preview__cover--${coverMode}` },
              h("img", { src: getAsset(coverImage).toString(), alt: coverAlt }),
              coverCaption ? h("figcaption", null, coverCaption) : null,
            )
          : null,
        h("div", { className: "scb-preview__body" }, widgetFor("body")),
        galleryItems.length
          ? h(
              "section",
              { className: "scb-preview__gallery", "aria-label": "Bildergalerie" },
              galleryItems.map((item, index) =>
                h(
                  "figure",
                  { key: `${item.image}-${index}` },
                  h("img", {
                    src: getAsset(item.image).toString(),
                    alt: item.alt || "",
                  }),
                  item.caption ? h("figcaption", null, item.caption) : null,
                ),
              ),
            )
          : null,
      ),
    );
  }

  CMS.registerPreviewStyle("/admin/preview.css");
  CMS.registerPreviewTemplate("posts", PostPreview);
})();

// Uploads: convert photos to WebP (max 1600 px, quality 0.7) and name them after the entry
// title before Decap's media dialog receives them. Spec: .scratch/cms-image-upload/spec.md
(function convertAndRenameUploads() {
  const MAX_EDGE = 1600;
  const CONVERTIBLE = ["image/jpeg", "image/png", "image/webp"];
  const HANDLED = "scbConverted";

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)
      .replace(/-+$/, "");
  }

  function baseName() {
    const title = document.querySelector('input[id^="title-field"]')?.value ?? "";
    return slugify(title) || new Date().toISOString().slice(0, 10);
  }

  // Names of existing uploads, read from the media listings the CMS fetches (local proxy and
  // Git Gateway), plus the names created in this session. Decap's library grid is virtualised,
  // so the page itself never shows all files.
  const knownNames = new Set();
  let listingSeen = false;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    if ((response.headers.get("content-type") ?? "").includes("json")) {
      response
        .clone()
        .json()
        .then((data) => {
          const items = Array.isArray(data) ? data : Array.isArray(data?.tree) ? data.tree : [];
          for (const item of items) {
            const path = typeof item?.path === "string" ? item.path : "";
            const name = typeof item?.name === "string" ? item.name : path.split("/").pop();
            if (name && /\.(?:webp|jpe?g|png|gif|svg)$/i.test(name)) {
              knownNames.add(name);
              listingSeen = true;
            }
          }
        })
        .catch(() => {});
    }
    return response;
  };

  function nextNumber(base) {
    const pattern = new RegExp(`^${base}-(\\d{2,})(?:-[a-z0-9]{4})?\\.(?:webp|jpe?g)$`);
    let highest = 0;
    for (const name of knownNames) {
      const match = name.match(pattern);
      if (match) highest = Math.max(highest, Number(match[1]));
    }
    // Before any listing has arrived, a short random suffix prevents a name clash.
    return { number: highest + 1, suffix: listingSeen ? "" : `-${Math.random().toString(36).slice(2, 6)}` };
  }

  // Decap keeps unsaved uploads in a store keyed by file content, so two byte-identical files
  // would collapse into one and the second name would point at nothing. A photo that encodes to
  // bytes already produced in this session is encoded again at a slightly lower quality.
  const producedHashes = new Set();

  async function sha256(blob) {
    const digest = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function convert(file) {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const toBlob = (type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));
    let webp = null;
    for (let quality = 0.7; quality > 0.6; quality -= 0.01) {
      webp = await toBlob("image/webp", quality);
      if (!webp || webp.type !== "image/webp") break;
      const hash = await sha256(webp);
      if (!producedHashes.has(hash)) {
        producedHashes.add(hash);
        return { blob: webp, extension: "webp" };
      }
    }
    if (webp && webp.type === "image/webp") return { blob: webp, extension: "webp" };
    return { blob: await toBlob("image/jpeg", 0.8), extension: "jpg" };
  }

  document.addEventListener(
    "change",
    (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.type !== "file" || input.dataset[HANDLED]) return;
      const files = [...(input.files ?? [])];
      if (!files.some((file) => CONVERTIBLE.includes(file.type))) return;

      event.stopImmediatePropagation();
      (async () => {
        const transfer = new DataTransfer();
        const base = baseName();
        let { number, suffix } = nextNumber(base);

        for (const file of files) {
          if (!CONVERTIBLE.includes(file.type)) {
            transfer.items.add(file);
            continue;
          }
          try {
            const { blob, extension } = await convert(file);
            const name = `${base}-${String(number++).padStart(2, "0")}${suffix}.${extension}`;
            knownNames.add(name);
            transfer.items.add(new File([blob], name, { type: blob.type }));
          } catch (error) {
            console.error("SCB upload conversion failed; uploading the original.", error);
            transfer.items.add(file);
          }
        }

        input.files = transfer.files;
        input.dataset[HANDLED] = "1";
        input.dispatchEvent(new Event("change", { bubbles: true }));
        delete input.dataset[HANDLED];
      })();
    },
    true,
  );
})();

// Gallery batch add: the stock list widget plus one button that adds several photos at once.
// Each chosen file is converted and named by convertAndRenameUploads above (its capture-phase
// listener re-dispatches the change event with the converted files), persisted through Decap's
// own media action, and appended as an empty { image, alt, caption } entry. The required
// description stays empty, so Decap blocks saving until the editor has filled it in.
// Spec: .scratch/gallery-batch-upload/spec.md
(function registerGalleryBatchWidget() {
  const CMS = window.CMS;
  const h = window.h;
  const stock = CMS?.getWidget?.("list");
  if (!CMS || !h || !stock) return;

  const PUBLIC_FOLDER = "src/assets/images/uploads";

  // Decap lowercases and cleans file names when it saves them. Converted uploads already have
  // such names (`<slug>-NN.webp`); any other file is renamed here, with a short random part so it
  // cannot clash with an existing file, so the stored path stays correct.
  function safeName(file) {
    if (/-\d{2,}(?:-[a-z0-9]{4})?\.(?:webp|jpg)$/.test(file.name)) return file;
    const dot = file.name.lastIndexOf(".");
    const stem = (dot > 0 ? file.name.slice(0, dot) : file.name).toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
    const extension = dot > 0 ? file.name.slice(dot).toLowerCase().replace(/[^a-z0-9.]/g, "") : "";
    return new File([file], `${stem}-${Math.random().toString(36).slice(2, 6)}${extension}`, { type: file.type });
  }

  // A file the browser cannot decode would be stored as a broken image and fail the site build.
  async function isImage(file) {
    try {
      (await createImageBitmap(file)).close();
      return true;
    } catch {
      return false;
    }
  }

  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  // The newest props of each gallery field: a batch takes seconds, and the editor may keep typing.
  const latestProps = new Map();
  const running = new Set();

  function GalleryBatchControl(props) {
    const id = props.forID;
    latestProps.set(id, props);

    function addPhotos(event) {
      if (running.has(id)) return;
      const button = event.currentTarget;
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;
      input.accept = "image/jpeg,image/png,image/webp";
      input.hidden = true;
      // Attached to the page so the conversion listener on `document` sees its change event.
      document.body.append(input);
      input.addEventListener("cancel", () => {
        window.removeEventListener("change", onPicked, true);
        input.remove();
      });

      const statusLine = () => document.querySelector(`[data-scb-batch-status="${id}"]`);
      const say = (text) => {
        const line = statusLine();
        if (line) line.textContent = text;
      };

      // Converting many photos takes a moment before the upload hook hands them back.
      function onPicked(changeEvent) {
        if (changeEvent.target !== input || input.dataset.scbConverted) return;
        window.removeEventListener("change", onPicked, true);
        running.add(id);
        button.disabled = true;
        say("Fotos werden vorbereitet …");
      }
      window.addEventListener("change", onPicked, true);

      input.addEventListener("change", async () => {
        input.remove();
        const files = [...input.files].map(safeName);
        const failed = [];
        let added = 0;

        for (const [index, file] of files.entries()) {
          say(`Bild ${index + 1} von ${files.length} wird hochgeladen …`);
          try {
            if (!(await isImage(file))) throw new Error("not a readable image");
            // Decap's media action returns nothing when it declines the file (name clash).
            const result = await props.onPersistMedia(file, { field: props.field.get("fields").first() });
            if (result === undefined) throw new Error("file name already in use");

            // Rebuild from the newest props, so edits made meanwhile are kept.
            const current = latestProps.get(id);
            const MapOf = current.entry.get("data").constructor;
            const list = current.value ?? current.entry.get("data").toList().clear();
            current.onChange(list.push(MapOf({ image: `${PUBLIC_FOLDER}/${file.name}`, alt: "", caption: "" })));
            added += 1;
            await pause(40);
          } catch (error) {
            console.error("SCB batch skipped", file.name, error);
            failed.push(file.name);
          }
        }

        running.delete(id);
        button.disabled = false;
        say(
          [
            `${added} von ${files.length} Bildern hinzugefügt.`,
            failed.length ? `Übersprungen (nicht lesbar oder Name schon vergeben): ${failed.join(", ")}.` : "",
            added ? "Bitte zu jedem Bild die Bildbeschreibung ausfüllen." : "",
          ]
            .filter(Boolean)
            .join(" "),
        );
      });
      input.click();
    }

    return h(
      "div",
      null,
      h(
        "div",
        { style: { margin: "0 0 12px" } },
        h(
          "button",
          { type: "button", className: "scb-batch-add", onClick: addPhotos },
          "Mehrere Bilder auf einmal hinzufügen",
        ),
        h("p", { "data-scb-batch-status": id, "aria-live": "polite", style: { margin: "6px 0 0", fontSize: "13px" } }),
      ),
      h(stock.control, props),
    );
  }

  CMS.registerWidget("gallery-batch", GalleryBatchControl, stock.preview, stock.schema);
})();

// Image paths: the editor holds `src/assets/...` (Decap can then show a photo that is not saved yet),
// the content files keep the root path `/src/assets/...` that Astro resolves. Other paths pass through.
(function convertImagePathsOnSaveAndLoad() {
  window.CMS?.registerWidgetValueSerializer?.("image", {
    serialize: (value) => (typeof value === "string" && value.startsWith("src/assets/") ? `/${value}` : value),
    deserialize: (value) => (typeof value === "string" && value.startsWith("/src/assets/") ? value.slice(1) : value),
  });
})();
