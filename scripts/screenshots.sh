#!/usr/bin/env bash
# Screenshots every page type at 375px and 1440px, light and dark.
# Needs Chrome, a finished `npm run build`, the static site on :4310 (python3 -m http.server 4310 -d out)
# and a folder holding frame.html on :4311 (python3 -m http.server 4311 -d <folder>).
# Chrome will not open a window narrower than 500px, so the 375px shots use a 375px iframe, cropped.
set -euo pipefail
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/screenshots"
mkdir -p "$OUT"
pages="home:/ introduction:/docs/introduction/ quickstart:/docs/quickstart/ recipes:/docs/recipes/ recipe:/docs/recipes/verify-webhook/ reference:/docs/reference/collections/ webhook-events:/docs/webhook-events/ errors:/docs/errors/ go-live:/docs/go-live/ changelog:/docs/changelog/ downloads:/docs/downloads/ status:/docs/status/"
for entry in $pages; do
  name="${entry%%:*}"; path="${entry#*:}"
  for theme in light dark; do
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=500,5000 --virtual-time-budget=5000 \
      --screenshot="$OUT/$name-$theme-375.png" "http://127.0.0.1:4311/frame.html?h=5000&p=http://127.0.0.1:4310${path}?theme=$theme" >/dev/null 2>&1
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,2600 --virtual-time-budget=5000 \
      --screenshot="$OUT/$name-$theme-1440.png" "http://127.0.0.1:4310${path}?theme=$theme" >/dev/null 2>&1
  done
done
echo "screenshots in $OUT"
