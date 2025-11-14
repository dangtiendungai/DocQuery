# DocQuery

> Retrieval-Augmented Generation (RAG) made simple. Upload documents, ask questions, get answers with citations.

DocQuery is a full-stack RAG application built with Next.js, Supabase, and OpenAI. It allows users to upload documents, automatically chunk and embed them, and query them using natural language with AI-powered answers.

## ✨ Features

- 📄 **Multi-format Support**: Upload PDFs, DOCX, TXT, and HTML files
- 🤖 **AI-Powered Answers**: Get intelligent responses using OpenAI GPT models
- 🔍 **Semantic Search**: Vector similarity search using pgvector
- 💬 **Persistent Conversations**: Save and manage multiple chat sessions
- 🔒 **Secure & Private**: Row-level security ensures data isolation
- 📚 **Citation Tracking**: Every answer includes source document citations
- 💳 **Subscription Management**: Stripe integration for premium plans
- 👤 **User Profiles**: Manage account settings, security, and membership
- 📧 **Email Verification**: Secure email verification flow
- 🔐 **Password Reset**: Forgot password and reset functionality
- ⚡ **Fast & Scalable**: Optimized for performance with Supabase

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js App   │
│  (React/TypeScript) │
└────────┬────────┘
         │
         ├───► Supabase Auth (User Authentication)
         │
         ├───► Supabase Database (PostgreSQL + pgvector)
         │     ├── documents table
         │     ├── document_chunks table (with embeddings)
         │     ├── conversations table
         │     ├── messages table
         │     ├── subscriptions table
         │     └── contact_submissions table
         │
         ├───► Supabase Storage (File Storage)
         │
         ├───► OpenAI API (Embeddings & Chat Completions)
         │
         └───► Stripe API (Payment Processing & Subscriptions)
```

### Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL with pgvector extension
- **Storage**: Supabase Storage
- **AI**: OpenAI (embeddings & chat completions)
- **Authentication**: Supabase Auth (email/password + OAuth)
- **Payments**: Stripe (checkout, subscriptions, webhooks)
- **UI Components**: Lucide React icons, react-toastify notifications

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account ([sign up free](https://supabase.com))
- (Optional) An OpenAI API key ([get one here](https://platform.openai.com))

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd DocQuery
npm install
```

### 2. Set Up Supabase

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run database migrations**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the migrations in order:
     ```sql
     -- Run these in sequence:
     -- 1. supabase/migrations/001_initial_schema.sql
     -- 2. supabase/migrations/002_update_match_function.sql
     -- 3. supabase/migrations/003_conversations_and_messages.sql
     -- 4. supabase/migrations/004_contact_submissions.sql
     -- 5. supabase/migrations/005_subscriptions.sql
     ```

3. **Create storage bucket**:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `documents`
   - Set it to **Private**
   - The RLS policies are already set up in the migration

4. **Get your Supabase credentials**:
   - Go to Project Settings → API
   - Copy your `Project URL` and `anon/public` key

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional (for AI features)
OPENAI_API_KEY=sk-your_openai_key_here

# Optional (for Stripe subscriptions)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID_STARTER=price_your_starter_price_id
STRIPE_PRICE_ID_GROWTH=price_your_growth_price_id
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional (redirects)
NEXT_PUBLIC_POST_LOGIN_REDIRECT=/chats
NEXT_PUBLIC_DOCQUERY_POST_SIGNUP_REDIRECT=/login
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Set Up Stripe (Optional - for subscriptions)

