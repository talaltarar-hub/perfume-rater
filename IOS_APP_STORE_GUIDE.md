# Scentify: iOS App Store Submission Guide

This guide walks you through building and submitting your iOS app to the Apple App Store. **Note: iOS builds require macOS and Xcode.**

---

## Prerequisites

✅ macOS computer (10.15 or later)
✅ Xcode installed (download from App Store)
✅ Apple Developer Account ($99/year) — [developer.apple.com](https://developer.apple.com)
✅ Your Scentify project code

---

## Step 1: Set Up Apple Developer Account

### 1.1 Create/Sign In to Apple Developer Account

1. Go to [developer.apple.com](https://developer.apple.com)
2. Sign in with your Apple ID (or create one)
3. Enroll in the Apple Developer Program ($99/year)
4. Complete your developer profile

### 1.2 Create App ID

1. Go to [developer.apple.com/account](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+**
4. Select **App IDs** → **Continue**
5. Fill in:
   - **Description:** `Scentify`
   - **Bundle ID:** `com.yourcompany.scentify` (replace `yourcompany` with your name/company)
   - **Capabilities:** Enable `Push Notifications` (optional, for future features)
6. Click **Continue** → **Register**

### 1.3 Create Signing Certificates

1. In **Certificates, Identifiers & Profiles**, click **Certificates** → **+**
2. Select **iOS App Development** → **Continue**
3. Follow the prompts to create a certificate signing request (CSR) using Keychain Access
4. Upload the CSR and download the certificate
5. Double-click to install in Keychain

---

## Step 2: Prepare Your Project on macOS

### 2.1 Clone or Download Your Project

```bash
git clone https://github.com/YOUR_USERNAME/scentify.git
cd scentify
```

### 2.2 Install Dependencies

```bash
pnpm install
```

### 2.3 Build Web Assets

```bash
pnpm build
```

### 2.4 Sync Capacitor

```bash
pnpm exec cap sync ios
```

---

## Step 3: Configure Xcode Project

### 3.1 Open the iOS Project

```bash
open ios/App/App.xcworkspace
```

**Important:** Open `.xcworkspace`, not `.xcodeproj`

### 3.2 Configure Signing

1. In Xcode, select **App** in the left sidebar
2. Click the **Signing & Capabilities** tab
3. Under **Team**, select your Apple Developer Team
4. Xcode will automatically manage signing certificates

### 3.3 Set Bundle ID

1. In Xcode, select **App** → **General**
2. Set **Bundle Identifier** to `com.yourcompany.scentify`

### 3.4 Set Version Number

1. In **General** tab, set:
   - **Version:** `1.0.0`
   - **Build:** `1`

---

## Step 4: Build and Archive

### 4.1 Select Release Configuration

1. In Xcode top menu, select **Product** → **Scheme** → **Edit Scheme**
2. Select **Release** under **Run** configuration
3. Click **Close**

### 4.2 Build for Archive

1. In Xcode, select **Product** → **Archive**
2. Wait for the build to complete (5–10 minutes)
3. The archive will appear in the Organizer window

### 4.3 Export for App Store

1. In the Organizer window, select your archive
2. Click **Distribute App**
3. Select **App Store Connect** → **Next**
4. Select **Upload** → **Next**
5. Select your signing team → **Next**
6. Review the details and click **Upload**

---

## Step 5: Submit to App Store Connect

### 5.1 Go to App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Sign in with your Apple ID
3. Click **My Apps**

### 5.2 Create Your App

1. Click **+** → **New App**
2. Fill in:
   - **Platform:** iOS
   - **Name:** `Scentify`
   - **Primary Language:** English
   - **Bundle ID:** Select `com.yourcompany.scentify`
   - **SKU:** `scentify-001`

3. Click **Create**

### 5.3 Fill in App Information

Complete all required sections:

#### App Information
- **Category:** Lifestyle
- **Content rating:** Complete the questionnaire
- **Privacy Policy URL:** (optional, add if you have one)

#### Pricing and Availability
- **Pricing:** Free
- **Availability:** Select countries where your app is available

#### General App Information
- **App Icon:** 1024x1024 PNG
- **Screenshots:** Upload 2–5 screenshots for each device size:
  - iPhone 6.7" (e.g., iPhone 14 Pro Max)
  - iPhone 5.5" (e.g., iPhone 8 Plus)
  - iPad 12.9" (if applicable)

#### Description
- **Name:** `Scentify`
- **Subtitle:** `Discover Your Signature Scent`
- **Description:** 
  ```
  Scentify is a community-driven perfume rating platform. Discover new fragrances, share your ratings (1–10), and read reviews from fellow perfume enthusiasts. Rate perfumes, build your fragrance journal, and find your next signature scent.
  ```
- **Keywords:** `perfume, fragrance, ratings, reviews, community`
- **Support URL:** (your website or contact email)
- **Marketing URL:** (optional)

#### Build
1. Click **+ Build**
2. Select the build you uploaded from Xcode
3. Click **Save**

### 5.4 Add Version Information

1. In **Version Information**, fill in:
   - **Version Number:** `1.0.0`
   - **Release Notes:** 
     ```
     Welcome to Scentify! Discover and rate the world's finest perfumes with our community. Features include:
     - Browse our curated perfume catalog
     - Rate perfumes on a 1–10 scale
     - Share detailed reviews
     - View community ratings and scores
     - Build your personal fragrance journal
     ```

### 5.5 App Review Information

1. Fill in **App Review Information**:
   - **Contact Email:** Your email
   - **Phone Number:** Your phone
   - **Demo Account:** (if your app requires login, provide test credentials)
   - **Notes:** Add any special instructions for reviewers

2. Check the boxes confirming your app complies with App Store guidelines

### 5.6 Submit for Review

1. Click **Submit for Review**
2. Confirm you've reviewed all information
3. Click **Submit**

Apple will review your app (typically 24–48 hours). You'll receive an email when the review is complete.

---

## Step 6: Monitor Your App

After launch, regularly check:

- **App Store Connect Dashboard** — Monitor downloads, ratings, crashes
- **User reviews** — Respond to feedback
- **Crash reports** — Fix any issues

---

## Future Updates

To release a new version:

1. Update your code locally
2. Increment **Version** and **Build** numbers in Xcode
3. Run **Product** → **Archive**
4. Upload to App Store Connect
5. Submit new version for review

---

## Troubleshooting

**Build fails in Xcode:**
- Ensure Xcode is up to date: **Xcode** → **Settings** → **Updates**
- Clean build folder: **Product** → **Clean Build Folder**
- Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData/*`

**Signing issues:**
- Verify your Team is selected in Signing & Capabilities
- Check that your Bundle ID matches your App ID
- Renew certificates if expired

**App rejected by App Review:**
- Check the rejection reason in App Store Connect
- Common issues: missing privacy policy, unclear app purpose, or guideline violations
- Address the issues and resubmit

---

## Support

For Xcode issues: [developer.apple.com/documentation](https://developer.apple.com/documentation)

For App Store Connect issues: [help.apple.com/app-store-connect](https://help.apple.com/app-store-connect)

---

**Your iOS app is ready for the App Store! 🚀**
