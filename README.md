# Rclone Google Drive Bridge & Encrypted WebUI (`rclone-pages`)

This repository contains:
1. **Google OAuth 2.0 Verification Pages** (`index.html`, `privacy.html`, `terms.html`) hosted via GitHub Pages for keeping a personal Google Drive `rclone` OAuth client in **Production** status (so `refresh_token` credentials do not expire every 7 days).
2. **Setup & Architecture Documentation** for running an **Encrypted Google Drive WebUI** powered by `rclone crypt`, `rclone serve webdav`, and `AList` on Android Termux (`aarch64`) or Linux.

---

## Documentation Index

| Document | Description |
| :--- | :--- |
| [`WEBUI_SETUP.md`](./WEBUI_SETUP.md) | **Encrypted WebUI Setup & Operations** — Architecture, root (`/`) mount config, guest access & SQLite session fix, CLI helpers (`gdcp` / `gdls`), and service scripts (`start.sh` / `stop.sh`). |

---

## Architecture Summary (Encrypted Google Drive WebUI)

```text
Browser (:5244) ──► AList (/) ──► rclone serve webdav (127.0.0.1:8081) ──► gdrive-crypt: ──► Google Drive (gdrive:crypt)
```

- **Frontend**: [AList](https://github.com/AlistGo/alist) (`v3.66.0` `android/arm64`) listening on port `5244` with the encrypted Drive mounted directly at **`/`**.
- **Encryption & Cloud Bridge**: `rclone serve webdav gdrive-crypt: --addr 127.0.0.1:8081 --vfs-cache-mode writes` (100% userspace, no root or FUSE required).
- **Storage**: Google Drive (`gdrive:crypt` inside `appDataFolder`) with `standard` filename encryption and directory name encryption enabled.
- **Direct CLI Access (`gdcp` / `gdls`)**: Any device with the same `rclone.conf` can upload and list encrypted files directly against Google Drive even when the WebUI host is offline.

Quick commands:
```bash
# Start or restart WebUI + rclone WebDAV on the host
ssh <remote-host> "~/alist/start.sh"

# Stop services on the host
ssh <remote-host> "~/alist/stop.sh"

# Forward WebUI to http://localhost:5244
ssh -L 5244:127.0.0.1:5244 <remote-host>

# Upload or list directly from local Termux (via ~/.bashrc helpers)
gdcp /path/to/file.zip
gdls
```

---

## Included OAuth Verification Pages

| File | Purpose | Live GitHub Pages URL |
| :--- | :--- | :--- |
| [`index.html`](./index.html) | **Application Homepage** — Explains app purpose, local-only architecture, requested Google Drive scopes, and links prominently to the Privacy Policy. | `https://detuar.github.io/rclone-pages/` |
| [`privacy.html`](./privacy.html) | **Privacy Policy** — Declares zero data collection, local `rclone.conf` token storage, revocation instructions, and the mandatory *Google API Services User Data Policy (Limited Use)* disclosure. | `https://detuar.github.io/rclone-pages/privacy.html` |
| [`terms.html`](./terms.html) | **Terms of Service** — As-is open-source usage terms and user responsibilities. | `https://detuar.github.io/rclone-pages/terms.html` |

## Google Cloud Console OAuth Consent Screen Setup

1. Push this repository to GitHub (`main` branch) and enable **GitHub Pages** under **Settings &rarr; Pages &rarr; Deploy from a branch (`main` / `/ (root)`)**.
2. Open the [Google Cloud Console Auth Platform / OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent).
3. Under **App Information / App Domain**, enter:
   - **Application home page:** `https://detuar.github.io/rclone-pages/`
   - **Application privacy policy link:** `https://detuar.github.io/rclone-pages/privacy.html`
   - **Application terms of service link:** `https://detuar.github.io/rclone-pages/terms.html`
4. Set **Publishing status** to **In production** ("Publish App") so your personal `rclone` refresh tokens do not expire every 7 days.
