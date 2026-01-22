# SaaS API

Production-grade Node.js API boilerplate with TypeScript, Express, PostgreSQL, and Sequelize.

## Features

- 🚀 **TypeScript** - Full type safety
- 🔐 **Security** - Helmet, CORS, Rate Limiting, HPP, XSS protection
- 📝 **Validation** - Zod schema validation
- 🗄️ **Database** - PostgreSQL with Sequelize ORM
- 📚 **API Documentation** - Swagger/OpenAPI
- 🧪 **Testing** - Jest with supertest
- 🔧 **Dev Tools** - ESLint, Prettier, Husky
- 🏗️ **Architecture** - Clean, modular structure

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Create database
psql -U postgres -c "CREATE DATABASE saas_db;"

# Run migrations
pnpm db:migrate

# Seed database (optional)
pnpm db:seed

# Start development server
pnpm dev
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info with docs URL |
| `/docs` | GET | Swagger documentation |
| `/api/v1/health` | GET | Health status |
| `/api/v1/health/live` | GET | Liveness check |
| `/api/v1/health/ready` | GET | Readiness check |
| `/api/v1/admin/auth/login` | POST | Admin login |

## Project Structure

```
src/
├── config/         # Environment, database, swagger config
├── core/           # Base abstractions (controller, repository, service)
├── middleware/     # Security, validation, error handling
├── models/         # Sequelize models
├── modules/        # Feature modules (health, admin)
├── routes/         # Route aggregation
├── types/          # TypeScript types and enums
├── utils/          # Logger, JWT, security utilities
├── app.ts          # Express app configuration
└── server.ts       # Server entry point

database/
├── migrations/     # Database migrations
└── seeders/        # Database seeders
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint errors |
| `pnpm format` | Format with Prettier |
| `pnpm typecheck` | TypeScript type check |
| `pnpm test` | Run tests |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:seed` | Run seeders |
| `pnpm migration:create <name>` | Create migration |

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=saas_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

# Logging
LOG_LEVEL=info

# Security
CORS_ORIGIN=http://localhost:3000
BCRYPT_ROUNDS=12
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
```

## Adding a New Module

1. Create `src/modules/<name>/`
2. Add files:
   - `dto.ts` - Zod schemas
   - `service.ts` - Business logic
   - `controller.ts` - Request handling
   - `routes.ts` - Route definitions
   - `index.ts` - Module exports
3. Register in `src/modules/index.ts`
4. Mount in `src/routes/index.ts`
5. Create migration: `pnpm migration:create create-<name>-table`

## Git Hooks (Husky)

- **pre-commit**: Lint and format staged files
- **pre-push**: TypeScript type check

## License

ISC
