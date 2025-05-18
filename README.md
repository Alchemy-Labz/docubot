# DocuBot - Your Interactive Document Companion

<div align="center">
  <img src="public/logo.png" alt="DocuBot Logo" width="120" height="120">
  
  <p align="center">
    Transform your PDFs and documents into interactive conversations powered by AI
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

## 🚀 Features

### Document Management

- **Multi-format Support**: Upload and process PDF, TXT, Markdown, and RTF files
- **Secure Storage**: Files stored in Firebase Storage with user-specific access
- **Document Viewer**: In-browser viewing for PDFs and text documents
- **File Management**: Download, delete, and organize your documents

### AI-Powered Chat

- **Intelligent Q&A**: Ask questions about your documents and get contextual answers
- **Chat History**: Persistent conversation history for each document
- **RAG Pipeline**: Advanced retrieval-augmented generation using Pinecone vector database
- **Context Awareness**: AI understands document context and previous conversations

### User Experience

- **Authentication**: Secure login with Clerk (supports GitHub, Google, MetaMask)
- **Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes with system preference support
- **Real-time Updates**: Live chat updates using Firebase real-time listeners

### Subscription Management

- **Free Tier**: 2 documents, 3 questions per document
- **Pro Plan**: 52 documents, 25 questions per document
- **Stripe Integration**: Secure payment processing and subscription management
- **Usage Tracking**: Real-time monitoring of document and question limits

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom color system
- **UI Components**: ShadCN/UI with Radix primitives
- **Animations**: Framer Motion
- **State Management**: React Hooks + Context

### Backend

- **Database**: Firebase Firestore
- **Storage**: Firebase Cloud Storage
- **Authentication**: Clerk Auth
- **Vector Database**: Pinecone
- **AI/ML**: OpenAI GPT-4 + LangChain
- **Payments**: Stripe

### Infrastructure

- **Hosting**: Vercel
- **Monitoring**: Sentry
- **Analytics**: Vercel Analytics + Speed Insights
- **CDN**: Vercel Edge Network

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Firebase project with Firestore and Storage enabled
- Clerk application for authentication
- OpenAI API key
- Pinecone account and API key
- Stripe account for payments
- Sentry account for error monitoring (optional)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/docubot.git
   cd docubot
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   WEBHOOK_SECRET=your_clerk_webhook_secret

   # Firebase Configuration
   FIREBASE_SERVICE_KEY=your_firebase_service_account_json
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # Pinecone
   PINECONE_API_KEY=your_pinecone_api_key

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_API_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Sentry (optional)
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

   # Base URL
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Configure Firebase**

   - Create a new Firebase project
   - Enable Firestore and Storage
   - Download service account key and add to environment variables
   - Update Firebase configuration in `firebase.ts` and `firebaseAdmin.ts`

5. **Set up Pinecone**

   - Create a Pinecone index named "docubot"
   - Configure index settings as needed

6. **Configure Clerk**

   - Set up authentication providers (GitHub, Google, MetaMask)
   - Configure webhook endpoints
   - Add redirect URLs

7. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

### Getting Started

1. **Sign Up/Login**: Create an account or sign in using your preferred method
2. **Upload Document**: Drag and drop or click to upload your first document
3. **Start Chatting**: Ask questions about your document and get AI-powered answers
4. **Manage Documents**: View, download, or delete documents from your dashboard

### Supported File Types

- **PDF**: `.pdf` files
- **Text**: `.txt` files
- **Markdown**: `.md` files
- **Rich Text**: `.rtf` files

### Chat Features

- Ask specific questions about your documents
- Reference previous conversations
- Get contextual answers based on document content
- Export chat conversations

### Subscription Management

- Upgrade to Pro for more documents and questions
- Manage billing through Stripe customer portal
- Track usage limits in real-time

## 🔌 API Routes

### Authentication

- `POST /api/clerk-webhook` - Handles Clerk user events
- `POST /api/firebase-token` - Generates Firebase custom tokens

### File Management

- `POST /api/convert-rtf` - Converts RTF files for display

### Payments

- `POST /api/stripe-webhook` - Handles Stripe payment events

### Server Actions

- `generateVectorEmbeddings` - Creates embeddings for uploaded documents
- `askQuestion` - Processes chat questions with AI
- `deleteDocument` - Removes documents and associated data
- `createCheckoutSession` - Creates Stripe checkout sessions
- `createStripePortal` - Generates Stripe customer portal links

## 📱 Mobile Support

DocuBot is fully responsive and optimized for mobile devices:

- Adaptive layouts for different screen sizes
- Touch-friendly interface
- Mobile-specific navigation patterns
- Optimized document viewing experience

## 🔒 Security

- **Authentication**: Secure user authentication with Clerk
- **Authorization**: User-specific data access controls
- **File Security**: Secure file storage with Firebase rules
- **API Protection**: Rate limiting and input validation
- **HTTPS**: SSL encryption for all communications

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

### Domain Configuration

- Update `NEXT_PUBLIC_BASE_URL` for production
- Configure Clerk redirect URLs
- Update Stripe webhook endpoints

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint rules provided in the project
- Write responsive, accessible code
- Test across different devices and browsers
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please:

- Check the [documentation](docs/)
- Open an issue on GitHub
- Contact our support team at support@docubot.app

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for GPT-4 API
- [LangChain](https://langchain.com) for RAG implementation
- [Pinecone](https://pinecone.io) for vector database
- [Clerk](https://clerk.dev) for authentication
- [Firebase](https://firebase.google.com) for backend services
- [Vercel](https://vercel.com) for hosting
- [Stripe](https://stripe.com) for payment processing

---

<div align="center">
  <p>Built with ❤️ by the DocuBot Team</p>
  <p>
    <a href="https://docubot.app">Website</a> •
    <a href="https://twitter.com/DocuBotAI">Twitter</a> •
    <a href="https://github.com/your-username/docubot">GitHub</a>
  </p>
</div>
