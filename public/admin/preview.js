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

  async function convert(file) {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const toBlob = (type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));
    const webp = await toBlob("image/webp", 0.7);
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

  const PUBLIC_FOLDER = "/src/assets/images/uploads";

  // Decap lowercases and cleans file names when it saves them. Converted uploads already have
  // such names; a file that failed conversion is renamed here so the stored path stays correct.
  function safeName(file) {
    const clean = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    return clean === file.name ? file : new File([file], clean, { type: file.type });
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

  // Decap tracks unsaved uploads by a hash of their content, so two identical photos collapse into
  // one file and the other gallery entry would point at nothing. Identical photos are skipped.
  const addedHashes = new Set();
  window.addEventListener("hashchange", () => addedHashes.clear());

  async function contentHash(file) {
    const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function GalleryBatchControl(props) {
    function addPhotos() {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;
      input.accept = "image/jpeg,image/png,image/webp";
      input.hidden = true;
      // Attached to the page so the conversion listener on `document` sees its change event.
      document.body.append(input);
      input.addEventListener("change", async () => {
        input.remove();
        const files = [...input.files].map(safeName);
        if (!files.length) return;
        const status = document.querySelector(`[data-scb-batch-status="${props.forID}"]`);
        const say = (text) => status && (status.textContent = text);

        const data = props.entry.get("data");
        const MapOf = data.constructor;
        let list = props.value ?? data.toList().clear();
        const failed = [];
        const duplicates = [];

        for (const [index, file] of files.entries()) {
          say(`Bild ${index + 1} von ${files.length} wird hochgeladen …`);
          try {
            if (!(await isImage(file))) throw new Error("not a readable image");
            const hash = await contentHash(file);
            if (addedHashes.has(hash)) {
              duplicates.push(file.name);
              continue;
            }
            addedHashes.add(hash);
            await props.onPersistMedia(file, { field: props.field.get("fields").first() });
            list = list.push(MapOf({ image: `${PUBLIC_FOLDER}/${file.name}`, alt: "", caption: "" }));
            props.onChange(list);
          } catch (error) {
            console.error("SCB batch skipped", file.name, error);
            failed.push(file.name);
          }
        }

        const added = files.length - failed.length - duplicates.length;
        const notes = [
          failed.length ? `Nicht lesbar, übersprungen: ${failed.join(", ")}.` : "",
          duplicates.length ? `Schon vorhanden, übersprungen: ${duplicates.join(", ")}.` : "",
        ].filter(Boolean);
        say(
          [`${added} von ${files.length} Bildern hinzugefügt.`, ...notes, added ? "Bitte zu jedem Bild die Bildbeschreibung ausfüllen." : ""]
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
        h("p", { "data-scb-batch-status": props.forID, "aria-live": "polite", style: { margin: "6px 0 0", fontSize: "13px" } }),
      ),
      h(stock.control, props),
    );
  }

  CMS.registerWidget("gallery-batch", GalleryBatchControl, stock.preview, stock.schema);
})();
