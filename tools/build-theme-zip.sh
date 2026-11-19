#!/usr/bin/env bash
# Merges the Conversion Kit into a Shopify theme zip you downloaded.
#
#   ./tools/build-theme-zip.sh ~/Downloads/dawn.zip                  # kit only
#   ./tools/build-theme-zip.sh ~/Downloads/dawn.zip my-templates/    # kit + your generated templates
#
# Output: <your-zip>-with-kit.zip next to the original. Upload it in
# Shopify admin > Online Store > Themes > Add theme > Upload zip file. Your live theme is not touched.
set -euo pipefail

ZIP="${1:-}"
TEMPLATES="${2:-}"
if [ -z "$ZIP" ] || [ ! -f "$ZIP" ]; then
  echo "Usage: $0 path/to/theme.zip [folder-with-templates]" >&2
  exit 1
fi

KIT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
unzip -q "$ZIP" -d "$WORK"

# Find the theme root (the folder that has sections/ and layout/)
ROOT="$(dirname "$(find "$WORK" -type d -name sections -maxdepth 3 | head -1)")"
if [ ! -d "$ROOT/layout" ]; then
  echo "Could not find a Shopify theme (layout/ + sections/) inside $ZIP" >&2
  exit 1
fi

cp "$KIT"/theme/sections/*.liquid "$ROOT/sections/"
cp "$KIT"/theme/snippets/*.liquid "$ROOT/snippets/"
cp "$KIT"/theme/assets/* "$ROOT/assets/"
echo "Added $(ls "$KIT"/theme/sections | wc -l | tr -d ' ') sections, $(ls "$KIT"/theme/snippets | wc -l | tr -d ' ') snippets, 2 assets."

if [ -n "$TEMPLATES" ]; then
  cp "$TEMPLATES"/*.json "$ROOT/templates/"
  echo "Added templates: $(cd "$TEMPLATES" && ls *.json | tr '\n' ' ')"
fi

# Free-shipping bar inside the Dawn-style cart drawer
DRAWER="$ROOT/snippets/cart-drawer.liquid"
if [ -f "$DRAWER" ] && ! grep -q "ck-cart-progress" "$DRAWER"; then
  if grep -q "<cart-drawer-items" "$DRAWER"; then
    perl -0pi -e "s/<cart-drawer-items/{%- render 'ck-cart-progress' -%}\n<cart-drawer-items/" "$DRAWER"
    echo "Added the free-shipping bar to the cart drawer."
  else
    echo "Cart drawer layout not recognised: add {% render 'ck-cart-progress' %} to it by hand (see README)."
  fi
fi

OUT="$(cd "$(dirname "$ZIP")" && pwd)/$(basename "${ZIP%.zip}")-with-kit.zip"
rm -f "$OUT"
(cd "$ROOT" && zip -qr "$OUT" . -x '.*')
echo "Done: $OUT"
