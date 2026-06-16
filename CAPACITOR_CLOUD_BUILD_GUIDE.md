# Scentify: Capacitor Cloud Build Guide for Google Play Store

This guide walks you through building your Android app using Capacitor Cloud, then uploading it to Google Play Store without needing to install Android Studio locally.

---

## Prerequisites

✅ Google Play Developer Account (you have this)
✅ GitHub account (free)
✅ Scentify project code

---

## Step 1: Push Your Project to GitHub

### 1.1 Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `scentify` (or your preferred name)
3. Choose **Public** or **Private** (your choice)
4. Click **Create repository**

### 1.2 Push Your Code to GitHub

In your terminal, navigate to the project directory and run:

```bash
cd /home/ubuntu/perfume-rater
git remote add origin https://github.com/YOUR_USERNAME/scentify.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 2: Set Up Capacitor Cloud

### 2.1 Create a Capacitor Account

1. Go to [capacitor.ionicframework.com/cloud](https://capacitor.ionicframework.com/cloud)
2. Sign up with your GitHub account (this links your repos automatically)
3. Verify your email

### 2.2 Connect Your Repository

1. In Capacitor Cloud dashboard, click **New Build**
2. Select your `scentify` repository
3. Choose **Android** as the platform
4. Click **Connect**

---

## Step 3: Configure Android Signing

Capacitor Cloud will guide you through signing configuration. You'll need:

### 3.1 Create a Signing Key

Capacitor Cloud can generate a signing key for you:

1. In the build configuration, select **Generate new signing key**
2. Fill in the form:
   - **Keystore alias:** `scentify`
   - **Keystore password:** Create a strong password (save this!)
   - **Key password:** Same as keystore password
   - **Common name:** Your name
   - **Organization:** Your company/name
   - **Country:** Your country code (e.g., `US`)

3. Click **Generate and Download**
4. **Save the keystore file securely** — you'll need it for future updates

### 3.2 Upload Keystore to Capacitor Cloud

1. Upload the downloaded `.jks` file to Capacitor Cloud
2. Enter the keystore password
3. Click **Save**

---

## Step 4: Build Your App

### 4.1 Trigger the Build

1. In Capacitor Cloud, click **Build**
2. Select:
   - **Branch:** `main`
   - **Build type:** `Release`
   - **Output format:** `AAB` (Android App Bundle — required for Play Store)

3. Click **Start Build**
4. Wait for the build to complete (typically 5–10 minutes)

### 4.2 Download the AAB

Once the build completes:

1. Click **Download**
2. Save the `.aab` file to your computer
3. Keep this file safe — you'll upload it to Google Play Store

---

## Step 5: Upload to Google Play Store

### 5.1 Create Your App in Google Play Console

1. Go to [play.google.com/console](https://play.google.com/console)
2. Click **Create app**
3. Fill in:
   - **App name:** `Scentify`
   - **Default language:** English
   - **App or game:** App
   - **Free or paid:** Free
   - **Category:** Lifestyle

4. Click **Create app**

### 5.2 Fill in App Details

Complete all required sections:

1. **App access** — Select appropriate access level
2. **Ads** — Declare if your app contains ads (Scentify doesn't)
3. **Content rating questionnaire** — Complete the form
4. **Target audience** — Select your target age group
5. **Content** — Add app description, screenshots, etc.

### 5.3 Upload Your AAB

1. Navigate to **Release** → **Production**
2. Click **Create new release**
3. Under **App bundles and APKs**, click **Upload**
4. Select your downloaded `.aab` file
5. Click **Review**
6. Review the details and click **Confirm**

### 5.4 Add Store Listing Details

Before submitting, fill in:

- **Short description:** (80 characters max)
  - *Example: "Discover and rate the world's finest perfumes with our community."*

- **Full description:** (4000 characters max)
  - *Example: "Scentify is a community-driven perfume rating platform. Discover new fragrances, share your ratings (1–10), and read reviews from fellow perfume enthusiasts. Rate perfumes, build your fragrance journal, and find your next signature scent."*

- **Screenshots:** Upload 2–8 screenshots showing:
  - Catalog page
  - Perfume detail page
  - Rating interface
  - Community scores

- **Feature graphic:** 1024x500 pixels (optional but recommended)

- **Icon:** 512x512 PNG (use your Scentify logo)

### 5.5 Set Pricing & Distribution

1. **Pricing and distribution** → Select countries where your app is available
2. **Content rating** → Complete the questionnaire if not done
3. **Permissions** — Review and confirm

### 5.6 Submit for Review

1. Click **Submit**
2. Google will review your app (typically 2–4 hours)
3. Once approved, your app goes live on Google Play Store! 🎉

---

## Step 6: Monitor Your App

After launch, regularly check:

- **Google Play Console Dashboard** — Monitor downloads, ratings, crashes
- **User reviews** — Respond to feedback and fix reported issues
- **Crash reports** — Fix any bugs users encounter

---

## Future Updates

To release a new version:

1. Update your code in the GitHub repo
2. Push changes: `git push origin main`
3. In Capacitor Cloud, trigger a new build
4. Download the new AAB
5. In Google Play Console, create a new release with the updated AAB
6. Submit for review (typically faster for updates)

---

## Troubleshooting

**Build fails in Capacitor Cloud:**
- Check that your `capacitor.config.ts` is valid
- Ensure all dependencies are installed (`pnpm install`)
- Verify your code builds locally: `pnpm build`

**AAB upload rejected by Google Play:**
- Ensure the AAB is signed with the same keystore
- Check that your app version code is higher than the previous release
- Verify your app's `versionCode` in `android/app/build.gradle`

**App crashes after installation:**
- Check Google Play Console crash reports
- Test on a real device or Android emulator
- Review the app's permissions and required features

---

## Support

For Capacitor Cloud issues: [capacitor.ionicframework.com/docs](https://capacitor.ionicframework.com/docs)

For Google Play Store issues: [support.google.com/googleplay](https://support.google.com/googleplay)

---

**You're all set! Your Scentify app is ready for the world. Good luck! 🌟**
