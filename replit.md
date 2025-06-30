# Schools Map Application

## Overview
This is a full-stack React application that displays schools in Alicante, Spain on an interactive map. Users can view schools, track their visit status, manage quota information, and add comments. The application uses a modern tech stack with React for the frontend, Express for the backend, and Drizzle ORM for database operations.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **Map Integration**: Leaflet for interactive maps with OpenStreetMap tiles
- **Form Management**: React Hook Form with Zod validation
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API endpoints
- **Storage**: In-memory storage with fallback to database
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple

### Development Environment
- **Bundler**: Vite for development and production builds
- **TypeScript**: Strict type checking across the entire codebase
- **Hot Module Replacement**: Vite HMR for fast development
- **Error Handling**: Runtime error overlay for development

## Key Components

### Database Schema
- **Schools Table**: Stores school information including name, address, contact details, visit status, quota availability, and comments
- **Users Table**: User authentication and management (prepared for future use)

### API Endpoints
- `GET /api/schools`: Retrieve all schools
- `PATCH /api/schools/:id`: Update school information (visit status, quota, comments)

### Frontend Components
- **Map Component**: Interactive Leaflet map showing school locations
- **Legend Component**: Visual guide for school status indicators
- **Stats Panel**: Real-time statistics display
- **UI Components**: Comprehensive set of reusable components from shadcn/ui

### External Services
- **Geocoding**: OpenStreetMap Nominatim API for address-to-coordinates conversion
- **Map Tiles**: OpenStreetMap for base map visualization

## Data Flow

1. **Initial Load**: Application fetches schools data from API endpoint
2. **Geocoding**: School addresses are converted to coordinates using Nominatim API
3. **Map Rendering**: Schools are displayed as markers on the Leaflet map
4. **User Interactions**: Status updates are sent to backend via PATCH requests
5. **State Updates**: TanStack Query manages cache invalidation and UI updates
6. **Real-time Stats**: Statistics panel updates automatically based on data changes

## External Dependencies

### Core Libraries
- React ecosystem (React, React DOM, React Query)
- Express.js and Node.js runtime
- Drizzle ORM with PostgreSQL driver
- Leaflet for mapping functionality
- Radix UI for accessible components
- Tailwind CSS for styling

### Development Tools
- Vite for build tooling
- TypeScript for type safety
- ESBuild for production bundling
- Replit-specific plugins for development environment

### API Services
- OpenStreetMap Nominatim for geocoding
- Neon Database for PostgreSQL hosting

## Deployment Strategy

### Development
- Uses Vite development server with HMR
- In-memory storage for rapid prototyping
- Environment-specific configuration via NODE_ENV

### Production Build
- Vite builds optimized client bundle
- ESBuild creates server bundle
- Static assets served by Express
- Database migrations via Drizzle Kit

### Environment Configuration
- Database URL required for PostgreSQL connection
- Drizzle configuration for schema management
- Tailwind CSS compilation for styling

## Changelog
- June 30, 2025. Initial setup - Created school mapping application
- June 30, 2025. Performance optimization - Currently geocoding all school addresses to collect coordinates for improved loading performance

## User Preferences
Preferred communication style: Simple, everyday language.