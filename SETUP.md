# AI Chatbot Setup Guide

## 🚀 Quick Start

Follow these steps to get your AI chatbot up and running:

### 1. Environment Configuration

Create a `.env.local` file in your root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# OpenAI
OPENAI_API_KEY="your_openai_api_key_here"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_publishable_key"
CLERK_SECRET_KEY="sk_test_your_clerk_secret_key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Get Your API Keys

#### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

#### Clerk Authentication Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Go to API Keys section
4. Copy the Publishable Key and Secret Key
5. Add them to your `.env.local` file

#### Neon PostgreSQL Database

1. Go to [Neon](https://neon.tech/)
2. Sign up and create a new project
3. Get your connection string
4. Add it to your `.env.local` file as `DATABASE_URL`

### 3. Database Setup

Run these commands to set up your database:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push the database schema
npx prisma db push

# Optional: View your database in Prisma Studio
npx prisma studio
```

### 4. Start Development Server

```bash
npm run dev
```

Your chatbot will be available at `http://localhost:3000`

## 🔧 Features

- **Real-time AI Chat**: Powered by OpenAI GPT-4 models
- **Conversation Management**: Create, archive, pin, and delete conversations
- **User Authentication**: Secure login with Clerk
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode**: Automatic theme switching
- **Message Streaming**: Real-time AI responses
- **Conversation History**: Persistent chat history
- **Model Selection**: Choose between different AI models

## 📱 Usage

1. **Sign Up/In**: Create an account or sign in
2. **Start Chatting**: Begin a new conversation
3. **Choose Model**: Select your preferred AI model
4. **Send Messages**: Type your questions or requests
5. **Manage Conversations**: Use the sidebar to organize your chats

## 🛠️ Customization

### Adding New AI Models

Edit `components/chat/chat-input.tsx` to add more models:

```typescript
const models = [
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet" }, // Add new models here
];
```

### Styling

The app uses Tailwind CSS. Customize colors and styles in `tailwind.config.ts`.

### Database Schema

Modify the database structure in `prisma/schema.prisma` and run `npx prisma db push` to apply changes.

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Check your `DATABASE_URL` in `.env.local`
   - Ensure Neon database is running
   - Run `npx prisma generate` and `npx prisma db push`

2. **OpenAI API Error**

   - Verify your `OPENAI_API_KEY` is correct
   - Check your OpenAI account has credits
   - Ensure the API key has proper permissions

3. **Authentication Issues**

   - Verify Clerk keys are correct
   - Check Clerk application settings
   - Ensure redirect URLs are configured

4. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Restart development server

### Getting Help

- Check the browser console for error messages
- Verify all environment variables are set
- Ensure all dependencies are installed
- Check that your database is accessible

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Regularly rotate your API keys
- Monitor your OpenAI usage and costs
- Implement rate limiting for production use

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

- **Netlify**: Similar to Vercel
- **Railway**: Good for full-stack apps
- **DigitalOcean**: More control, requires more setup

## 📈 Next Steps

- Add user settings and preferences
- Implement conversation sharing
- Add file upload support
- Create user analytics dashboard
- Add team collaboration features
- Implement conversation templates

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Happy Chatting! 🤖💬**
