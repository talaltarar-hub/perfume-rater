# Scentify – App Store Deployment Guide

This guide covers deploying Scentify to the Apple App Store and Google Play Store.

## Prerequisites

- **macOS** (required for iOS deployment)
- **Xcode** (for iOS) – install via App Store
- **Android Studio** (for Android) – download from [developer.android.com](https://developer.android.com/studio)
- **Apple Developer Account** ($99/year)
- **Google Play Developer Account** ($25 one-time)
- **Capacitor** – already configured in this project

## Project Structure

```
perfume-rater/
├── ios/                    # Xcode project
├── android/                # Android Studio project
├── capacitor.config.ts     # Capacitor configuration
├── dist/public/            # Web assets (built from React)
└── package.json
```

## Building for Production

### 1. Build Web Assets

```bash
pnpm build
pnpm exec cap sync
```

This creates optimized web assets in `dist/public/` and syncs them to both iOS and Android projects.

---

## iOS Deployment

### Prerequisites

1. **Apple Developer Account** – enroll at [developer.apple.com](https://developer.apple.com)
2. **Xcode** – install from App Store
3. **Certificates & Identifiers** – set up in Apple Developer portal

### Step 1: Configure App ID

1. Open `ios/App/App.xcodeproj` in Xcode
2. Select the "App" target
3. Go to **Signing & Capabilities**
4. Set **Bundle Identifier** to `com.scentify.app`
5. Select your **Team** (your Apple Developer account)

### Step 2: Update App Information

1. In Xcode, select the "App" target
2. Go to **General** tab
3. Update:
   - **Display Name**: "Scentify"
   - **Version**: `1.0.0`
   - **Build**: `1`
   - **Supported Destinations**: iPhone, iPad

### Step 3: Create App Store Connect Record

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+ New App**
3. Select **iOS**
4. Fill in:
   - **Name**: "Scentify"
   - **Bundle ID**: `com.scentify.app` (must match Xcode)
   - **SKU**: `scentify-001`
   - **User Access**: Select appropriate access level

### Step 4: Add App Screenshots & Metadata

1. In App Store Connect, go to your app
2. Under **App Information**:
   - Add app icon (1024×1024 PNG)
   - Add screenshots for all device sizes
   - Write app description, keywords, support URL
3. Under **Pricing and Availability**:
   - Set price (free recommended)
   - Select territories

### Step 5: Build & Submit

```bash
# In Xcode
1. Select "App" target
2. Select "Generic iOS Device" (or your connected device)
3. Product → Archive
4. Organizer window opens → Distribute App
5. Select "App Store Connect"
6. Follow the submission wizard
```

**Or use command line:**

```bash
cd ios/App
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -derivedDataPath build archive -archivePath build/App.xcarchive
xcodebuild -exportArchive -archivePath build/App.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath build/ipa
```

### Step 6: Review & Release

1. In App Store Connect, wait for **Waiting for Review** status
2. Apple reviews your app (typically 24–48 hours)
3. Once approved, click **Release this Version**
4. App appears on App Store within a few hours

---

## Android Deployment

### Prerequisites

1. **Google Play Developer Account** – sign up at [play.google.com/console](https://play.google.com/console)
2. **Android Studio** – download and install
3. **Keystore file** – for signing the APK/AAB

### Step 1: Create a Keystore

```bash
keytool -genkey -v -keystore scentify-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias scentify-key \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD
```

**Save this file securely** — you'll need it for all future updates.

### Step 2: Configure Signing in Android Studio

1. Open `android/` folder in Android Studio
2. Go to **File** → **Project Structure**
3. Select **app** module
4. Go to **Signing Configs** tab
5. Click **+** to add a new config:
   - **Name**: `release`
   - **Keystore file**: Select your `scentify-release.keystore`
   - **Keystore password**: Enter your store password
   - **Key alias**: `scentify-key`
   - **Key password**: Enter your key password

### Step 3: Build Release AAB

```bash
cd android
./gradlew bundleRelease
```

This creates `android/app/build/outputs/bundle/release/app-release.aab`

### Step 4: Create Google Play App

1. Go to [play.google.com/console](https://play.google.com/console)
2. Click **Create app**
3. Fill in:
   - **App name**: "Scentify"
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free
4. Accept declarations and create

### Step 5: Add App Information

1. In Google Play Console, go to your app
2. Under **App content**:
   - Add app icon (512×512 PNG)
   - Add screenshots (min 2, up to 8 per device type)
   - Write short description (80 chars max)
   - Write full description (4000 chars max)
   - Add screenshots for phones, tablets, wearables
3. Under **App rating**:
   - Complete the content rating questionnaire
4. Under **Target audience**:
   - Select appropriate age group
5. Under **Content rating**:
   - Complete content rating form

### Step 6: Upload AAB

1. In Google Play Console, go to **Release** → **Production**
2. Click **Create new release**
3. Upload your `app-release.aab` file
4. Review the app details
5. Click **Review release**
6. Click **Start rollout to Production**

### Step 7: Review & Release

1. Google reviews your app (typically 2–4 hours, sometimes longer)
2. Once approved, your app goes live on Google Play
3. Users can find it by searching "Scentify"

---

## Post-Launch

### Monitor Performance

- **App Store Connect**: View downloads, crashes, reviews
- **Google Play Console**: View installs, crashes, user ratings

### Handle Updates

To push an update:

1. Update version in `capacitor.config.ts` and `package.json`
2. Make code changes
3. Run `pnpm build && pnpm exec cap sync`
4. Rebuild and re-sign the app
5. Upload new AAB/IPA to respective stores

### Troubleshooting

**iOS build fails**: Ensure Xcode is up to date and certificates are valid
**Android build fails**: Check `gradle.properties` and ensure Java version matches Android Studio requirements
**App crashes on launch**: Check `.manus-logs/browserConsole.log` for errors

---

## PWA (Progressive Web App)

Your app is also available as a PWA at `https://scentify-c9d3futg.manus.space`

Users can:
- Visit in browser
- Click "Add to Home Screen" (iOS Safari) or "Install app" (Chrome)
- Use offline with cached assets
- Receive push notifications (if configured)

No app store submission needed for PWA.

---

## Support

For issues with Capacitor: [capacitorjs.com/docs](https://capacitorjs.com/docs)
For iOS deployment: [developer.apple.com](https://developer.apple.com)
For Android deployment: [developer.android.com](https://developer.android.com)
