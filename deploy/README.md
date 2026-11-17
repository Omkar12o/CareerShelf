# CareerShelf — 24/7 hosting (your PC stays OFF)

One long-lived Linux VM runs **everything**: storefront, store API, payment gateway and
UPI checkout. Your PC can be shut down, asleep, or thrown in a drawer. The public URL
never changes, and the GitHub Pages link keeps working because it is allowlisted.

```
Internet ──► Caddy (80/443, automatic HTTPS)
                ├── /                 → React storefront (built into the image)
                ├── /api/*            → CareerShelf store API   (orders, webhook)
                ├── /api/v1/*         → Youpi payment API       (sessions, health)
                └── /checkout/*       → Youpi checkout portal   (UPI QR, youpi.js)
                                          │
                                          └── SQLite in the `youpi-data` volume
```

Two devices stay in the loop, and neither is your PC:

| Device | Why |
|---|---|
| **The VPS** | Runs the stack 24/7 |
| **Your Android phone** | The observer app reads the bank SMS that says “₹49 credited”. The gateway refuses to issue a UPI QR without a fresh heartbeat. Plug it in, leave it on Wi-Fi. |

---

## 1. Create the server

Either option needs ~1 GB RAM / 1 vCPU.

**A. Oracle Cloud Always Free (₹0/month forever)**
1. https://signup.oraclecloud.com → card verification only, nothing is charged.
2. Create a **Compute Instance** → Ubuntu 24.04 → shape `VM.Standard.E2.1.Micro` (or Ampere `A1.Flex`).
3. Upload an SSH public key (or let Oracle generate one and download it).
4. **Networking → VCN → Security Lists → Default**: allow ingress TCP **80** and **443** from `0.0.0.0/0`.
5. Inside the VM, Oracle’s default iptables also blocks those ports:
   `sudo iptables -I INPUT -p tcp -m multiport --dports 80,443 -j ACCEPT`

**B. Any cheap VPS (₹350–450/month)** — Hostinger / DigitalOcean / Hetzner, Ubuntu 22.04 or 24.04, 1 GB RAM. Ports are already open.

## 2. Point a domain at it

**Free — DuckDNS (2 minutes):** https://www.duckdns.org → create the subdomain
`careershelf` → put the server IP in “current ip”.

**Own domain (recommended):** add an `A` record, `careershelf` → *server IP*.

Wait ~2 minutes and check `ping careershelf.duckdns.org`. Caddy requests the TLS
certificate itself, so DNS **must** resolve before you install.

## 3. Install (one command)

```bash
sudo apt-get update && sudo apt-get install -y git curl
git clone https://github.com/Omkar12o/CareerShelf.git
cd CareerShelf

cp deploy/.env.example deploy/.env
nano deploy/.env      # fill in the blanks (table below)
bash deploy/install.sh
```

### `deploy/.env` — what each value is

| Key | Where to get it |
|---|---|
| `PUBLIC_ORIGIN` | `https://careershelf.duckdns.org` (no trailing slash) |
| `PAGES_ORIGIN` | `https://omkar12o.github.io` — keeps the shared Pages link working |
| `SUPABASE_URL` | `https://ktdwmcnayhnnotchkodw.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | same page → `service_role` (server only) |
| `YOUPI_MERCHANT_ID`, `YOUPI_MERCHANT_KEY`, `YOUPI_WEBHOOK_SECRET` | copy from your working `CareerShelf/.env.local` |
| `DEFAULT_PAYEE_VPA` | the UPI ID that receives the money |
| `PAYEE_NAME` | name shown in the buyer’s UPI app |
| `PHONEPE_REGISTERED_MOBILE` | number registered on that UPI account |
| `ANDROID_ENROLLMENT_SECRET` | leave blank → installer generates one; use the same value in the phone app |
| `ENCRYPTION_MASTER_KEY`, `*_TOKEN`, `DEVICE_CREDENTIAL_KEY`, `BLIND_INDEX_KEY` | leave blank → installer generates and stores them in `deploy/.env` |

`deploy/.env` is git-ignored. Never commit it; it holds live payment secrets.

## 4. What the installer does

1. Installs Docker + compose plugin if absent.
2. Clones the Youpi gateway next to `CareerShelf/` (compose expects `../youpi-pg`) and stages
   `deploy/Dockerfile.gateway` as `youpi-pg/Dockerfile.careershelf`, because a Dockerfile must
   live inside its build context.
3. Builds three images: storefront+Caddy, store API, gateway (payment-api + portal share one image).
4. Starts the stack with `restart: unless-stopped` and the `youpi-data` volume, so Docker restarts and VM reboots bring it back on their own.
5. Runs `deploy/bootstrap.mjs` inside the payment-api container. It converges the merchant row through the gateway’s own repositories:
   - webhook → `${PUBLIC_ORIGIN}/api/payments/webhook`
   - merchant API key → `YOUPI_MERCHANT_KEY`
   - webhook signing secret → `YOUPI_WEBHOOK_SECRET`
   - exactly one active receiving VPA → `DEFAULT_PAYEE_VPA`
   It is idempotent and never prints the full VPA (masked as `91***@ibl`).
6. Polls `PUBLIC_ORIGIN/` until HTTPS answers `200` (certificate usually <60 s).

Verify:

```bash
docker compose -f deploy/docker-compose.yml ps
curl -s -o /dev/null -w '%{http_code}\n' https://careershelf.duckdns.org/
curl -s https://careershelf.duckdns.org/api/v1/health
```

## 5. Pair the phone (required for payments)

1. Build/install the observer APK from `youpi-pg/apps/android-observer-app`.
2. In the app: server URL **`https://careershelf.duckdns.org`**, secret = `ANDROID_ENROLLMENT_SECRET`.
3. Grant SMS permission, disable battery optimisation, leave it on Wi-Fi.
4. The heartbeat turns the gateway’s health check green and the UPI QR starts appearing.

