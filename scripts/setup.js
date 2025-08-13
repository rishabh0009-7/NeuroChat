#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🚀 AI Chatbot Setup Script");
console.log("==========================\n");

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  console.log("✅ .env.local file already exists");
} else {
  console.log("📝 Creating .env.local file...");

  const envContent = `# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# OpenAI
OPENAI_API_KEY="your_openai_api_key_here"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_publishable_key"
CLERK_SECRET_KEY="sk_test_your_clerk_secret_key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
`;

  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env.local file created");
  console.log(
    "⚠️  Please update the values in .env.local with your actual API keys"
  );
}

console.log("\n📋 Next Steps:");
console.log("1. Update .env.local with your actual API keys");
console.log("2. Run: npm install");
console.log("3. Run: npx prisma generate");
console.log("4. Run: npx prisma db push");
console.log("5. Run: npm run dev");
console.log("\n📖 See SETUP.md for detailed instructions");

console.log("\n🎯 Required Services:");
console.log("- OpenAI API Key: https://platform.openai.com/");
console.log("- Clerk Authentication: https://dashboard.clerk.com/");
console.log("- Neon Database: https://neon.tech/");

console.log("\n✨ Happy coding!");
