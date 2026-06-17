# Scentify: Android Studio Build Guide

Build your Android app locally using Android Studio and prepare it for Google Play Store submission.

---

## Prerequisites

- Android Studio downloaded from: https://developer.android.com/studio
- Your GitHub repository: https://github.com/talaltarar-hub/perfume-rater
- At least 10GB free disk space
- 4GB+ RAM recommended

---

## Step 1: Install Android Studio

### 1.1 Run the Installer

1. Locate the downloaded Android Studio installer
2. Double-click to run it
3. Follow the installation wizard:
   - Accept the license agreement
   - Choose installation location (default is fine)
   - Select components to install (default is fine)
4. Click **"Finish"** when complete
5. Android Studio will launch for the first time

### 1.2 Complete Setup Wizard

When Android Studio opens, it will show a setup wizard:

1. Click **"Next"** through the welcome screens
2. When asked about **SDK Components**, select:
   - ✅ Android SDK
   - ✅ Android SDK Platform
   - ✅ Android Virtual Device (AVD)
3. Accept the license agreements
4. Click **"Finish"** and wait for downloads to complete (5-15 minutes)

---

## Step 2: Clone Your Project

### 2.1 Open Your Project in Android Studio

1. In Android Studio, click **"File"** → **"New"** → **"Project from Version Control"**
2. Choose **"Git"**
3. Enter your repository URL: `https://github.com/talaltarar-hub/perfume-rater.git`
4. Choose a location to clone (e.g., `~/projects/perfume-rater`)
5. Click **"Clone"**
6. Wait for the project to download and index

### 2.2 Wait for Gradle Sync

Android Studio will automatically sync Gradle:

1. You'll see a progress bar at the bottom
2. Wait for it to complete (this may take 5-10 minutes on first sync)
3. If prompted to update Gradle, click **"Update"**

---

## Step 3: Prepare for Android Build

### 3.1 Update Capacitor Configuration

Before building, ensure your `capacitor.config.ts` is correct:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.scentify.app',
  appName: 'Scentify',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
```

### 3.2 Build Web Assets

Before building Android, you must build your web assets:

```bash
cd /home/ubuntu/perfume-rater
pnpm build
```

This creates the `dist` folder that Android will use.

### 3.3 Sync Android Project

1. In Android Studio, click **"File"** → **"Sync Now"**
2. Wait for Gradle to sync
3. Check for any build errors in the **"Build"** panel at the bottom

---

## Step 4: Build the Android App

### 4.1 Build for Testing (APK)

To test on an emulator or device:

1. Click **"Build"** → **"Build Bundle(s) / APK(s)"** → **"Build APK(s)"**
2. Wait for the build to complete (5-10 minutes)
3. You'll see a notification when done
4. Click **"Locate"** to find the APK file

### 4.2 Build for Release (AAB)

To submit to Google Play Store:

1. Click **"Build"** → **"Build Bundle(s) / APK(s)"** → **"Build Bundle(s)"**
2. Wait for the build to complete (5-10 minutes)
3. You'll see a notification when done
4. Click **"Locate"** to find the AAB file

**The AAB file is what you'll upload to Google Play Store.**

---

## Step 5: Configure Signing (Important!)

### 5.1 Create a Signing Key

Before building for release, you need to sign your app:

1. Click **"Build"** → **"Generate Signed Bundle / APK"**
2. Choose **"Android App Bundle"** (for Play Store)
3. Click **"Next"**
4. Under **"Key store path"**, click **"Create new"**
5. Fill in the form:
   ```
   Key store path: [Choose a location, e.g., ~/scentify.jks]
   Password: [Create a strong password - SAVE THIS!]
   Confirm: [Re-enter password]
   Alias: scentify
   Password: [Same as above]
   Validity: 25 years (or more)
   Common name: Your Name
   Organization: Your Name/Company
   Country: US
   ```
6. Click **"OK"**
7. Click **"Next"**
8. Select **"Release"** build variant
9. Click **"Finish"**
10. Wait for the build to complete

**IMPORTANT:** Save your keystore password securely! You'll need it for future app updates.

---

## Step 6: Locate Your AAB File

After the build completes:

1. You'll see a notification: **"Build Bundle(s) successful"**
2. Click **"Locate"** in the notification
3. Your file explorer will open showing the `.aab` file
4. **Copy this file to a safe location** (e.g., your Desktop or Documents)
5. This is the file you'll upload to Google Play Store

---

## Step 7: Verify the Build

### 7.1 Check Build Output

1. In Android Studio, open the **"Build"** panel (bottom of screen)
2. Look for messages like:
   ```
   Build successful
   Built the following AAB: app-release.aab
   ```

### 7.2 Verify File Size

Your AAB file should be:
- **Typical size:** 10-50 MB
- **If much larger:** Check for unnecessary assets
- **If much smaller:** Verify the build included all code

---

## Troubleshooting

### Build Fails with "Gradle sync failed"

1. Click **"File"** → **"Invalidate Caches"** → **"Invalidate and Restart"**
2. Wait for Android Studio to restart
3. Try building again

### Build Fails with "SDK not found"

1. Click **"File"** → **"Project Structure"**
2. Under **"SDK Location"**, click **"Edit"**
3. Select your Android SDK path (usually in `~/Android/sdk`)
4. Click **"OK"** and try building again

### Build Fails with "Keystore not found"

1. Ensure your keystore file exists at the path you specified
2. Verify the password is correct
3. Try creating a new keystore using the steps in Step 5

### App Crashes After Installation

1. Check the **"Logcat"** panel in Android Studio
2. Look for error messages
3. Review the app's permissions in `AndroidManifest.xml`

---

## Next Steps

Once you have your AAB file:

1. **Save it securely** (you'll need it for submission)
2. **Wait for Google Play Console verification**
3. **Follow GOOGLE_PLAY_SUBMISSION_CHECKLIST.md** to submit

---

## Important Information to Save

```
App Package Name: com.scentify.app
Keystore File: [Your keystore path]
Keystore Password: [Your password]
Keystore Alias: scentify
Alias Password: [Your password]
```

**Keep this information safe!** You'll need it for future app updates.

---

## Support

- **Android Studio Help:** https://developer.android.com/studio/intro
- **Capacitor Android Guide:** https://capacitorjs.com/docs/android
- **Google Play Console Help:** https://support.google.com/googleplay

---

**You're ready to build! Follow the steps above and let me know when you have your AAB file. 🚀**
