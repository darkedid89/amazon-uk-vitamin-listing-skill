# 11–13. Setup, Run & Deploy — Ninja Fruit

## 11. Project setup
No build step is required to **play** — it's vanilla ES6 modules. You only need
Node if you want the Capacitor native wrappers.

```bash
cd fruit-ninja
npm install          # installs @capacitor/cli (for mobile only)
```

## 12. Running locally
ES6 modules need an HTTP origin (not `file://`).

```bash
npx serve . -l 5173            # Node, no global install
# or
python3 -m http.server 5173   # Python 3
# or
npm start
```
Open <http://localhost:5173>. For mobile testing on the same Wi‑Fi, browse to
`http://<your-LAN-IP>:5173` from the phone.

---

## 13. Deploying to the web (PWA)

The game is fully static — host the `fruit-ninja/` folder anywhere.

### Netlify / Vercel / Cloudflare Pages
- Build command: *(none)* · Publish directory: `fruit-ninja`
- Drag-and-drop the folder, or connect the repo.

### GitHub Pages
```bash
# from repo root, publishing the subfolder via a gh-pages branch
git subtree push --prefix fruit-ninja origin gh-pages
```
Then enable Pages → branch `gh-pages`.

### Any static host / Nginx
Copy the folder to the web root. Recommended headers:
```
Cache-Control: public, max-age=31536000, immutable   # for /js, /css, /assets
Cache-Control: no-cache                              # for index.html
```
Serve over **HTTPS** (required for PWA install, Web Audio autoplay-after-gesture,
and Add-to-Home-Screen).

### PWA notes
`manifest.json` makes the game installable. To add full offline support, drop in
a service worker that pre-caches `index.html`, `/css`, `/js/**`, `/assets/**`
(a cache-first strategy is ideal since assets are versioned/immutable).

---

## Mobile builds (Capacitor — recommended)

Capacitor wraps the same web build in a native shell.

```bash
cd fruit-ninja
npm install
npx cap add android         # requires Android Studio + JDK 17
npx cap add ios             # requires macOS + Xcode
npx cap sync                # copies web assets + native deps into the projects
npx cap open android        # build / run from Android Studio
npx cap open ios            # build / run from Xcode
```

`capacitor.config.json` is preconfigured (`appId: com.ninjafruit.game`,
`webDir: "."`, splash + status-bar colours). After any web change, re-run
`npx cap sync`.

### Recommended native add-ons
```bash
npm i @capacitor/status-bar @capacitor/splash-screen @capacitor/haptics
```
- **Haptics** — fire `Haptics.impact()` on slice/bomb for console-grade feel
  (call from the relevant EventBus listeners).
- **Status bar** — set to overlay + dark style to match the dojo theme.

---

## Mobile builds (Cordova — alternative)

```bash
npm i -g cordova
cordova create ninja-native com.ninjafruit.game "Ninja Fruit"
# copy the contents of fruit-ninja/ into ninja-native/www/
cd ninja-native
cordova platform add android ios
cordova build android
```
Set the same `appId`, orientation `portrait`, and background `#06101f` in
`config.xml`.

---

## Pre-deploy checklist
- [ ] Test on real iOS Safari + Android Chrome (touch latency, audio unlock).
- [ ] Verify 60 FPS on a mid-range device (HUD shows live FPS).
- [ ] Confirm LocalStorage persists across reloads.
- [ ] Confirm safe-area insets on a notched device.
- [ ] HTTPS enabled; manifest + icons load; "Add to Home Screen" works.
