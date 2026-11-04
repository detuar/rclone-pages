# Rclone Google Drive Bridge (`rclone-pages`)

Static GitHub Pages site providing a **Google OAuth 2.0 Compliant Homepage, Privacy Policy, and Terms of Service** for connecting [rclone](https://rclone.org/drive/) to the **Google Drive API**.

## Included Pages

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
