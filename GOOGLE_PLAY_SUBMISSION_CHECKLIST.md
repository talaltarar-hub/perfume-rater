# Scentify: Google Play Store Submission Checklist

**Status:** Ready to submit when Google Play Console account verification is complete

---

## Pre-Submission Checklist

### ✅ Code & Repository
- [x] Code pushed to GitHub: https://github.com/talaltarar-hub/perfume-rater
- [x] All features implemented and tested
- [x] No console errors or warnings
- [x] Ready for Capacitor Cloud build

### ✅ App Configuration
- [x] `capacitor.config.ts` configured
- [x] App ID: `com.scentify.app`
- [x] App name: `Scentify`
- [x] Version: 1.0.0
- [x] Build number: 1

### ✅ Android Manifest
- [x] Permissions configured
- [x] Activities defined
- [x] Icons and splash screens prepared

---

## Step-by-Step Submission Guide

### Phase 1: Capacitor Cloud Build (Do This Now)

**Timeline:** ~15 minutes setup + 5-10 minutes build

1. **Create Capacitor Cloud Account**
   - Go to: https://capacitor.ionicframework.com/cloud
   - Sign up with GitHub (talaltarar-hub)
   - Verify email

2. **Connect Repository**
   - Click "New Build"
   - Select: `perfume-rater` repository
   - Platform: Android
   - Click "Connect"

3. **Configure Signing**
   - Click "Generate new signing key"
   - Fill in:
     ```
     Keystore alias: scentify
     Keystore password: [CREATE STRONG PASSWORD - SAVE THIS!]
     Key password: [Same as above]
     Common name: [Your name]
     Organization: [Your name/company]
     Country: US
     ```
   - Click "Generate and Download"
   - **IMPORTANT:** Save the `.jks` file securely
   - Upload `.jks` file to Capacitor Cloud
   - Enter password and save

4. **Start Build**
   - Branch: `main`
   - Build type: `Release`
   - Output: `AAB` (Android App Bundle)
   - Click "Start Build"
   - Wait for completion (5-10 minutes)
   - Download the `.aab` file

### Phase 2: Google Play Console Setup (When Account Verified)

**Timeline:** ~30 minutes

1. **Create App**
   - Go to: https://play.google.com/console
   - Click "Create app"
   - App name: `Scentify`
   - Default language: English
   - App or game: App
   - Free or paid: Free
   - Category: Lifestyle
   - Click "Create app"

2. **Complete App Access**
   - Select appropriate access level
   - Confirm declarations

3. **Content Rating**
   - Complete questionnaire
   - Submit for rating

4. **Target Audience**
   - Age range: 13+
   - Content rating: Everyone

5. **Upload AAB**
   - Navigate to: Release → Production
   - Click "Create new release"
   - Upload your `.aab` file
   - Review and confirm

### Phase 3: Store Listing (When Account Verified)

**Timeline:** ~20 minutes

1. **App Title & Description**
   - Title: `Scentify`
   - Short description (80 chars max):
     ```
     Discover and rate the world's finest perfumes with our community.
     ```
   - Full description (4000 chars max):
     ```
     Scentify is a community-driven perfume rating platform where fragrance 
     enthusiasts discover, rate, and review the world's finest perfumes.
     
     Features:
     - Browse a curated catalog of luxury fragrances
     - Rate perfumes on a 1-10 scale
     - Share detailed reviews with the community
     - Build your personal fragrance collection
     - Discover top-rated scents
     - Connect with fellow perfume lovers
     
     Whether you're searching for your signature scent or exploring new 
     fragrances, Scentify connects you with a passionate community of 
     perfume enthusiasts. Join thousands of users rating and reviewing 
     the world's best fragrances.
     ```

2. **Screenshots**
   - Required: 2-8 screenshots (1080x1920 pixels)
   - Show:
     - Catalog page with perfumes
     - Perfume detail page with rating
     - Rating interface
     - Community scores
     - User profile with top 5 perfumes
   - Tip: Use phone screenshots or create mockups

3. **Feature Graphic**
   - Size: 1024x500 pixels
   - Show app's main value proposition
   - Optional but recommended

4. **App Icon**
   - Size: 512x512 pixels (PNG)
   - Use Scentify logo/icon
   - No transparency needed for Play Store

5. **Permissions**
   - Review and confirm all permissions
   - Camera (for profile photos)
   - Storage (for file uploads)

### Phase 4: Final Review & Submission

**Timeline:** ~5 minutes

1. **Review All Information**
   - Check app name, description, screenshots
   - Verify pricing (Free)
   - Confirm target countries

2. **Submit for Review**
   - Click "Submit"
   - Google typically reviews in 2-4 hours
   - You'll receive email notification

3. **Monitor Status**
   - Check Google Play Console dashboard
   - Look for approval or rejection email
   - If rejected, review feedback and resubmit

---

## Important Information to Save

### Signing Key Details
```
Keystore alias: scentify
Keystore password: [YOUR PASSWORD]
Key password: [YOUR PASSWORD]
```
⚠️ **SAVE THIS SECURELY** - You'll need it for future app updates!

### App Details
- Package name: `com.scentify.app`
- Version: 1.0.0
- Build number: 1
- GitHub repo: https://github.com/talaltarar-hub/perfume-rater

---

## What to Do While Waiting for Account Verification

1. **Prepare Screenshots**
   - Take screenshots of the app on a phone or emulator
   - Crop to 1080x1920 pixels
   - Add text overlays if desired (e.g., "Discover", "Rate", "Share")

2. **Create Feature Graphic**
   - Design a 1024x500 image
   - Show the app's main features
   - Make it eye-catching

3. **Prepare App Icon**
   - Create or download a 512x512 PNG icon
   - Ensure it represents "Scentify" well
   - Test visibility at small sizes

4. **Write Marketing Copy**
   - Polish your app description
   - Prepare review response templates
   - Plan your launch announcement

---

## Timeline Summary

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Capacitor Cloud setup & build | 20 mins | Ready now |
| 2 | Google Play Console setup | 30 mins | Wait for verification |
| 3 | Store listing details | 20 mins | Wait for verification |
| 4 | Final review & submission | 5 mins | Wait for verification |
| 5 | Google review | 2-4 hours | After submission |
| 6 | Live on Play Store! | - | 🎉 |

---

## Next Steps

1. **Immediately:** Set up Capacitor Cloud and build your AAB file
2. **While waiting:** Prepare screenshots, icon, and feature graphic
3. **When verified:** Complete Google Play Console setup and submit
4. **After approval:** Monitor app performance and respond to reviews

---

## Support Resources

- **Capacitor Cloud:** https://capacitor.ionicframework.com/docs
- **Google Play Console:** https://support.google.com/googleplay
- **Android App Publishing:** https://developer.android.com/studio/publish
- **App Store Policies:** https://play.google.com/about/developer-content-policy/

---

**You're ready to launch! 🚀**
