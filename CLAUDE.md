# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Loja Amor da Pátria** is a Masonic Lodge management web application built with React 18, TypeScript, and Supabase. It provides administrative and membership management features including authentication, financial control, secretary operations, and event management.

## Development Commands

- **Start development server:** `npm run dev` (runs on port 3000)
- **Build for production:** `npm run build`
- **Build in development mode:** `npm run build:dev`
- **Lint code:** `npm lint`
- **Preview production build:** `npm run preview`

## Architecture Overview

### Tech Stack
- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite (with SWC for fast compilation)
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI components)
- **Routing:** React Router v6
- **State Management & Data Fetching:** TanStack Query (React Query v5)
- **Forms:** React Hook Form + Zod validation
- **Backend/Database:** Supabase (auth, PostgreSQL, storage)
- **Notifications:** Sonner + shadcn/ui Toast

### Directory Structure
```
src/
├── components/        # Reusable UI components organized by domain
│   ├── ui/          # shadcn/ui components (buttons, inputs, dialogs, etc.)
│   ├── secretary/   # Secretary commission features
│   ├── finance/     # Finance commission features
│   ├── chancellery/ # Chancellery features
│   ├── management/  # Management features
│   ├── hospitalaria/# Hospitalaria features
│   └── ...other domains
├── pages/           # Route-level components (commission pages, auth, etc.)
├── hooks/           # Custom hooks for data fetching (useSecretary, useFinancialData, etc.)
├── contexts/        # Global state providers (AuthContext, ThemeContext)
├── integrations/    # External service clients (Supabase client in integrations/supabase/)
├── lib/             # Utilities and helpers
├── assets/          # Static images and media
└── App.tsx          # Main router configuration
```

### Key Patterns

**1. Authentication & Authorization:**
- Uses Supabase Auth with Context API (`src/contexts/AuthContext.tsx`)
- User roles stored in `user_roles` table, not in profiles
- Routes protected by role checks via `useAuth()` hook
- Users must be "approved" status to access private routes

**2. Data Fetching Pattern:**
All data operations use custom hooks that wrap React Query:
- `useSecretary.ts` - Documents, convocations, certificates
- `useFinancialData.ts` - Transactions and financial dashboards
- `useEvents.ts`, `useSessions.ts`, `useAttendances.ts` - Session management
- Each hook exposes `useQuery` and `useMutation` from React Query for caching and invalidation

**3. Component Organization:**
- Features organized into commission-based directories (e.g., `secretary/`, `finance/`)
- Each component follows shadcn/ui patterns with Form, Dialog, Sheet, etc.
- Page components are routed through `src/pages/` and named by commission or feature

**4. Form Handling:**
- React Hook Form + Zod for validation
- Schemas defined at component level or in shared validation files
- Toast notifications for success/error feedback

### Global State Providers

The app wraps everything in several providers (see `App.tsx`):
1. **QueryClientProvider** - React Query for server state
2. **ThemeProvider** - Light/dark mode toggle
3. **AuthProvider** - Authentication context and user session
4. **TooltipProvider** - Radix UI tooltips
5. **Sonner + Toast** - Notification systems

### Supabase Integration

- Client instantiated at `src/integrations/supabase/client.ts`
- TypeScript types auto-generated in `src/integrations/supabase/types.ts`
- Auth tokens stored in localStorage with auto-refresh
- Row-Level Security (RLS) policies should enforce role-based access

### User Roles & Permissions

Three primary roles: `admin`, `member`, `secretary` (plus derived commission roles). Stored in `user_roles` table linked to `auth.users.id`. Key permission rules:
- Admin/Secretary can perform writes to documents, transactions, etc.
- Only admins can approve pending user registrations
- Financial data restricted to treasury/admin only
- Session attendance tracking restricted to officials

## Important Context

### Commission Pages
The app has multiple commission-based pages under `/commission/`:
- `/commission/secretary` - Document/convocation management
- `/commission/finance` - Financial dashboards and transactions
- `/commission/chancellery` - Official member documentation
- `/commission/management` - Administrative dashboards
- `/commission/hospitalaria` - Healthcare/welfare activities
- Plus others: study time, books, articles, glossary, FAQ

Each commission page typically contains a dashboard component with sub-features (e.g., `CommissionSecretary.tsx` uses `SecretaryDashboard`, `SecretaryDocuments`, etc.).

### Database Tables
Key tables referenced throughout the codebase:
- `profiles` - User profile data
- `user_roles` - User role assignments (use this, not profiles.role)
- `documents` - Secretary documents with file URLs
- `transactions` - Financial records
- `sessions` - Meeting sessions (type, degree, theme)
- `attendances` - Attendance records
- `events` - Lodge events
- And many others (view `src/integrations/supabase/types.ts` for full schema)

### File Uploads
Uses Supabase Storage for PDFs, images, and certificates. Hooks handle signed URLs and file deletion. File paths follow pattern: `{table}/{user_id}/{filename}`.

### Styling Conventions
- Use Tailwind utility classes directly in JSX
- shadcn/ui components imported from `@/components/ui/`
- Theme toggle via `next-themes` in ThemeContext
- Responsive design mobile-first with Tailwind breakpoints
- Dark mode CSS variables defined in `src/index.css`

## Common Tasks

### Adding a New Commission Feature
1. Create component in `src/components/{commission}/` (e.g., `NewFeatureDashboard.tsx`)
2. Create/update custom hook in `src/hooks/` (e.g., `useNewFeature.ts`) for data fetching
3. Add route in `src/App.tsx` under `/commission/` path
4. Use form components with React Hook Form + Zod for inputs
5. Handle loading/error states with React Query `isLoading`, `isError`
6. Provide feedback via Sonner toast notifications

### Modifying Supabase Schema
1. Update database schema in Supabase dashboard
2. Re-generate types: `supabase gen types typescript` (or manually update `types.ts`)
3. Update RLS policies to match new role-based access needs
4. Update hooks that query the affected tables

### Adding Authentication Checks
Use the `useAuth()` hook to access user info:
```typescript
const { user, userRole, isCommissionMember } = useAuth();
if (userRole !== 'admin') {
  return <UnauthorizedPage />;
}
```

## Notes for Future Work

- The project uses a "commission" metaphor for organizational structure (secretary, finance, etc.) heavily reflected in routing and UI
- Component tagging with `lovable-tagger` is enabled in development mode
- Consider lazy loading for route components as the app grows
- Error boundaries should be added around commission pages for resilience
- Database queries should leverage React Query's prefetching for better UX
