# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Architecture Overview

This is a Next.js 15 application for Coding Latam, an educational platform that offers programming courses with project-based learning.

### Core Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js v5 (GitHub & Google providers)
- **Database**: Firebase Firestore
- **State Management**: React Context via NextAuth SessionProvider
- **Package Manager**: pnpm

### Key Architecture Patterns

**Authentication & Authorization**:
- NextAuth.js handles OAuth with GitHub/Google
- User premium status determined by Firebase Firestore `isPremium` flag
- Middleware protects routes based on authentication and premium status
- Admin routes restricted to specific email (`angelokta7@gmail.com`)

**Premium Access Model**:
- Premium status managed through Firebase Firestore with comprehensive subscription metadata
- Lemon Squeezy webhooks handle all subscription lifecycle events (created, cancelled, expired, payment_failed, etc.)
- Grace period support: cancelled subscriptions maintain access until `ends_at` date
- Real-time subscription validation using `SubscriptionGuard` component and utility functions
- Non-premium users redirected to `/pro` for premium content

**Data Sources**:
- Firebase Firestore for user data and course content
- Lemon Squeezy API for subscription management via webhooks
- Static content for courses, workshops, and projects

### Directory Structure

**Core App Structure**:
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components organized by feature
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions (Firebase integration, subscription validation)

**Key Components**:
- Authentication components (LoginButton, Navbar with user dropdown)
- Course components (CourseCard, LiveCourseCard, WorkshopCard)
- Project components (ProjectCard, ProjectComments system)
- Payment integration (SubscriptionButton, pricing components)
- Subscription protection (SubscriptionGuard component for real-time validation)

**API Routes**:
- `/api/auth/` - NextAuth.js authentication endpoints
- `/api/admin/` - Admin user management
- `/api/projectComments/` - Comment system for projects
- `/api/webhook/` - Payment webhooks

### Content Types

The platform handles several content types with corresponding TypeScript interfaces:
- **Courses**: Programming courses with multiple classes
- **Live Courses**: Real-time cohort-based courses
- **Workshops**: Single-session educational content
- **Projects**: Hands-on coding projects with comment systems
- **Guides**: Educational guides and tutorials

### Important Configuration

**Environment Variables Required**:
- Firebase configuration (API key, project ID, auth domain)
- NextAuth.js providers (GitHub, Google client IDs/secrets)
- Lemon Squeezy webhook endpoints and API credentials

**Image Optimization**:
Next.js image optimization configured for multiple external domains including Unsplash, CDN, Google, and AWS S3.

**Middleware Behavior**:
- All routes require authentication except `/login`
- Premium content requires Firebase `isPremium` flag to be true
- Admin routes require specific admin email
- Extensive commented-out middleware matchers suggest premium content expansion

### Development Notes

- Uses `@/` path alias for `src/` directory
- TypeScript strict mode enabled
- Component structure follows feature-based organization
- Authentication state managed globally via SessionProvider
- Real-time user data updates using Firebase onSnapshot