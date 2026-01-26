# Frontend Architecture & Consistency Context

This document provides the necessary context for maintaining architectural integrity and code consistency within this project. Use this as a reference whenever implementing new features or refactoring existing ones.

## 🏛️ Core Architecture: Clean Domain-Driven Design (DDD)

The codebase is organized into isolated domains under `src/features/` and a shared infrastructure layer.

### Directory Structure

- **`src/infrastructure/`**: Centralized, global foundations.
  - `api/`: Unified API client (Axios-based).
  - `services/`: Cross-cutting logic (e.g., `errorService`).
  - `utils/`: Data formatters and validation patterns.
  - `hooks/`: Reusable logic hooks (e.g., `usePagination`).
- **`src/features/[feature-name]/`**: Domain encapsulates its own logic.
  - `api/`: Service layer for the feature.
  - `hooks/`: State and business logic.
  - `components/`: Feature-specific UI.
  - `types/`: Domain-specific interfaces.
- **`src/components/layout/`**: Shared layout registry (Header, Sidebar, NavItem). **Do not duplicate layout logic.**

## 🛠️ Reusable Patterns & Consistency

### 1. Data Validation & Formatting

- **Phone Numbers**: Always use `+CC XXXXXXXXXX` format. Use `VALIDATION.PHONE` from `src/infrastructure/utils/validation` and `formatPhoneNumber` from `src/infrastructure/utils/formatters`.
- **Zod Schemas**: Prefer centralizing shared fragments (email, phone, name) in the infrastructure validation file.

### 2. UI Feedback States

To ensure a premium and consistent UX, always use the following components from `@/components/ui` for data lists and tables:

- **Loading**: `<TableLoading columns={n} />`
- **Empty**: `<TableEmpty columns={n} message="..." icon={...} />`

### 3. Error Handling

- Use the central `errorService.handleError(err)` for side Effects.
- Catch blocks should explicitly use `unknown` type and check `instanceof Error`.

### 4. Layout Integration

- Sidebars and Headers are generic and should be driven by configuration (e.g., `navItems` arrays) passed from the layout shell.

## 🚀 Development Principles

- **DRY (Don't Repeat Yourself)**: If a pattern (like phone formatting) is used twice, it belongs in `infrastructure/`.
- **Zero-Any**: Strict TypeScript settings are enforced. No `any` allowed.
- **Service Layer**: Components should not call `apiClient` directly; they should use a domain service.

---

_Maintained with absolute architectural perfection._