1. **Create a Stripe account** at [stripe.com](https://stripe.com)
2. **Create products and prices** in Stripe Dashboard:
   - Create a "Starter" product with a recurring price
   - Create a "Growth" product with a recurring price
   - Copy the Price IDs (e.g., `price_xxxxx`)
3. **Set up webhooks**:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the webhook signing secret
4. **Add Stripe keys to `.env.local`**:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_`)
   - `STRIPE_WEBHOOK_SECRET`: Webhook signing secret (starts with `whsec_`)
   - `STRIPE_PRICE_ID_STARTER`: Your Starter plan price ID
   - `STRIPE_PRICE_ID_GROWTH`: Your Growth plan price ID
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (from Project Settings → API)

### 6. Create Your First Account

1. Click "Get started" or navigate to `/register`
2. Sign up with email/password or Google OAuth
3. Verify your email (if email verification is enabled)
4. Start uploading documents!

## 📚 Database Schema

### Documents Table

Stores document metadata and processing status.

```sql
documents
├── id (UUID)
├── user_id (UUID) → auth.users
├── name (TEXT)
├── file_type (TEXT: pdf, docx, txt, html)
├── file_size (BIGINT)
├── file_url (TEXT)
├── storage_path (TEXT)
├── text_content (TEXT)
├── chunk_count (INTEGER)
├── status (TEXT: processing, processed, error)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### Document Chunks Table

Stores text chunks with vector embeddings.

```sql
document_chunks
├── id (UUID)
├── document_id (UUID) → documents
├── user_id (UUID) → auth.users
├── chunk_index (INTEGER)
├── content (TEXT)
├── start_char (INTEGER)
├── end_char (INTEGER)
├── token_count (INTEGER)
├── embedding (VECTOR(1536)) -- OpenAI embeddings
└── created_at (TIMESTAMP)
```

### Conversations & Messages

Stores chat history and messages.

```sql
conversations
├── id (UUID)
├── user_id (UUID) → auth.users
├── title (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

messages
├── id (UUID)
├── conversation_id (UUID) → conversations
├── user_id (UUID) → auth.users
├── role (TEXT: user, assistant)
├── content (TEXT)
├── citations (TEXT[])
└── created_at (TIMESTAMP)

subscriptions
├── id (UUID)
├── user_id (UUID) → auth.users
├── stripe_customer_id (TEXT)
├── stripe_subscription_id (TEXT)
├── stripe_price_id (TEXT)
├── plan (TEXT: starter, growth, enterprise)
├── status (TEXT: active, trialing, past_due, canceled)
├── current_period_start (TIMESTAMP)
├── current_period_end (TIMESTAMP)
├── cancel_at_period_end (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

contact_submissions
├── id (UUID)
├── name (TEXT)
├── email (TEXT)
├── company (TEXT)
├── message (TEXT)
└── created_at (TIMESTAMP)
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Your Supabase anonymous key |
| `OPENAI_API_KEY` | ❌ No | OpenAI API key for AI features |
| `STRIPE_SECRET_KEY` | ❌ No | Stripe secret key (for subscriptions) |
| `STRIPE_WEBHOOK_SECRET` | ❌ No | Stripe webhook signing secret |
| `STRIPE_PRICE_ID_STARTER` | ❌ No | Stripe price ID for Starter plan |
| `STRIPE_PRICE_ID_GROWTH` | ❌ No | Stripe price ID for Growth plan |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ No | Supabase service role key (for webhooks) |
| `NEXT_PUBLIC_POST_LOGIN_REDIRECT` | ❌ No | Redirect after login (default: `/chats`) |
| `NEXT_PUBLIC_DOCQUERY_POST_SIGNUP_REDIRECT` | ❌ No | Redirect after signup (default: `/login`) |

### Without OpenAI

DocQuery works without OpenAI, but with limited functionality:
- ✅ Document upload and storage
- ✅ Text search (keyword-based)
- ❌ Semantic search (vector similarity)
- ❌ AI-generated answers (falls back to simple text concatenation)

## 📖 API Reference

### Authentication

All API requests require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Get the token from `supabase.auth.getSession()` on the client side.

### Document API

#### `GET /api/documents`

Fetch all documents for the authenticated user.

**Response:**
```json
{
  "documents": [
    {
      "id": "uuid",
      "name": "document.pdf",
      "file_type": "pdf",
      "file_size": 1024000,
      "chunk_count": 25,
      "status": "processed",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `POST /api/documents/upload`

Upload and process a new document.

**Request:** `FormData` with `file` field

**Response:**
```json
{
  "document": {
    "id": "uuid",
    "name": "document.pdf",
    "chunkCount": 25
  }
}
```

#### `DELETE /api/documents/[id]`

Delete a document and all its chunks.

### Query API

#### `POST /api/query`

Query documents and get AI-powered answers.

**Request:**
```json
{
  "query": "What does the refund policy say?",
  "limit": 5
}
```

**Response:**
```json
{
  "answer": "The refund policy states that...",
  "citations": [
    "Refund Policy.pdf · Chunk 3",
    "Terms of Service.pdf · Chunk 12"
  ],
  "sources": [...]
}
```

### Conversations API

#### `GET /api/conversations`

List all conversations for the authenticated user.

#### `POST /api/conversations`

Create a new conversation.

**Request:**
```json
{
  "title": "New Chat"
}
```

#### `GET /api/conversations/[id]`

Get a conversation with its messages.

#### `DELETE /api/conversations/[id]`

Delete a conversation (messages cascade delete).

### Subscriptions API

#### `GET /api/subscriptions`

Get the authenticated user's subscription status.

**Response:**
```json
{
  "subscription": {
    "id": "uuid",
    "plan": "starter",
    "status": "active",
    "current_period_end": "2024-02-01T00:00:00Z",
    "cancel_at_period_end": false
  }
}
```

#### `POST /api/subscriptions/verify`

Verify and sync subscription from Stripe checkout session.

**Request:**
```json
{
  "sessionId": "cs_test_xxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "subscription": { ... }
}
```

#### `POST /api/checkout`

Create a Stripe checkout session for subscription.

**Request:**
```json
{
  "plan": "starter",
  "priceId": "price_xxxxx"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_xxxxx",
  "url": "https://checkout.stripe.com/..."
}
```

#### `POST /api/webhooks/stripe`

Stripe webhook endpoint for handling subscription events.

**Events handled:**
- `checkout.session.completed`: Creates subscription record
- `customer.subscription.updated`: Updates subscription status
- `customer.subscription.deleted`: Updates subscription status

### Messages API

#### `POST /api/messages`

Create a new message in a conversation.

**Request:**
```json
{
  "conversation_id": "uuid",
  "role": "user",
  "content": "What is the refund policy?",
  "citations": []
}
```

## 🗄️ Database Migrations

Migrations are located in `supabase/migrations/`. Run them in order:

1. **001_initial_schema.sql**: Creates documents and document_chunks tables, enables pgvector
2. **002_update_match_function.sql**: Updates vector search function with user filtering
3. **003_conversations_and_messages.sql**: Creates conversations and messages tables
4. **004_contact_submissions.sql**: Creates contact_submissions table
5. **005_subscriptions.sql**: Creates subscriptions table for Stripe integration

To run migrations:

1. Open Supabase SQL Editor
2. Copy and paste each migration file
3. Execute in order

## 🚢 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Add Environment Variables**:
   - In Vercel project settings, add all variables from `.env.example`
   - Make sure to add both `NEXT_PUBLIC_*` and server-side variables

4. **Deploy**:
   - Vercel will automatically detect Next.js and deploy
   - Your app will be live at `your-project.vercel.app`

### Environment Variables in Production

Make sure to set these in your deployment platform:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Optional:**
- `OPENAI_API_KEY` (for AI features)
- `STRIPE_SECRET_KEY` (for subscriptions)
- `STRIPE_WEBHOOK_SECRET` (for Stripe webhooks)
- `STRIPE_PRICE_ID_STARTER` (Starter plan price ID)
- `STRIPE_PRICE_ID_GROWTH` (Growth plan price ID)
- `SUPABASE_SERVICE_ROLE_KEY` (for webhooks and admin operations)
- `NEXT_PUBLIC_POST_LOGIN_REDIRECT` (default: `/chats`)
- `NEXT_PUBLIC_DOCQUERY_POST_SIGNUP_REDIRECT` (default: `/login`)

**Important:** After deploying, update your Stripe webhook endpoint URL to point to your production domain: `https://your-domain.com/api/webhooks/stripe`

## 🛠️ Development

### Project Structure

```
DocQuery/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── checkout/      # Stripe checkout
│   │   ├── conversations/ # Conversation management
│   │   ├── documents/    # Document operations
│   │   ├── messages/     # Message operations
│   │   ├── subscriptions/ # Subscription management
│   │   ├── webhooks/     # Stripe webhooks
│   │   └── query/        # RAG query endpoint
│   ├── auth/              # Auth callbacks
│   ├── chats/             # Chat interface
│   ├── docs/              # Documentation page
│   ├── documents/         # Document viewer
│   ├── forgot-password/   # Password reset
│   ├── login/             # Login page
│   ├── pricing/           # Pricing & checkout
│   ├── profile/           # User profile
│   ├── product/           # Product page
│   ├── register/          # Registration page
│   └── verify-email/      # Email verification
├── components/            # React components
│   ├── documents/         # Document-related components
│   ├── layout/            # Header, Footer
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── TextField.tsx
│       ├── Tabs.tsx
│       └── ConfirmDialog.tsx
├── lib/                   # Utility functions
│   ├── documentProcessor.ts  # Text extraction & chunking
│   ├── llm.ts             # OpenAI integration
│   ├── rateLimit.ts       # API rate limiting
│   ├── export.ts          # Export utilities
│   └── supabaseClient.ts  # Supabase client
├── supabase/
│   └── migrations/        # Database migrations
└── public/                # Static assets
```

### Key Files

**Core Functionality:**
- `lib/documentProcessor.ts`: Handles PDF, DOCX, TXT, HTML text extraction
- `lib/llm.ts`: OpenAI API integration for embeddings and chat
- `app/api/query/route.ts`: RAG query endpoint with vector search
- `app/api/documents/upload/route.ts`: Document upload and processing

**Payment & Subscriptions:**
- `app/api/checkout/route.ts`: Stripe checkout session creation
- `app/api/webhooks/stripe/route.ts`: Stripe webhook handler
- `app/api/subscriptions/verify/route.ts`: Subscription verification
- `app/api/subscriptions/route.ts`: Subscription status retrieval

**UI Components:**
- `components/ui/Button.tsx`: Reusable button component
- `components/ui/TextField.tsx`: Text input with password toggle
- `components/ui/Tabs.tsx`: Tabbed navigation
- `components/ui/ConfirmDialog.tsx`: Confirmation dialogs

## 🔒 Security

- **Row Level Security (RLS)**: All database tables have RLS enabled
- **User Isolation**: Users can only access their own documents and conversations
- **Secure Storage**: Files stored in private Supabase Storage buckets
- **API Authentication**: All API routes require valid Supabase session tokens

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Supabase, and OpenAI.
