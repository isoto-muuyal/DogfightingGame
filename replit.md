# Overview

This is a full-stack web application built as an NFL-themed 3D flight combat game. Players select their favorite NFL team and pilot a fighter aircraft in aerial combat scenarios. The application combines a React Three.js frontend for immersive 3D graphics with an Express.js backend and PostgreSQL database for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and component-based development
- **3D Graphics**: React Three Fiber (@react-three/fiber) for Three.js integration with React
- **3D Utilities**: React Three Drei (@react-three/drei) for common 3D components and helpers
- **UI Framework**: Radix UI primitives with custom styling for accessible component library
- **Styling**: Tailwind CSS for utility-first styling with custom design system
- **State Management**: Zustand for lightweight, reactive state management
- **Build Tool**: Vite for fast development and optimized production builds
- **Asset Support**: GLSL shaders, 3D models (GLTF/GLB), and audio files

The frontend follows a component-based architecture with separate stores for game state, flight mechanics, and audio management. The 3D scene is managed through React Three Fiber with custom physics for flight simulation.

## Backend Architecture
- **Framework**: Express.js with TypeScript for REST API development
- **Development**: Hot reload using tsx for rapid development cycles
- **Production**: ESBuild for efficient server-side bundling
- **File Structure**: Modular routing system with separated concerns for storage and API routes

The backend currently uses an in-memory storage implementation but is designed to easily swap to database persistence through the storage interface pattern.

## Data Storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via Neon serverless)
- **Schema**: User management with username/password authentication
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: Environment-based database URL configuration

The database schema currently supports user management and is extensible for game statistics, leaderboards, and player progress tracking.

## Game Engine
- **Physics**: Custom flight physics simulation with realistic aircraft controls
- **Input**: Keyboard controls for throttle, pitch, yaw, roll, and combat actions
- **Audio**: HTML5 Audio API integration with mute/unmute controls
- **Teams**: Complete NFL team data with colors, logos, and divisions
- **Combat**: Bullet physics with collision detection and health systems

## Development Tools
- **Linting**: TypeScript strict mode for compile-time error detection
- **Styling**: PostCSS with Tailwind CSS and Autoprefixer
- **Dev Server**: Vite development server with HMR and error overlay
- **Path Aliases**: Organized imports with @ for client and @shared for common code

# External Dependencies

## 3D Graphics and Game Engine
- **Three.js ecosystem**: React Three Fiber, Drei, and postprocessing for 3D rendering
- **GLSL support**: Vite plugin for shader development
- **Audio**: Browser-native HTML5 Audio API

## UI and Styling
- **Radix UI**: Complete set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority**: Type-safe component variants
- **Lucide React**: Icon library for UI elements

## Backend Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Express.js**: Web application framework

## Development and Build
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production
- **Replit Integration**: Runtime error modal and development tools

## Data and Validation
- **Zod**: Runtime type validation and schema parsing
- **Date-fns**: Date manipulation utilities
- **React Query**: Server state management (configured but not actively used)

The application is designed for deployment on Replit with automatic database provisioning and environment configuration.