# Dead Poets Society - Setup Guide

A beautiful poetry platform built with TanStack Start, Neon Database, and Plate.js rich text editor.

## Features

- 🔐 **Neon Auth Integration** - Secure authentication with JWT tokens
- ✍️ **Rich Text Editor** - Powered by Plate.js for beautiful poetry composition
- 📊 **Dashboard** - Manage and view all your poems
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS and shadcn/ui components
- 🚀 **Full-Stack TypeScript** - Type-safe from database to UI

## Prerequisites

- Node.js 18+ and pnpm
- A Neon Database account (free tier available at https://neon.tech)

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Neon Database

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy your connection string (looks like: `postgres://user:password@host/database`)

### 3. Initialize Database Schema

Run the SQL commands from `src/db-schema.sql` in your Neon SQL Editor to create the required tables:

```sql
-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Poets table for storing poetry with rich text content
CREATE TABLE IF NOT EXISTS poets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content JSONB NOT NULL,
  author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_poets_author_id ON poets(author_id);
CREATE INDEX IF NOT EXISTS idx_poets_created_at ON poets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your values:

```env
VITE_DATABASE_URL=your-neon-connection-string
JWT_SECRET=your-secure-random-secret-key
```

**Important:** Generate a strong JWT_SECRET for production:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Run the Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── login-form.tsx          # Login form with auth integration
│   ├── signup-form.tsx         # Signup form
│   ├── plate-editor.tsx        # Rich text editor component
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── auth.ts                 # Authentication utilities (JWT, bcrypt)
│   ├── session.ts              # Session management server functions
│   └── poets-api.ts            # CRUD API for poets
├── hooks/
│   └── useAuth.ts              # Authentication hook
├── routes/
│   ├── index.tsx               # Landing page
│   ├── dashboard.tsx           # Main dashboard
│   ├── captain/
│   │   ├── login.tsx          # Login page
│   │   └── signup.tsx         # Signup page
│   └── poets/
│       ├── new.tsx            # Create new poem
│       └── $poetId/
│           └── edit.tsx       # Edit existing poem
├── db.ts                       # Database client setup
└── db-schema.sql              # Database schema
```

## Usage

1. **Sign Up**: Create an account at `/captain/signup`
2. **Login**: Access your account at `/captain/login`
3. **Dashboard**: View all your poems at `/captain/dashboard`
4. **Create Poem**: Click "New Poem" to compose poetry with the rich text editor
5. **Edit Poem**: Click "Edit" on any poem to modify it
6. **Delete Poem**: Click "Delete" to remove a poem (with confirmation)

## Tech Stack

- **Frontend**: React 19, TanStack Start, TanStack Router
- **UI**: Tailwind CSS, shadcn/ui components
- **Rich Text Editor**: Plate.js (Slate.js based)
- **Database**: Neon PostgreSQL
- **Authentication**: JWT with bcryptjs password hashing
- **TypeScript**: Full type safety

## Authentication Flow

1. User signs up with email, password, and full name
2. Password is hashed using bcrypt (10 rounds)
3. JWT token is created and stored in localStorage
4. Token is sent with every API request for authentication
5. Server verifies token and extracts user ID for database queries

## Rich Text Editor Features

The Plate.js editor supports:
- **Text Formatting**: Bold, Italic, Underline, Code
- **Headings**: H1, H2
- **Lists**: Bulleted and Numbered
- **Block Quotes**: For special emphasis
- **Real-time Preview**: What you see is what you get

## Security Notes

- Passwords are hashed with bcrypt before storage
- JWT tokens expire after 7 days
- All database queries use parameterized statements to prevent SQL injection
- Authentication required for all poet operations
- Users can only access their own poems

## Build for Production

```bash
pnpm build
pnpm serve
```

## License

MIT

---

**Carpe Diem** - Seize the Day through Poetry 🖋️

