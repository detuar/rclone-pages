# Encrypted Google Drive WebUI Setup (`WEBUI_SETUP.md`)

Reference guide for running an auto-encrypting Google Drive WebUI powered by **rclone** (`crypt` + `serve webdav`) and **AList** (`v3.66.0` `android/arm64`) on Android Termux or Linux without requiring root or FUSE (`rclone mount`).

---

## 1. Overview

When files are uploaded through the **AList WebUI** (mounted directly at **`/`**) or via the **`gdcp`** CLI helper:
1. `rclone` transparently encrypts both **file contents** (`XSalsa20-Poly1305`) and **file/folder names** (`EME` standard filename encryption) using the `gdrive-crypt:` remote.
2. The encrypted ciphertext is stored inside `gdrive:crypt` (using Google Drive's hidden `appDataFolder` scope, so files do not clutter normal "My Drive" views).
3. Multiple independent encrypted vaults can be created on the same Google Drive by adding additional `crypt` remotes pointing to separate subdirectories (e.g., `gdrive:vault2`) with their own keys.

---

## 2. Ports & Endpoints

| Service | Listen Address | Purpose |
| :--- | :--- | :--- |
| **AList WebUI** | `0.0.0.0:5244` | Main browser WebUI & file manager (mounts `gdrive-crypt:` at `/`). |
| **AList WebDAV** | `0.0.0.0:5244/dav/` | WebDAV endpoint for native Android/desktop file managers. |
| **rclone WebDAV** | `127.0.0.1:8081` | Local-only decrypted WebDAV bridge for `gdrive-crypt:`. |

### Accessing the WebUI
- **Direct LAN / VPN**: `http://<server-ip>:5244`
- **Via SSH Local Port Forwarding**:
  ```bash
  ssh -L 5244:127.0.0.1:5244 <remote-host>
  ```
  Then open `http://localhost:5244` in your browser.

---

## 3. Guest Access & Session Configuration

- **Root Mount (`/`)**: The `WebDav` storage is mounted directly at `/` so users and guests land immediately inside the encrypted Drive and cannot accidentally upload files outside of it.
- **Guest Role Permissions**: Controlled via **Manage &rarr; Permissions &rarr; Roles &rarr; `guest`** (`id = 1` in `x_roles`, with `x_users.permission = 0` so the Admin UI checkboxes have full authority). Configured to allow passwordless access, downloads, package downloads, archive reading, uploads/mkdir, and deletion (`permission = 20618`).
- **Preventing `"session inactive"` on Guest Logout (AList v3.66.0 Fix)**:
  In AList `v3.66.0`, clicking the login/logout button while browsing as `guest` calls `GET /api/auth/logout`, which sets `status = 1` (`inactive`) on the guest entry in the SQLite `x_sessions` table (`~/alist/data/data.db`). Two SQLite triggers keep sessions active automatically:
  ```sql
  CREATE TRIGGER keep_sessions_active_update
  AFTER UPDATE OF status ON x_sessions
  WHEN NEW.status != 0
  BEGIN
    UPDATE x_sessions SET status = 0 WHERE device_key = NEW.device_key;
  END;

  CREATE TRIGGER keep_sessions_active_insert
  AFTER INSERT ON x_sessions
  WHEN NEW.status != 0
  BEGIN
    UPDATE x_sessions SET status = 0 WHERE device_key = NEW.device_key;
  END;
  ```

---

## 4. Direct CLI Uploads (`gdcp` & `gdls`)

Any machine with `~/.config/rclone/rclone.conf` can encrypt and upload directly to Google Drive—even when the WebUI host is offline.

Shell helpers in `~/.bashrc`:
```bash
# Upload a local file or folder to encrypted Google Drive
gdcp() {
  if [ -z "$1" ]; then
    echo "Usage: gdcp <local-file-or-dir> [remote-subfolder]"
    return 1
  fi
  rclone copy -P "$1" "gdrive-crypt:${2:-}"
}

# List decrypted files on Google Drive
gdls() {
  rclone ls "gdrive-crypt:${1:-}"
}
```

### OAuth Token Refresh Notes
- `rclone` automatically refreshes the 1-hour OAuth `access_token` using the `refresh_token` and writes the updated token back to `~/.config/rclone/rclone.conf`.
- Ensure the `expiry` timestamp inside `rclone.conf` is in UTC (`...Z`) and that the Google Cloud OAuth Consent Screen is set to **In Production** so the `refresh_token` never expires.

---

## 5. Credentials, Keys & Service Scripts

Plaintext credentials and keys are stored only on the host machine (with `0600` permissions):

- **AList Admin Credentials**: `~/alist/credentials.txt`
- **Rclone Crypt Passwords (`password` & `password2` salt)**: `~/rclone-crypt-keys.txt`
- **Rclone Configuration**: `~/.config/rclone/rclone.conf`

Helper scripts in `~/alist/` on the host:
- **Start services**: `~/alist/start.sh`
- **Stop services**: `~/alist/stop.sh`
- **View logs**: `tail -f ~/alist/alist.log ~/alist/rclone-webdav.log`
