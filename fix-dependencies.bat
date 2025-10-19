@echo off
echo 🧹 Cleaning up admin dashboard dependencies...

REM Remove node_modules and package-lock.json
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo 📦 Installing compatible React 18 dependencies...

REM Install dependencies
npm install

echo ✅ Dependencies installed successfully!
echo.
echo 🚀 You can now run: npm run dev
echo.
echo 📝 Note: React has been downgraded to version 18 for better compatibility
echo    with React Router DOM and other libraries.

pause



