# System Architecture - Society Management Software

## Overview
This is a multi-tenant SaaS application designed for society management. It follows a modular monolith approach with a clear separation between frontend and backend.

## Architecture Model
- **Frontend**: Next.js (App Router) + React Query for data management.
- **Backend**: Node.js + Express with a strict layered architecture (Controller → Service → Repository).
- **Database**: PostgreSQL with Sequelize ORM.

## SaaS Tenant Isolation
The application implements **Logical Separation** at the database level.
- Every tenant-specific table (Residents, Properties, etc.) contains a `societyId`.
- The `BaseRepository` automatically filters queries based on `societyId` when provided.
- Society Admins, Owners, and Tenants are restricted to their own society's data.

## Data Flow
1. **Request**: Frontend makes an API call via a standardized `apiClient`.
2. **Auth**: `authenticate` and `authorize` middlewares verify JWT and roles.
3. **Controller**: Validates input using Zod and delegates to the Service.
4. **Service**: Executes business logic and interacts with the Repository.
5. **Repository**: Performs database operations with tenant isolation.
6. **Response**: Standardized `ApiResponse` returned to the client.

## Role & Permission Model
| Role | Description |
| :--- | :--- |
| **Super Admin** | Manages all societies and system-wide configurations. |
| **Society Admin** | Manages a specific society, residents, and properties. |
| **Owner** | Views owned properties and pays maintenance. |
| **Tenant** | Views rented properties and pays rent. |
