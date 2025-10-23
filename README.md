# Dead Poets Society 🖋️

**Carpe Diem - Seize the Day through Poetry**

A beautiful, modern poetry platform built with TanStack Start, Neon Database, and a rich text editor. Share your verses, express your soul, and join a community of wordsmiths.

![TanStack Start](https://img.shields.io/badge/TanStack-Start-cyan)
![Neon Database](https://img.shields.io/badge/Neon-Database-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![React](https://img.shields.io/badge/React-19-purple)

---

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- ✍️ **Rich Text Editor** - Plate editor with rich formatting for beautiful poetry
- 📊 **Personal Dashboard** - Manage all your poems in one place
- 🎨 **Modern UI** - Beautiful design with Tailwind CSS & shadcn/ui components
- 🚀 **Full-Stack TypeScript** - Type-safe from database to UI
- ⚡ **Serverless Database** - Powered by Neon PostgreSQL
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎭 **Custom 404 Page** - Elegant not-found page with Instrument Serif typography
- 🌙 **Dark Mode Ready** - Designed with dark theme support

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your Neon Database URL and JWT secret

# 3. Run the SQL schema in your Neon Database
# Copy contents of src/db-schema.sql to Neon SQL Editor

# 4. Start development server
pnpm dev

# 5. Visit http://localhost:3000
```

---

## 📚 Documentation

- **[Setup Guide](SETUP.md)** - Detailed setup instructions
- **[Database Schema](src/db-schema.sql)** - SQL table definitions

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **TanStack Start** - Full-stack React framework
- **TanStack Router** - Type-safe routing with 404 handling
- **Tailwind CSS v4** - Latest utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **Plate Editor** - Rich text editing experience
- **Instrument Serif & Sans** - Google Fonts typography

### Backend
- **Neon PostgreSQL** - Serverless Postgres database
- **JWT (jose)** - Secure token-based authentication
- **bcryptjs** - Password hashing
- **Server Functions** - Type-safe RPC-style API

### Developer Experience
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📁 Project Structure

```
src/
├── components/
│   ├── login-form.tsx          # Login with authentication
│   ├── signup-form.tsx         # User registration
│   ├── plate-editor.tsx        # Plate rich text editor
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx          # Button component
│       ├── card.tsx            # Card component
│       ├── field.tsx           # Form field wrapper
│       ├── input.tsx           # Input component
│       ├── label.tsx           # Label component
│       └── separator.tsx       # Separator component
├── lib/
│   ├── auth.ts                 # JWT & bcrypt utilities
│   ├── session.ts              # Auth server functions
│   ├── poets-api.ts            # Poets CRUD API
│   └── utils.ts                # Utility functions
├── hooks/
│   └── useAuth.ts              # Authentication hook
├── routes/
│   ├── __root.tsx              # Root layout with 404 handler
│   ├── index.tsx               # Landing page
│   ├── captain/
│   │   ├── dashboard.tsx       # Main dashboard
│   │   ├── login.tsx           # Login page
│   │   └── signup.tsx          # Signup page
│   └── poets/
│       ├── new.tsx             # Create poem
│       └── $poetId/
│           └── edit.tsx        # Edit poem
├── styles/
│   └── app.css                 # Global styles & Tailwind config
├── db.ts                       # Database client
└── db-schema.sql               # Database schema
```

---

## 🎯 User Flow

1. **Home** (`/`) → Landing page with Login/Signup
2. **Sign Up** (`/captain/signup`) → Create account
3. **Login** (`/captain/login`) → Authenticate
4. **Dashboard** (`/captain/dashboard`) → View all poems
5. **Create** (`/poets/new`) → Write new poetry
6. **Edit** (`/poets/:id/edit`) → Modify poems
7. **404 Page** (any invalid route) → Elegant not-found with home redirect

---

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Server-side validation for all operations
- ✅ Protected routes with authentication checks
- ✅ User-specific data isolation
- ✅ SQL injection prevention with parameterized queries

---

## 📦 Available Scripts

```bash
# Development
pnpm dev              # Start dev server on port 3000
pnpm build            # Build for production
pnpm serve            # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Run Prettier
pnpm check            # Format and lint

# Testing
pnpm test             # Run Vitest tests
```

---

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
# Neon Database Connection String
VITE_DATABASE_URL=postgres://user:password@host/database

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

---

## 🗄️ Database Schema

The application uses two main tables:

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `full_name` - User's full name
- `created_at`, `updated_at` - Timestamps

### Poets Table
- `id` - Primary key
- `title` - Poem title
- `content` - JSONB content from editor
- `author_id` - Foreign key to users
- `created_at`, `updated_at` - Timestamps

See [src/db-schema.sql](src/db-schema.sql) for the complete schema.

---

## 🎨 Rich Text Editor Features

The Plate editor provides:
- **Rich Text Formatting** - Full WYSIWYG editing experience
- **Headings** - Multiple heading levels
- **Text Styles** - Bold, italic, underline, and more
- **Block Elements** - Paragraphs, quotes, code blocks
- **Lists** - Bulleted and numbered lists
- **JSON Storage** - Content stored as structured JSON in database

---

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

Generates:
- `/dist/client` - Client-side assets
- `/dist/server` - Server-side code

### Deploy To

- **Vercel** - Deploy with `vercel` CLI
- **Netlify** - Deploy with `netlify` CLI
- **Railway** - Connect your repo
- **Render** - Connect your repo
- **Your own VPS** - Use PM2 or Docker

Make sure to set environment variables in your deployment platform.

---

## 🤝 Contributing

This is a starter template for poetry platforms. Feel free to:

- Fork and customize for your needs
- Add new features (comments, likes, sharing)
- Improve the UI/UX
- Add more editor features
- Report issues or suggest improvements

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- **TanStack** - For the amazing Start framework
- **Neon** - For serverless Postgres
- **shadcn** - For beautiful UI components
- **Vercel** - For Next.js inspiration

---

## 📞 Support

For issues or questions:
- Check the [documentation](SETUP.md)
- Open an issue on GitHub

---

## 🎯 Current Status

**✅ Completed Features:**
- ✅ User authentication (signup/login with JWT)
- ✅ Dashboard with poem management
- ✅ Rich text editor with Plate
- ✅ Create and edit poems
- ✅ Responsive UI with Tailwind CSS v4
- ✅ shadcn/ui component integration
- ✅ Custom 404 page with elegant typography
- ✅ Neon PostgreSQL integration
- ✅ Type-safe API with server functions

**🚧 Future Enhancements:**
- 🔄 Poem sharing functionality
- 🔄 User profiles and bios
- 🔄 Search and filter poems
- 🔄 Categories and tags
- 🔄 Social features (likes, comments)
- 🔄 Export poems (PDF, markdown)

---

**Built with ❤️ and ☕**

*Carpe Diem - Seize the Day through Poetry* 🖋️✨
