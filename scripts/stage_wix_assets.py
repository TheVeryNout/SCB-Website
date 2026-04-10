#!/usr/bin/env python3

from __future__ import annotations

import json
import shutil
from collections import defaultdict
from pathlib import Path
import re
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
ASSET_MANIFEST = ROOT / "docs" / "plans" / "wix-reference" / "asset-source-archive" / "manifest.json"
SOURCE_ROOT = ROOT / "docs" / "plans" / "wix-reference" / "asset-source-archive"
STAGE_ROOT = ROOT / "src" / "assets" / "images" / "wix-staging"
STAGE_MANIFEST = STAGE_ROOT / "manifest.json"
STAGE_README = STAGE_ROOT / "README.md"
FEED_PATH = ROOT / "docs" / "plans" / "wix-reference" / "feeds" / "blog-feed.xml"
FEED_MEDIA_PATTERN = re.compile(r"/media/([^/\"'\s,<>]+)")


def slug_from_source(source: str) -> str:
    return Path(source).stem


def build_feed_asset_map() -> dict[str, str]:
    if not FEED_PATH.exists():
        return {}

    feed_map: dict[str, str] = {}
    root = ET.fromstring(FEED_PATH.read_text())
    for item in root.findall("./channel/item"):
        link = item.findtext("link") or ""
        slug = link.rstrip("/").split("/post/")[-1]
        enclosure = item.find("enclosure")
        if not slug or enclosure is None:
            continue
        url = enclosure.attrib.get("url", "")
        match = FEED_MEDIA_PATTERN.search(url)
        if match:
            feed_map[match.group(1)] = slug
    return feed_map


def primary_bucket(source_files: list[str], asset_id: str, feed_asset_map: dict[str, str]) -> tuple[str, str]:
    source_names = [slug_from_source(source) for source in source_files if source.endswith(".html")]

    if not source_names:
        if asset_id in feed_asset_map:
            return ("posts", feed_asset_map[asset_id])
        return ("misc", "unassigned")

    html_sources = [name for name in source_names if not name.startswith("post-")]
    post_sources = [name for name in source_names if name.startswith("post-")]

    # Shared chrome and common logos appear across many pages.
    if len(set(source_names)) >= 4:
        return ("shared", "site")

    if html_sources:
        name = html_sources[0]
        page_map = {
            "home": ("homepage", "site"),
            "ueber-uns": ("pages", "about"),
            "pics-n-vids": ("media", "gallery"),
            "veranstaltungen": ("events", "index"),
            "event-sunday-funday-2025-04-06-13-00": ("events", "sunday-funday"),
            "copy-of-veranstaltungen": ("pages", "membership"),
            "kontakt": ("pages", "contact"),
            "impressum": ("pages", "legal"),
            "datenschutz": ("pages", "legal"),
            "news-index": ("posts", "index"),
        }
        if name in page_map:
            return page_map[name]

    if post_sources:
        return ("posts", post_sources[0].removeprefix("post-"))

    return ("misc", source_names[0])


def ensure_clean_stage_root() -> None:
    if STAGE_ROOT.exists():
        shutil.rmtree(STAGE_ROOT)
    STAGE_ROOT.mkdir(parents=True, exist_ok=True)


def copy_asset(source_relative: str, bucket: str, group: str, asset_id: str) -> str:
    source_path = SOURCE_ROOT / source_relative
    target_dir = STAGE_ROOT / bucket / group
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / asset_id
    shutil.copy2(source_path, target_path)
    return target_path.relative_to(STAGE_ROOT).as_posix()


def write_readme(summary: dict[str, int]) -> None:
    lines = [
        "# Wix Asset Staging",
        "",
        "This folder is an Astro-facing staging tree built from the downloaded Wix asset pack.",
        "",
        "## Purpose",
        "",
        "- group flat Wix media files by likely page/domain ownership",
        "- give later implementation work stable local folders to pull from",
        "- preserve the original downloaded pack separately under `docs/plans/wix-reference/asset-source-archive/`",
        "",
        "## Layout",
        "",
        "- `shared/site/`: common site chrome, icons, and assets used across many pages",
        "- `homepage/site/`: homepage-focused assets",
        "- `pages/`: static-page assets grouped by page slug",
        "- `posts/`: per-post asset groups",
        "- `events/`: event index/detail asset groups",
        "- `media/gallery/`: gallery/media-page assets",
        "- `misc/`: anything not confidently bucketed",
        "",
        "## Counts",
        "",
    ]
    for key in sorted(summary):
        lines.append(f"- `{key}`: {summary[key]}")
    lines.extend(
        [
            "",
            "## Regeneration",
            "",
            "Regenerate this staging tree with:",
            "",
            "```bash",
            "bun run stage:wix-assets",
            "```",
            "",
            "The source of truth remains `docs/plans/wix-reference/asset-source-archive/manifest.json`.",
            "",
        ]
    )
    STAGE_README.write_text("\n".join(lines))


def main() -> int:
    manifest = json.loads(ASSET_MANIFEST.read_text())
    feed_asset_map = build_feed_asset_map()
    ensure_clean_stage_root()

    stage_entries = []
    summary = defaultdict(int)

    for asset in manifest["assets"]:
        bucket, group = primary_bucket(asset["sourceFiles"], asset["assetId"], feed_asset_map)
        staged_path = copy_asset(asset["localPath"], bucket, group, asset["assetId"])
        stage_entries.append(
            {
                "assetId": asset["assetId"],
                "sourceLocalPath": asset["localPath"],
                "stagedPath": staged_path,
                "bucket": bucket,
                "group": group,
                "sourceFiles": asset["sourceFiles"],
                "fileSize": asset["fileSize"],
                "sha256": asset["sha256"],
            }
        )
        summary[f"{bucket}/{group}"] += 1

    STAGE_MANIFEST.write_text(
        json.dumps(
            {
                "sourceManifest": ASSET_MANIFEST.relative_to(ROOT).as_posix(),
                "assetCount": len(stage_entries),
                "entries": stage_entries,
            },
            indent=2,
            ensure_ascii=True,
        )
        + "\n"
    )
    write_readme(dict(summary))
    print(f"Staged {len(stage_entries)} assets into {STAGE_ROOT.relative_to(ROOT).as_posix()}")
    for key in sorted(summary):
        print(f"{key}: {summary[key]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
