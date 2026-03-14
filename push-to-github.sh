#!/bin/bash

echo "========================================"
echo "Git Push Helper Script"
echo "========================================"
echo ""

echo "Step 1: Clearing Git cache..."
git rm -r --cached .
echo ""

echo "Step 2: Adding all files with new .gitignore..."
git add .
echo ""

echo "Step 3: Showing what will be committed..."
git status
echo ""

echo "Step 4: Committing changes..."
git commit -m "Add all project files with correct .gitignore"
echo ""

echo "Step 5: Pushing to GitHub..."
git push origin main
echo ""

echo "========================================"
echo "Done! Check your GitHub repository."
echo "========================================"
