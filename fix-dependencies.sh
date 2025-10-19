#!/bin/bash

echo "🧹 Cleaning up admin dashboard dependencies..."

# Remove node_modules and package-lock.json
rm -rf node_modules
rm -f package-lock.json

echo "📦 Installing compatible React 18 dependencies..."

# Install dependencies
npm install

echo "✅ Dependencies installed successfully!"
echo ""
echo "🚀 You can now run: npm run dev"
echo ""
echo "📝 Note: React has been downgraded to version 18 for better compatibility"
echo "   with React Router DOM and other libraries."



