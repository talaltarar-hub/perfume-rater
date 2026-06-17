# Scentify: Capacitor Cloud Quick Start

Your GitHub repository is ready: **https://github.com/talaltarar-hub/perfume-rater**

Follow these steps to build your Android app using Capacitor Cloud.

---

## Step 1: Create Capacitor Cloud Account (5 minutes)

1. Go to: **https://capacitor.ionicframework.com/cloud**
2. Click **"Sign up"** or **"Get started"**
3. Click **"Sign up with GitHub"**
4. GitHub will ask for authorization - click **"Authorize"**
5. Complete the Capacitor signup
6. **Verify your email** (check inbox)

---

## Step 2: Connect Your Repository (3 minutes)

1. In Capacitor Cloud dashboard, click **"New Build"**
2. Select your **`perfume-rater`** repository from the list
3. Choose **Android** as the platform
4. Click **"Connect"** or **"Next"**

---

## Step 3: Configure Signing (5 minutes)

Capacitor Cloud will ask for signing configuration. Do this:

1. Click **"Generate new signing key"**
2. Fill in the form with:
   - **Keystore alias:** `scentify`
   - **Keystore password:** Create a strong password (example: `MySecurePass123!`) - **SAVE THIS!**
   - **Key password:** Same as keystore password
   - **Common name:** Your name (example: `Talal Tarar`)
   - **Organization:** Your name or company (example: `Talal Tarar`)
   - **Country:** `US` (or your country code)

3. Click **"Generate and Download"**
4. **IMPORTANT:** Save the `.jks` file to your computer - you'll need it for future updates!
5. Upload the `.jks` file back to Capacitor Cloud
6. Enter your keystore password
7. Click **"Save"**

---

## Step 4: Build Your App (10 minutes)

1. In Capacitor Cloud, click **"Build"** or **"Start Build"**
2. Select:
   - **Branch:** `main`
   - **Build type:** `Release`
   - **Output format:** `AAB` (Android App Bundle)
3. Click **"Start Build"**
4. **Wait for the build to complete** (usually 5-10 minutes)
5. You'll see a progress indicator - wait until it's done

---

## Step 5: Download Your App (2 minutes)

1. Once the build completes, click **"Download"**
2. Save the `.aab` file to your computer
3. **Keep this file safe** - you'll upload it to Google Play Store

---

## What You'll Have

After completing these steps:

✅ **Android App Bundle (.aab file)** - Ready to upload to Google Play Store
✅ **Signing Key (.jks file)** - For signing future app updates
✅ **Capacitor Cloud Build History** - For rebuilding anytime

---

## Next Steps

When your **Google Play Console account is verified**, you'll:

1. Create an app in Google Play Console
2. Upload your `.aab` file
3. Add app description, screenshots, and icon
4. Submit for review
5. Your app goes live! 🎉

---

## Important: Save Your Signing Key

**Do NOT lose your `.jks` file or keystore password!** You'll need them to:
- Update your app in the future
- Sign new versions
- Maintain app continuity on Google Play Store

Store them securely (password manager, secure folder, etc.)

---

## Troubleshooting

**Build fails?**
- Check your GitHub repository is public or Capacitor has access
- Ensure your code builds locally: `pnpm build`
- Check `capacitor.config.ts` for errors

**Can't download AAB?**
- Wait for build to fully complete (check progress indicator)
- Try refreshing the page
- Check browser downloads folder

**Need help?**
- Capacitor Cloud docs: https://capacitor.ionicframework.com/docs
- Google Play Console help: https://support.google.com/googleplay

---

**You're ready! Start with Step 1 above. 🚀**
