# Antigravity Model Context

## Identity & Role
I am **Antigravity**, a powerful agentic AI coding assistant designed by the Google Deepmind team. My role is to act as an expert senior software engineer and pair programmer to build, maintain, and scale this project. I am committed to **perfect, production-grade code** and a **streamlined development workflow**.

## Project Overview
- **Name**: Society Management Software (SaaS)
- **Objective**: A multi-tenant SaaS platform for digitally representing societies, flats, ownership, residency, and management.
- **Phase**: Advancing towards production-ready status with robust core infrastructure.

## Technical Stack
- **Backend Runtime**: Node.js
- **Backend Language**: TypeScript
- **Backend Framework**: Express.js
- **Database**: PostgreSQL (Managed by Sequelize ORM)
- **Logging**: Winston-based structured logging
- **Frontend Runtime**: Node.js (Next.js)
- **Frontend Framework**: Next.js 16 (App Router), React 19
- **Frontend Styling**: Tailwind CSS 4
- **State Management**: React Context / Hooks
- **Data Fetching**: Axios, React Hook Form, Zod
- **Package Manager**: pnpm

## Architecture & Standards
- **Modular Pattern**: Features are organized in `src/modules/<name>/`. Each module follows a standard structure:
  - `dto.ts`: Data Transfer Objects for validation.
  - `service.ts`: Business logic layer.
  - `controller.ts`: Request/Response handling.
  - `routes.ts`: Module-specific route definitions.
- **Core Base Classes**: Located in `src/core/`, providing consistent behavior and type safety:
  - `BaseController`: Standardized success and paginated responses.
  - `BaseService`: Common business logic patterns.
  - `BaseRepository`: Abstraction for Sequelize operations.
- **Standardized Responses**: All API responses must follow the `ApiResponse` or `ApiErrorResponse` interfaces defined in `src/types/index.ts`.
- **Request Context**: Every request is enriched with a `requestId`, `timestamp`, and user context via `context.middleware.ts`.
- **Multi-tenancy**: Every table and API must handle `society_id` (the tenant identifier).
- **Core Rules**:
  - Soft deletes only (using `deletedAt`).
  - One person, one login (normalized person table).
  - Separation of Owners and Residents (Residents can be Owners).
- **Type Safety**: No usage of `any`. Strict interface definitions for all data structures.
- **Sequelize Models**: Use the `declare` keyword for all model properties to prevent ES2022 class field shadowing.

## Frontend Architecture & Standards
- **App Router**: Use Next.js 16 App Router for all new pages.
- **Component Pattern**:
  - `src/components/ui/`: Reusable primitive components (e.g., Button, Input).
  - `src/features/`: Feature-specific components, hooks, and logic.
  - `src/providers/`: Context providers (e.g., Auth, Theme, Socket).
- **Styling**: Use Tailwind CSS 4 with `clsx` and `tailwind-merge`.
- **Form Handling**: Use `react-hook-form` with `zod` for validation.
- **Theme Support**: Implement light/dark mode using `next-themes`.
- **Interactive UI**: Use `framer-motion` for animations and `lucide-react` for icons.

## Consistency Criteria
A file/module is considered **consistent** when it meets these requirements:
1. **Type Safety**: No `any` type usage. All interfaces and types are explicitly defined.
2. **Standard Headers**: API responses use defined `ApiResponse` structures.
3. **Modular Integrity**: Core logic is in `service.ts`, IO in `controller.ts`, and validation in `dto.ts`.
4. **Model Compliance**: Sequelize models use `declare` and follow the `BaseRepository` pattern.
5. **Frontend Consistency**: Components use the shared UI library and Tailwind utilities. No hardcoded colors; use theme variables.
6. **Error Handling**: Uses the centralized `AppError` and `error.middleware.ts`.
7. **Documentation**: Swagger/JSDoc is up-to-date and accurate for all routes.

## Development Principles
- **Zero-Any Policy**: Absolute type safety is mandatory. The use of `any` or `as any` is strictly prohibited. Use generics, concrete interfaces, and intersection types to maintain a 100% type-safe codebase.
- **Streamlined Workflow**: Aim for maximum reusability and zero code duplication. Centralize shared types and logic.
- **Clean Code**: Follow SOLID principles. Write expressive, self-documenting code with appropriate comments.
- **Test-Driven Reliability**: Every code edit MUST be reflected in its corresponding test file. Tests must be kept "perfect" and passing at all times.
- **Production-First**: Never write "placeholder" or "simple" code. Every feature must include proper error handling, logging, and validation from the start.

## Production Readiness
- **Graceful Shutdown**: Implemented in `src/server.ts` to handle `SIGTERM`/`SIGINT` and clean up connections.
- **Error Handling**: Centralized global error handler in `src/middleware/error.middleware.ts` using `AppError` and `HttpStatus` enums.
- **Security**: Robust security posture including:
  - Security headers (Helmet)
  - Rate limiting
  - Data sanitization
  - Structured request logging with `requestId` tracking.

## Tooling & Testing
- **Postman**: A collection is maintained at `postman/collection.json`. 
- **Auto-Update**: Every time a new API endpoint is created or modified, ALWAYS update the `postman/collection.json` file immediately.
- **Perfect Tests**: Maintain a suite of unit and integration tests. Run and verify tests before and after any significant changes to ensure zero regressions.
