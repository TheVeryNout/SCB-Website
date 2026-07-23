(function registerScbPostPreview() {
  const CMS = window.CMS;
  const h = window.h;

  if (!CMS || !h) {
    console.error("SCB CMS preview could not initialize because Decap CMS is unavailable.");
    return;
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
    const draft = value(entry, "draft", true);
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