> Without a heartbeat the payment API returns **503 `OBSERVERS_UNHEALTHY`** by design.
> That is the anti-fraud gate: money is only confirmed from a real bank SMS.

## 6. Keep the permanent link working

The link you shared stays **https://omkar12o.github.io/CareerShelf/**; only the API
origin baked into it changes. Rebuild and republish once:

```powershell
cd "C:\Users\OMKAR SUNIL MOHITE\Desktop\carrer\CareerShelf"
$env:VITE_API_BASE_URL="https://careershelf.duckdns.org"
$env:VITE_YOUPI_GATEWAY_URL="https://careershelf.duckdns.org"
$env:VITE_YOUPI_API_URL="https://careershelf.duckdns.org"
node node_modules/vite/bin/vite.js build --outDir pages-dist --base /CareerShelf/
Copy-Item pages-dist\index.html pages-dist\404.html -Force
git -C . subtree push --prefix pages-dist origin gh-pages   # or your existing publish script
```

After that the Pages site talks straight to the cloud; nothing on your PC is involved.
You can also simply share the cloud URL — it is same-origin, so no CORS at all.

## 7. Day-2 operations

| Task | Command |
|---|---|
| Logs | `docker compose -f deploy/docker-compose.yml logs -f payment-api` |
| Restart everything | `docker compose -f deploy/docker-compose.yml restart` |
| Re-apply merchant config | `docker compose -f deploy/docker-compose.yml exec payment-api node /app/bootstrap.mjs` |
| Update code | `git pull && docker compose -f deploy/docker-compose.yml up -d --build` |
| Back up payments DB | `docker compose -f deploy/docker-compose.yml cp payment-api:/app/data/youpi_pg.sqlite ./backup-$(date +%F).sqlite` |
| Confirm auto-start | `sudo reboot`, wait 2 min, re-run the curl checks |

## Admin pricing (Products & Services)

`Admin → Products` and `Admin → Services` both write to the Supabase `products` table:

- upload a **PDF or ZIP**, enter **any price**, choose the section, save;
- the store lists it immediately and the checkout charges that exact price;
- the server is the price authority (`server/catalog.js` reads the row), so the browser
  cannot lower the amount;
- `Admin → Services` is scoped to the `service` category, so project files and their
  prices are managed in one place and appear on `/services` and `/products`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Caddy loops on “obtaining certificate” | DNS not pointing at the server yet, or port 80 blocked by the cloud firewall. |
| `503 OBSERVERS_UNHEALTHY` | Phone app offline / secret mismatch — reopen it and check Wi-Fi. |
| Store loads, buy fails with CORS | `PUBLIC_ORIGIN` differs from the browser’s address (http/https, www/apex). Add the exact origin to `PAGES_ORIGIN` or open the cloud URL. |
| Orders never flip to `paid` | Webhook URL must be `https://<your-domain>/api/payments/webhook`; re-run `bootstrap.mjs`. |
| `docker compose` not found | `sudo apt-get install -y docker-compose-plugin` |
| `price mismatch` toast at checkout | The admin price changed after the page loaded — refresh and retry. |

## Files

| File | Purpose |
|---|---|
| `docker-compose.yml` | web / store / payment-api / checkout-portal + volumes |
| `Caddyfile` | single-origin routing + automatic HTTPS |
| `Dockerfile.web` | builds the SPA, serves it with Caddy |
| `Dockerfile.store` | CareerShelf API image |
| `Dockerfile.gateway` | Youpi monorepo image (staged into `youpi-pg/Dockerfile.careershelf` by the installer) |
| `bootstrap.mjs` | converges merchant key, webhook URL and receiving VPA |
| `.env.example` | template — copy to `.env`, never commit the filled file |
| `install.sh` | Docker install → clone gateway → build → bootstrap → health check |
