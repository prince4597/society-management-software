# Frontend Architecture

## Core Technologies
- **Next.js 14+**: App Router for routing and server components.
- **Tailwind CSS**: Utility-first styling with custom tokens.
- **React Query (TanStack Query)**: Server state management and caching.
- **Axios**: HTTP client for API communication.

## Feature-Driven Structure
Every feature module (e.g., `residents`, `properties`, `auth`) is strictly divided into:
- **api/**: Contains `feature.service.ts` for clean API communication.
- **hooks/**: Standardized React Query hooks (`useFeature.ts`) managing server state.
- **components/**: UI components purely consuming these hooks.
- **types/**: Strong TypeScript definitions for the domain.

## Data Management
- **Server State**: Managed exclusively by React Query. Manual `useEffect` fetching is deprecated throughout the codebase.
- **Local State**: handled by React `useState` / `useReducer` for UI interaction.
- **API Cache**: Default stale time set to 60 seconds to reduce redundant hits.

## Performance Considerations
- **Optimistic Updates**: Implemented for critical UI actions to enhance perceived performance.
- **Pagination**: Client-side filtering combined with server-side pagination for efficiency.
- **Image Optimization**: Utilizing Next.js `Image` component.
