#!/usr/bin/env python3

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
WIX_REFERENCE_DIR = ROOT / "docs" / "plans" / "wix-reference"
SOURCE_DIRS = [
    WIX_REFERENCE_DIR / "html",
    WIX_REFERENCE_DIR / "feeds",
]
ASSET_DIR = WIX_REFERENCE_DIR / "asset-source-archive"
ASSET_FILE_DIR = ASSET_DIR / "original"
ASSET_MANIFEST_PATH = ASSET_DIR / "manifest.json"
ASSET_README_PATH = ASSET_DIR / "README.md"

ASSET_PATTERN = re.compile(
    r"((?:https?:)?//static\.wixstatic\.com/media/"
    r"([A-Za-z0-9_.~-]+\.(?:avif|gif|jpe?g|png|svg|webp)))"
    r"[^\"'\s,<>]*",
    re.IGNORECASE,
)


@dataclass
class AssetRecord:
    asset_id: str
    download_url: str
    source_files: set[str] = field(default_factory=set)
    variant_urls: set[str] = field(default_factory=set)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Download directly-addressable Wix media assets from the local reference pack."
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Redownload assets even when the local file already exists.",
    )
    return parser.parse_args()


def normalize_variant_url(url: str) -> str:
    if url.startswith("//"):
        return f"https:{url}"
    return url


def iter_source_files() -> Iterable[Path]:
    for directory in SOURCE_DIRS:
        if not directory.exists():
            continue
        yield from sorted(path for path in directory.iterdir() if path.is_file())


def discover_assets() -> dict[str, AssetRecord]:
    assets: dict[str, AssetRecord] = {}

    for source_path in iter_source_files():
        rel_source = source_path.relative_to(ROOT).as_posix()
        text = source_path.read_text(errors="ignore")
        for match in ASSET_PATTERN.finditer(text):
            variant_url = normalize_variant_url(match.group(1))
            asset_id = match.group(2)
            record = assets.setdefault(
                asset_id,
                AssetRecord(
                    asset_id=asset_id,
                    download_url=f"https://static.wixstatic.com/media/{asset_id}",
                ),
            )
            record.source_files.add(rel_source)
            record.variant_urls.add(variant_url)

    return dict(sorted(assets.items()))


def sha256_for_path(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def download_asset(record: AssetRecord, force: bool) -> dict[str, object]:
    target_path = ASSET_FILE_DIR / record.asset_id
    target_path.parent.mkdir(parents=True, exist_ok=True)

    if target_path.exists() and not force:
        return {
            "status": "existing",
            "localPath": target_path.relative_to(ASSET_DIR).as_posix(),
            "fileSize": target_path.stat().st_size,
            "sha256": sha256_for_path(target_path),
        }

    request = Request(
        record.download_url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; SCB-Wix-Asset-Capture/1.0)",
        },
    )

    temp_path = target_path.with_suffix(f"{target_path.suffix}.part")
    metadata: dict[str, object] = {}

    try:
        with urlopen(request) as response, temp_path.open("wb") as handle:
            metadata["contentType"] = response.headers.get_content_type()
            if response.headers.get("ETag"):
                metadata["etag"] = response.headers.get("ETag")
            if response.headers.get("Last-Modified"):
                metadata["lastModified"] = response.headers.get("Last-Modified")
            while True:
                chunk = response.read(1024 * 1024)
                if not chunk:
                    break
                handle.write(chunk)
    except (HTTPError, URLError) as exc:
        if temp_path.exists():
            temp_path.unlink()
        raise RuntimeError(f"download failed for {record.asset_id}: {exc}") from exc

    temp_path.replace(target_path)
    metadata.update(
        {
            "status": "downloaded",
            "localPath": target_path.relative_to(ASSET_DIR).as_posix(),
            "fileSize": target_path.stat().st_size,
            "sha256": sha256_for_path(target_path),
        }
    )
    return metadata


def write_readme(asset_count: int) -> None:
    ASSET_README_PATH.write_text(
        "\n".join(
            [
                "# Wix Asset Pack",
                "",
                "This folder contains directly downloaded media assets extracted from the local Wix reference HTML/feed captures.",
                "",
                "## Contents",
                "",
                "- `original/`: downloaded base media files from `static.wixstatic.com/media/<asset-id>`",
                "- `manifest.json`: asset discovery and download metadata",
                "",
                "## Notes",
                "",
                f"- current discovered asset count: `{asset_count}`",
                "- assets are deduplicated by Wix media asset id",
                "- use this pack as a local source stash for implementation and migration work",
                "- if a needed image is missing, expand the reference crawl or use live-site fallback only for the missing item",
                "",
            ]
        )
        + "\n"
    )


def main() -> int:
    args = parse_args()
    assets = discover_assets()

    if not assets:
        print("No Wix media assets were discovered in the local reference pack.", file=sys.stderr)
        return 1

    results = []
    errors = []

    print(f"Discovered {len(assets)} unique Wix media assets.")

    for record in assets.values():
        try:
            result = download_asset(record, force=args.force)
            result.update(
                {
                    "assetId": record.asset_id,
                    "downloadUrl": record.download_url,
                    "sourceFiles": sorted(record.source_files),
                    "variantUrls": sorted(record.variant_urls),
                }
            )
            results.append(result)
            print(f"{result['status']}: {record.asset_id}")
        except RuntimeError as exc:
            errors.append(
                {
                    "assetId": record.asset_id,
                    "downloadUrl": record.download_url,
                    "error": str(exc),
                    "sourceFiles": sorted(record.source_files),
                    "variantUrls": sorted(record.variant_urls),
                }
            )
            print(f"error: {record.asset_id}", file=sys.stderr)

    manifest = {
        "capturedAt": datetime.now(timezone.utc).isoformat(),
        "sourceDirs": [path.relative_to(ROOT).as_posix() for path in SOURCE_DIRS],
        "assetCountDiscovered": len(assets),
        "assetCountDownloaded": len(results),
        "assetCountErrored": len(errors),
        "assets": results,
        "errors": errors,
    }

    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    ASSET_MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=True) + "\n")
    write_readme(len(assets))

    return 0 if not errors else 2


if __name__ == "__main__":
    raise SystemExit(main())
