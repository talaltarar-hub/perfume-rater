# Scentify – Complete GitHub & App Store Launch Guide

This guide walks you through pushing your code to GitHub and launching your app on both Google Play Store and Apple App Store.

---

## Part 1: Create GitHub Account (5 minutes)

### Step 1.1: Sign Up
1. Go to **[github.com](https://github.com)**
2. Click **"Sign up"** button (top right)
3. Enter your **email address**
4. Create a **strong password**
5. Choose a **username** (e.g., `perfume-lover`, `your-name`, etc.)
6. Verify your email (GitHub will send you a confirmation email)
7. Complete the setup wizard

### Step 1.2: Verify Your Email
- Check your email inbox for a message from GitHub
- Click the verification link
- Your account is now ready!

---

## Part 2: Push Your Code to GitHub (10 minutes)

### Step 2.1: Create a New Repository on GitHub
1. Log in to GitHub
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `perfume-rater` (or `scentify`)
   - **Description:** `A luxury perfume rating app with community reviews`
   - **Visibility:** Public (so others can see it)
4. Click **"Create repository"**
5. **Copy the repository URL** (looks like: `https://github.com/your-username/perfume-rater.git`)

### Step 2.2: Push Your Code
Open your computer's terminal/command prompt and run these commands:

```bash
# Navigate to your project folder
cd /home/ubuntu/perfume-rater

# Initialize git (if not already done)
git init

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/perfume-rater.git

# Stage all your code
git add .

# Create your first commit
git commit -m "Initial commit: Scentify perfume rating app with profiles, ratings, and community features"

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR-USERNAME` with your actual GitHub username.**

### Step 2.3: Verify on GitHub
1. Go to your GitHub repository URL: `https://github.com/YOUR-USERNAME/perfume-rater`
2. You should see all your code files uploaded
3. ✅ Success! Your code is now on GitHub

---

## Part 3: Build Android App with Capacitor Cloud (15 minutes)

### Step 3.1: Set Up Capacitor Cloud Account
1. Go to **[capacitor.ionicframework.com/cloud](https://capacitor.ionicframework.com/cloud)**
2. Click **"Sign Up"** (or log in if you have an account)
3. Connect your GitHub account
4. Authorize Capacitor Cloud to access your repositories

### Step 3.2: Create a Build
1. In Capacitor Cloud dashboard, click **"New Build"**
2. Select your **GitHub repository** (`perfume-rater`)
3. Select **branch:** `main`
4. Select **platform:** `Android`
5. Click **"Start Build"**
6. **Wait 5-10 minutes** for the build to complete

### Step 3.3: Download the APK/AAB
1. Once the build completes, click **"Download"**
2. You'll get an **AAB file** (Android App Bundle)
3. Save it to your computer

### Step 3.4: Upload to Google Play Store
1. Go to **[play.google.com/console](https://play.google.com/console)**
2. Log in with your Google account
3. Click your **Scentify app**
4. Go to **"Release" → "Production"**
5. Click **"Create new release"**
6. Upload your **AAB file**
7. Fill in:
   - App name: `Scentify`
   - Short description: `Discover and rate the world's finest fragrances with our community`
   - Full description: `Join Scentify, a luxury perfume community where enthusiasts rate, review, and share their favorite fragrances. Rate perfumes 1-10, build your profile, and connect with other perfume lovers.`
   - Screenshots: (add 4-5 screenshots of your app)
   - Icon: (your app icon)
8. Click **"Review"** → **"Confirm"** → **"Start rollout to Production"**
9. ✅ Your app is submitted! Google will review it (2-4 hours)

---

## Part 4: Build iOS App on Your Mac (20 minutes)

**⚠️ Important: This requires a Mac with Xcode installed**

### Step 4.1: Install Xcode (if not already installed)
1. Open **Mac App Store**
2. Search for **"Xcode"**
3. Click **"Install"** (it's large, ~12GB)
4. Wait for installation to complete

### Step 4.2: Create Apple Developer Account
1. Go to **[developer.apple.com](https://developer.apple.com)**
2. Click **"Account"** (top right)
3. Sign in with your Apple ID (or create one)
4. Enroll in **Apple Developer Program** ($99/year)
5. Complete your developer profile

### Step 4.3: Build Your iOS App
1. On your Mac, open **Terminal**
2. Navigate to your project:
   ```bash
   cd /path/to/perfume-rater
   ```
3. Build for iOS:
   ```bash
   pnpm build
   pnpm exec cap sync ios
   ```
4. Open Xcode project:
   ```bash
   open ios/App/App.xcworkspace
   ```
5. In Xcode:
   - Select **"App"** in left sidebar
   - Go to **"Signing & Capabilities"**
   - Select your **Team** (your Apple Developer account)
   - Change **Bundle Identifier** to something unique (e.g., `com.yourname.scentify`)
6. Archive the app:
   - Click **"Product"** → **"Archive"**
   - Wait for the archive to complete
7. Distribute to App Store:
   - In the archive window, click **"Distribute App"**
   - Select **"App Store Connect"**
   - Follow the prompts to upload

### Step 4.4: Submit to Apple App Store
1. Go to **[appstoreconnect.apple.com](https://appstoreconnect.apple.com)**
2. Log in with your Apple ID
3. Click your **Scentify app**
4. Go to **"App Information"** and fill in:
   - App name: `Scentify`
   - Subtitle: `Luxury Perfume Community`
   - Description: `Discover and rate the world's finest fragrances`
5. Go to **"Pricing and Availability"** → Set to **"Free"**
6. Go to **"Build"** → Select your uploaded build
7. Go to **"Version Release"** → Fill in:
   - Release notes: `Initial launch of Scentify - rate perfumes, build your profile, connect with the community`
8. Click **"Submit for Review"**
9. ✅ Your app is submitted! Apple will review it (24-48 hours)

---

## Part 5: Monitor Your App Launches

### Google Play Store
- Check **Google Play Console** → **"Overview"** for status
- Once approved, your app is **live immediately**
- Share the Play Store link: `https://play.google.com/store/apps/details?id=com.yourcompany.scentify`

### Apple App Store
- Check **App Store Connect** → **"TestFlight"** for review status
- Once approved, your app is **live immediately**
- Share the App Store link: `https://apps.apple.com/app/scentify/id...`

---

## Part 6: Post-Launch Checklist

- [ ] Both apps are live on app stores
- [ ] Share links on social media
- [ ] Add perfumes to your catalog via Admin Panel
- [ ] Invite friends to download and rate perfumes
- [ ] Monitor app reviews and ratings
- [ ] Fix any bugs users report
- [ ] Plan new features (search, notifications, etc.)

---

## Troubleshooting

**GitHub Push Issues:**
- Error: "fatal: not a git repository" → Run `git init` first
- Error: "Permission denied" → Check your GitHub credentials
- Error: "Repository not found" → Check your repository URL

**Capacitor Cloud Issues:**
- Build fails → Check that your code compiles locally first (`pnpm build`)
- Can't connect GitHub → Re-authorize Capacitor Cloud to access your GitHub account

**iOS Build Issues:**
- "No provisioning profile" → Ensure you selected your Team in Xcode
- "Code signing error" → Go to Xcode → Preferences → Accounts → Add your Apple ID

**App Store Submission Issues:**
- "App rejected" → Check the rejection reason in the app store console
- "Build not available" → Wait a few minutes for the build to process

---

## Next Steps

1. ✅ Create GitHub account
2. ✅ Push code to GitHub
3. ✅ Build Android with Capacitor Cloud
4. ✅ Submit Android to Google Play Store
5. ✅ Build iOS on your Mac
6. ✅ Submit iOS to Apple App Store
7. ✅ Monitor approvals and go live!

**You're ready to launch Scentify! 🚀**

---

## Support

- **GitHub Help:** [docs.github.com](https://docs.github.com)
- **Capacitor Cloud:** [capacitor.ionicframework.com/cloud](https://capacitor.ionicframework.com/cloud)
- **Google Play Console:** [support.google.com/googleplay](https://support.google.com/googleplay)
- **App Store Connect:** [help.apple.com/app-store-connect](https://help.apple.com/app-store-connect)
