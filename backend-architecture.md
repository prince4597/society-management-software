# Backend Architecture

## Design Patterns
The backend follows a **Layered Architecture** to ensure separation of concerns and testability.

### 1. Controller Layer
- Responsible for HTTP request/response handling.
- Input validation via **Zod schemas**.
- No business logic or database queries allowed here.

### 2. Service Layer
- Contains the core business logic.
- Orchestrates multiple repositories if needed.
- Handles transactions and logging.

### 3. Repository Layer
- Abstracted data access via `BaseRepository`.
- Implements **Tenant Isolation** by automatically scoping queries with `societyId`.
- No business logic allowed here.

## Multi-Tenancy Strategy
- **Isolation Level**: Shared Database, Shared Schema.
- **Mechanism**: Every repository method that deals with tenant-sensitive data accepts an optional `societyId`.
- **Enforcement**: `BaseRepository` includes `societyId` in the `where` clause of all relevant operations.

## Error Handling
- Centralized `error.middleware.ts`.
- Standardized error classes (e.g., `NotFoundError`, `ConflictError`).
- Consistent API response format via `ApiResponse` interface.

## Security
- **JWT Authentication**: Secure tokens stored in HttpOnly cookies.
- **RBAC**: Role-based access control enforced at the middleware/service level.
- **Validation**: Strict schema validation for all incoming data.
