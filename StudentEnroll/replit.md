# Overview

This is a bilingual (Arabic/English) student registration application built with React, Express.js, and TypeScript. The application allows students to register for different secondary school grades (1st, 2nd, 3rd year) by providing their personal information, contact details, and school information. The system features a multi-step registration form with real-time validation and integrates with Google Sheets for data backup.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for type safety and modern React features
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query** for server state management and API caching
- **React Hook Form** with Zod validation for form handling and validation
- **Tailwind CSS** with **shadcn/ui** component library for consistent UI design
- **Right-to-Left (RTL)** support for Arabic content display

## Backend Architecture
- **Express.js** REST API server with TypeScript
- **In-memory storage** using a Map-based storage class for development/demo purposes
- **Drizzle ORM** configured for PostgreSQL database schema management
- **Zod schemas** shared between frontend and backend for consistent validation
- **Custom middleware** for request logging and error handling
- **Modular route structure** separating concerns between routes, storage, and services

## Data Storage Solutions
- **Development**: In-memory storage using JavaScript Map for quick prototyping
- **Production Ready**: PostgreSQL database with Drizzle ORM configured
- **Schema Design**: Student table with fields for grade, name, phone numbers, school, and timestamps
- **Validation**: Egyptian phone number validation and comprehensive data validation rules

## Authentication and Authorization
- Currently no authentication system implemented
- Public registration endpoint accessible to all users
- Session management infrastructure prepared with connect-pg-simple

## Form Flow and User Experience
- **Multi-step registration**: Grade selection → Student details → Confirmation → Success
- **Progressive validation**: Each step validates before allowing progression
- **Visual feedback**: Progress indicators, loading states, and success/error messages
- **Mobile responsive**: Tailored for both desktop and mobile experiences
- **Arabic localization**: All user-facing text in Arabic with proper RTL layout

# External Dependencies

## Database and ORM
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **Drizzle ORM**: Type-safe database operations and schema management
- **Drizzle Kit**: Database migration and schema generation tools

## Google Services Integration
- **Google Sheets API**: Automatic backup of registration data to Google Sheets
- **Google Auth**: Service account authentication for API access
- Configured with environment variables for credentials

## UI and Styling
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Modern icon library for consistent iconography
- **class-variance-authority**: Dynamic CSS class generation for component variants

## Form and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Zod integration for form validation
- **Zod**: Runtime type validation and schema definition
- **drizzle-zod**: Automatic Zod schema generation from Drizzle schemas

## Development and Build Tools
- **Vite**: Fast build tool with HMR and optimized production builds
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast bundling for server-side code
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

## External Fonts and Assets
- **Google Fonts**: Noto Sans Arabic for proper Arabic text rendering
- **Replit Integration**: Development banner and cartographer plugin for Replit environment