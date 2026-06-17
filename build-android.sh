#!/bin/bash

# Scentify Android Build Script for macOS
# This script builds your Android App Bundle (AAB) for Google Play Store

set -e

echo "🚀 Scentify Android Build Script"
echo "=================================="

# Step 1: Build web assets
echo ""
echo "📦 Building web assets..."
pnpm build

# Step 2: Add Android platform if not exists
if [ ! -d "android" ]; then
    echo ""
    echo "📱 Adding Android platform..."
    npx cap add android
fi

# Step 3: Sync Capacitor
echo ""
echo "🔄 Syncing Capacitor..."
npx cap sync android

# Step 4: Build Android App Bundle
echo ""
echo "🏗️  Building Android App Bundle..."
cd android
./gradlew bundleRelease

# Step 5: Locate the AAB file
echo ""
echo "✅ Build complete!"
echo ""
echo "Your AAB file is located at:"
echo "android/app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "📋 Next steps:"
echo "1. Go to Google Play Console"
echo "2. Create your app"
echo "3. Upload this AAB file"
echo "4. Fill in app details and submit for review"
echo ""
echo "🎉 Done!"
