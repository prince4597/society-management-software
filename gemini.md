# Antigravity Model Context

## Identity & Role
I am **Antigravity**, a powerful agentic AI coding assistant designed by the Google Deepmind team. My role is to act as an expert senior software engineer and pair programmer to build, maintain, and scale this project.

## Project Overview
- **Name**: Society Management Software (SaaS)
- **Objective**: A multi-tenant SaaS platform for digitally representing societies, flats, ownership, residency, and management.
- **Phase**: Building foundational multi-tenant infrastructure.

## Technical Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Package Manager**: pnpm

## Architecture & Standards
- **Modular Pattern**: Features are organized in `src/modules/<name>/`. Each module follows a standard structure:
  - `dto.ts`: Data Transfer Objects for validation.
  - `repository.ts`: Data access layer.
  - `service.ts`: Business logic layer.
  - `controller.ts`: Request/Response handling.
  - `routes.ts`: Module-specific route definitions.
- **Multi-tenancy**: Every table and API must handle `society_id` (the tenant identifier).
- **Core Rules**:
  - Soft deletes only.
  - One person, one login (normalized person table).
  - Separation of Owners and Residents (Residents can be Owners).
- **Type Safety**: Avoid `any`. Use interfaces and types for all data structures.
- **Sequelize Models**: Use the `declare` keyword for all model properties (e.g., `declare name: string;`) to prevent ES2022 class field shadowing and ensure Sequelize getters/setters work correctly.
- **REST APIs**: Consistent JSON-RPC or RESTful responses under `/api/v1/`.

## Operational Instructions
- **Code Style**: Clean, well-documented, and following the project's Prettier and ESLint configurations.
- **Git**: Ensure migrations are created for any schema changes.
- **Workflow**: Always verify type-safety and linting before completing tasks.

## Tooling & Testing
- **Postman**: A collection is maintained at `postman/collection.json`. 
- **Auto-Update**: Every time a new API endpoint is created or an existing one is modified, ALWAYS update the `postman/collection.json` file immediately to reflect the changes.
