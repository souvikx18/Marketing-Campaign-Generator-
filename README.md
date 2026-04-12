# Marketing Campaign Generator

**AI-Powered Marketing Campaign Management Platform**

Marketing Campaign Generator (MCG) is a comprehensive SaaS platform that helps businesses create, manage, and analyze marketing campaigns with the power of AI. From campaign ideation to performance tracking, MCG streamlines the entire marketing workflow.

## ✨ Features

### 🚀 Campaign Management
- **AI Campaign Creation**: Generate complete marketing campaigns with AI assistance
- **Multi-Platform Support**: Create campaigns for Facebook, Instagram, LinkedIn, Twitter, and TikTok
- **Campaign Scheduling**: Plan and schedule campaigns with an integrated calendar
- **Performance Tracking**: Monitor campaign performance with real-time analytics
- **Campaign Templates**: Save and reuse successful campaign structures
- **Audience Management**: Create and manage customer segments

### 🎨 Content Creation
- **AI Content Generation**: Generate ad copy, headlines, and descriptions
- **Image Generation**: Create campaign visuals using AI
- **Content Calendar**: Plan and visualize your content schedule

### 📊 Analytics & Reporting
- **Performance Dashboard**: Track key metrics across all platforms
- **ROI Tracking**: Monitor campaign return on investment
- **A/B Testing**: Compare different campaign variations
- **Trend Analysis**: Identify top-performing content and strategies

### ⚙️ Integrations
- **Social Media Platforms**: Facebook, Instagram, LinkedIn, Twitter, TikTok
- **AI Providers**: OpenAI, Gemini
- **Analytics Tools**: Google Analytics integration
- **CRM Systems**: HubSpot, Salesforce (planned)

### 👤 User Management
- **Role-Based Access**: Admin, Manager, and Editor roles
- **Team Collaboration**: Share campaigns and insights with your team
- **Audit Logs**: Track all account activity

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React
- **State Management**: React Context
- **Forms**: React Hook Form, Zod

### Backend
- **Database**: SQLite (local), PostgreSQL (production)
- **Authentication**: NextAuth.js (Credentials + Google OAuth)
- **AI Integration**: OpenAI API, Gemini API
- **Deployment**: Vercel

## 📂 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/          # Authentication pages
│   ├── (app)/           # Authenticated application routes
│   │   ├── dashboard/   # Dashboard
│   │   ├── campaigns/   # Campaign management
│   │   ├── calendar/    # Calendar view
│   │   ├── analytics/   # Analytics & reports
│   │   ├── audiences/   # Audience management
│   │   ├── templates/   # Template management
│   │   ├── integrations/ # Integrations
│   │   └── settings/    # Settings & billing
│   └── api/             # API routes
├── components/          # Reusable UI components
│   ├── layout/          # Sidebar, TopBar, AppShell
│   ├── ui/              # Primitive components
│   ├── campaigns/       # Campaign-specific components
│   ├── analytics/       # Analytics components
│   └── auth/            # Auth components
├── lib/                 # Utility functions
│   ├── auth.ts          # Authentication configuration
│   ├── db.ts            # Database utilities
│   ├── ai.ts            # AI service integrations
│   ├── utils.ts         # General utilities
│   └── validation.ts    # Validation schemas
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── services/            # Business logic services
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Marketing-Campaign-Generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the project root:
   ```bash
   cp .env.local.example .env.local
   ```

   Add your API keys to `.env.local`:
   ```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   OPENAI_API_KEY=your-openai-key
   GEMINI_API_KEY=your-gemini-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   DATABASE_URL=./mcg.db
   ```

4. **Database Setup**
   Run the database migration:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏃 Usage

### Authentication
- **Sign Up**: Create a new account with email and password
- **Login**: Sign in with your credentials
- **Google OAuth**: Login with your Google account

### Creating a Campaign
1. Navigate to **Campaigns**
2. Click **Create Campaign**
3. Select campaign type (e.g., Product Launch, Brand Awareness)
4. Fill in campaign details
5. AI will generate content and visuals
6. Review and publish

### Using the Command Palette
Press `Ctrl+K` (or `Cmd+K` on Mac) to open the command palette:
- Search campaigns, templates, and audiences
- Quickly navigate between pages
- Create new items
- Access quick actions

## 🎨 Design System

### Color Palette
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#8b5cf6` (Violet)
- **Surface**: `#f8fafc` (Slate 50)
- **Text**: `#0f172a` (Slate 900)

### Typography
- **Font**: Inter
- **Headings**: Bold, 24-32px
- **Body**: Regular, 14-16px

### Spacing
- **Base Unit**: 4px
- **Common Spacing**: 4px, 8px, 12px, 16px, 24px, 32px

## 🧪 Testing

Run tests:
```bash
npm test
# or
yarn test
```

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Import the project
3. Configure environment variables
4. Deploy

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## 📞 Support

For issues and questions, please open an issue on GitHub.

## 📄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## 🔗 Links

- [Project Website](https://your-domain.com) (if available)
- [Documentation](https://docs.your-domain.com) (if available)
- [API Documentation](https://api.your-domain.com) (if available)

---

**Built with ❤️ using Next.js and Tailwind CSS**