#!/bin/bash

# Scentify - Push Code to GitHub Script
# Run this script on your local computer (not in the sandbox)

echo "🚀 Scentify - GitHub Push Script"
echo "=================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    echo "   Download from: https://git-scm.com/download"
    exit 1
fi

# Configure git
echo "📝 Configuring git..."
git config --global user.email "talaltarar@example.com"
git config --global user.name "talaltarar-hub"

# Initialize git repository
echo "📦 Initializing git repository..."
git init

# Add all files
echo "📄 Adding files..."
git add .

# Create initial commit
echo "💾 Creating commit..."
git commit -m "Initial commit: Scentify perfume rating app with profiles, ratings, and community features"

# Rename branch to main
echo "🔄 Setting up main branch..."
git branch -M main

# Add remote
echo "🔗 Adding GitHub remote..."
git remote add origin https://github.com/talaltarar-hub/perfume-rater.git

# Push to GitHub
echo "📤 Pushing to GitHub..."
echo "   (You may be prompted to enter your GitHub credentials)"
echo ""
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your code has been pushed to GitHub!"
    echo ""
    echo "📍 Repository URL: https://github.com/talaltarar-hub/perfume-rater"
    echo ""
    echo "Next steps:"
    echo "1. Go to Capacitor Cloud to build your Android app"
    echo "2. Follow the GITHUB_AND_LAUNCH_GUIDE.md for more details"
else
    echo ""
    echo "❌ Push failed. Check your GitHub credentials and try again."
    exit 1
fi
