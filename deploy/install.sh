#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# CareerShelf — one-command 24/7 install on a fresh Linux VM (Ubuntu 22/24).
#
#   git clone https://github.com/Omkar12o/CareerShelf.git
#   cd CareerShelf
#   cp deploy/.env.example deploy/.env && nano deploy/.env   # fill secrets
#   bash deploy/install.sh
#
# When this finishes the whole stack runs in Docker, survives reboots, and your
# PC can stay switched off. Only the Android observer (your phone) stays online,
# because UPI credits are confirmed from the bank SMS.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PARENT="$(dirname "$ROOT")"
GATEWAY="$PARENT/youpi-pg"
ENV_FILE="$ROOT/deploy/.env"
COMPOSE=(docker compose -f "$ROOT/deploy/docker-compose.yml" --env-file "$ENV_FILE")

say() { printf '\n\033[1;36m▸ %s\033[0m\n' "$1"; }
die() { printf '\n\033[1;31m✖ %s\033[0m\n' "$1" >&2; exit 1; }

# ── 1. docker ────────────────────────────────────────────────────────────────
if ! command -v docker >/dev/null 2>&1; then
  say "Installing Docker"
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker || true
fi
docker compose version >/dev/null 2>&1 || die "docker compose plugin missing (apt install docker-compose-plugin)"

# ── 2. config ────────────────────────────────────────────────────────────────
[ -f "$ENV_FILE" ] || die "Missing deploy/.env — run: cp deploy/.env.example deploy/.env and fill it in"

# Generate server-side crypto material once (blank values only).
gen_secret() {
  if command -v openssl >/dev/null 2>&1; then openssl rand -hex 32; else head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n'; fi
}
for key in ENCRYPTION_MASTER_KEY OBSERVER_API_TOKEN ADMIN_API_TOKEN INTERNAL_SERVICE_TOKEN DEVICE_CREDENTIAL_KEY BLIND_INDEX_KEY ANDROID_ENROLLMENT_SECRET; do
  current="$(grep -E "^${key}=" "$ENV_FILE" | head -n1 | cut -d= -f2- || true)"
  if [ -z "${current//[[:space:]]/}" ]; then
    printf '%s=%s\n' "$key" "$(gen_secret)" >> "$ENV_FILE"
    say "Generated $key"
  fi
done

# shellcheck disable=SC1090
set -a; . "$ENV_FILE"; set +a
for required in PUBLIC_ORIGIN SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY \
                YOUPI_MERCHANT_KEY YOUPI_WEBHOOK_SECRET DEFAULT_PAYEE_VPA; do
  [ -n "${!required:-}" ] || die "$required is empty in deploy/.env"
done
case "$PUBLIC_ORIGIN" in https://*) ;; *) die "PUBLIC_ORIGIN must start with https://" ;; esac
if [ "$PUBLIC_ORIGIN" != "${PUBLIC_ORIGIN%/}" ]; then
  PUBLIC_ORIGIN="${PUBLIC_ORIGIN%/}"
  sed -i "s#^PUBLIC_ORIGIN=.*#PUBLIC_ORIGIN=${PUBLIC_ORIGIN}#" "$ENV_FILE"
fi
export PUBLIC_ORIGIN
export PAYEE_NAME="${PAYEE_NAME:-${DEFAULT_MERCHANT_NAME:-CareerShelf}}"

# ── 3. Youpi gateway checkout (sibling folder expected by docker-compose) ─────
if [ ! -d "$GATEWAY" ]; then
  say "Cloning the Youpi gateway into $GATEWAY"
  git clone --depth 1 https://github.com/youpi-pg/YouPI-PG.git "$GATEWAY"
fi

# The gateway image is built from the gateway checkout, so its Dockerfile has to
# live inside that build context. Keep the canonical copy in deploy/ and stage it.
cp "$ROOT/deploy/Dockerfile.gateway" "$GATEWAY/Dockerfile.careershelf"
cat > "$GATEWAY/.dockerignore" <<'EOF'
node_modules
data
.git
*.log
.env
.env.*
coverage
EOF

# ── 4. build + start ─────────────────────────────────────────────────────────
say "Building images (first run takes 5–10 minutes)"
cd "$ROOT"
"${COMPOSE[@]}" build

say "Starting services"
"${COMPOSE[@]}" up -d

# ── 5. converge merchant row (API key, webhook URL, real receiving VPA) ──────
say "Applying merchant configuration (idempotent)"
for attempt in 1 2 3 4 5; do
  if "${COMPOSE[@]}" exec -T payment-api node /app/bootstrap.mjs; then break; fi
  [ "$attempt" = "5" ] && die "bootstrap failed — check: ${COMPOSE[*]} logs payment-api"
  say "payment-api not ready yet, retrying ($attempt/5)"
  sleep 6
done

# ── 6. health check ──────────────────────────────────────────────────────────
say "Waiting for the HTTPS certificate (up to 90s)"
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$PUBLIC_ORIGIN/" || true)
  [ "$code" = "200" ] && break
  sleep 3
done

say "Status"
"${COMPOSE[@]}" ps
printf '\nStorefront  : %s\n' "$PUBLIC_ORIGIN"
printf 'Payment API : %s/api/v1/health\n' "$PUBLIC_ORIGIN"
printf 'Checkout    : %s/checkout/demo\n\n' "$PUBLIC_ORIGIN"
printf 'Payment API health: %s\n' "$(curl -s --max-time 10 "$PUBLIC_ORIGIN/api/v1/health" | head -c 300)"
printf '\nNext:\n'
printf '  1. Install the observer APK from youpi-pg/apps/android-observer-app\n'
printf '     Server URL : %s\n' "$PUBLIC_ORIGIN"
printf '     Secret     : ANDROID_ENROLLMENT_SECRET from deploy/.env\n'
printf '  2. Rebuild the GitHub Pages bundle against %s (see deploy/README.md §6)\n' "$PUBLIC_ORIGIN"
printf '  3. Confirm auto-start: sudo reboot, wait 2 min, reopen the site\n'
