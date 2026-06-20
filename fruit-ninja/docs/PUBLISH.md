# 14. Publishing to Google Play & App Store — Ninja Fruit

Both stores ship the **same Capacitor build**. Below is the end-to-end path.

---

## A. Shared preparation
- **App ID:** `com.ninjafruit.game` (already set in `capacitor.config.json`).
- **Version:** bump in `package.json`, Android `versionCode`/`versionName`,
  iOS `CFBundleShortVersionString`/`CFBundleVersion`.
- **Icons:** generate the full icon set from `assets/icons/icon-512.svg`
  (e.g. with `@capacitor/assets`: `npx @capacitor/assets generate`).
- **Privacy policy URL:** required by both stores (LocalStorage-only, no PII —
  but you still must declare it). Host a simple page.
- **Store listing copy:** title "Ninja Fruit", short + full description, keywords
  (fruit, slice, ninja, arcade, combo), category Games → Arcade.
- **Screenshots:** capture from real devices in each required size; a 15–30 s
  gameplay trailer is strongly recommended.

---

## B. Google Play

### 1. One-time setup
- Create a **Google Play Console** account ($25 one-time).
- Create the app; complete: content rating (IARC questionnaire — likely PEGI 3 /
  Everyone), **Data safety** form (declare "no data collected/shared" if you keep
  it offline), target audience, ads declaration, privacy policy URL.

### 2. Build a signed release (AAB)
```bash
npx cap sync android
# In Android Studio: Build ▸ Generate Signed Bundle/APK ▸ Android App Bundle
```
- Create/keep an **upload keystore** safe (losing it blocks future updates).
- Enroll in **Play App Signing**.
- Set `minSdkVersion 23+`, `targetSdkVersion` to current Play requirement.

### 3. Release
- Upload the `.aab` to **Internal testing** → validate on devices.
- Promote to **Closed** → **Open** → **Production**.
- First review: hours–days.

---

## C. Apple App Store

### 1. One-time setup
- **Apple Developer Program** ($99/year).
- In **App Store Connect**, create the app record; set bundle id
  `com.ninjafruit.game`, age rating, privacy ("Data Not Collected"),
  privacy-policy URL, category Games → Arcade.

### 2. Build & archive
```bash
npx cap sync ios
npx cap open ios
```
In Xcode:
- Set the **Team / signing** (automatic signing is fine).
- Set version + build numbers; deployment target iOS 14+.
- Provide the app icon set and a **launch screen** matching `#06101f`.
- **Product ▸ Archive** → **Distribute App** ▸ App Store Connect ▸ Upload.

### 3. Submit
- In App Store Connect, attach the uploaded build, add screenshots (6.7" + 5.5"
  + iPad if supported), description, keywords, support URL.
- Submit for review (typically 24–48 h). Answer the **export-compliance**
  question (no non-exempt encryption → usually "No").

---

## D. Common rejection pitfalls (and how this build avoids them)
| Pitfall | Mitigation |
|---------|-----------|
| Blank screen on launch | Splash configured; assets are local, no network needed. |
| Audio autoplay blocked | `AudioSystem` creates the context on first user gesture. |
| Tiny tap targets | All buttons ≥48 px; mobile-first CSS. |
| Notch overlap | Safe-area insets honoured in CSS. |
| Privacy form mismatch | Game stores only local progress; declare "no data collected". |
| Performance jank | Object pooling + sprite cache + capped DPR keep 60 FPS. |

---

## E. Post-launch
- Wire analytics (e.g. a privacy-friendly provider) behind the existing EventBus.
- Add rewarded-video + IAP via Capacitor plugins (see `docs/ROADMAP.md`).
- Ship cosmetic seasons; use Play/ASC staged rollouts and A/B store listings.
