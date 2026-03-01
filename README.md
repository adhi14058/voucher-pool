# Voucher Pool API

REST API for managing voucher codes, customers, and special offers. Each voucher code is unique, assigned to a customer and a special offer, and can only be used once.

## Tech Stack

- **NestJS 11** / TypeScript
- **Prisma 7** ORM / PostgreSQL 17.2
- **Swagger / OpenAPI** documentation
- **Zod** for environment config validation
- **class-validator / class-transformer** for DTO validation
- **@nestjs/throttler** for rate limiting
- **Jest** for testing
- **Docker / Docker Compose**

## Prerequisites

- Node.js 24+ (see `.nvmrc`)
- Docker & Docker Compose

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start database
docker compose up database -d

# 3. Generate Prisma client
npm run prisma:generate

# 4. Run database migrations
npm run prisma:migrate

# 5. Start dev server (watch mode)
npm run start:dev
```

The API will be available at `http://localhost:3000`.

## Docker (Full Stack)

```bash
docker compose up --build
```

This starts the NestJS app and PostgreSQL together. Migrations run automatically on container startup.

## API Documentation

Swagger UI is available at: **http://localhost:3000/api/v1/docs**

## API Endpoints

All business endpoints are under `/api/v1`.

| Method | Path                      | Description                                         |
|--------|---------------------------|-----------------------------------------------------|
| POST   | `/api/v1/customers`       | Create a customer                                   |
| GET    | `/api/v1/customers`       | List all customers                                  |
| POST   | `/api/v1/special-offers`  | Create a special offer                              |
| GET    | `/api/v1/special-offers`  | List all special offers                             |
| POST   | `/api/v1/vouchers/generate` | Generate voucher codes for all customers for an offer |
| POST   | `/api/v1/vouchers/redeem` | Redeem a voucher code (returns discount %)          |
| GET    | `/api/v1/vouchers?email=` | List all valid vouchers for a customer email        |

### Health Check

| Method | Path                     | Description        |
|--------|--------------------------|--------------------|
| GET    | `/api/health/liveness`   | Liveness probe     |
| GET    | `/api/health/readiness`  | Readiness probe    |

## Example Flow

```bash
# 1. Create customers
curl -X POST http://localhost:3000/api/v1/customers \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# 2. Create a special offer
curl -X POST http://localhost:3000/api/v1/special-offers \
  -H "Content-Type: application/json" \
  -d '{"name": "Summer Sale", "discountPercentage": 20}'

# 3. Generate vouchers (creates one for every customer)
curl -X POST http://localhost:3000/api/v1/vouchers/generate \
  -H "Content-Type: application/json" \
  -d '{"specialOfferId": "<offer-id>", "expirationDate": "2026-12-31T23:59:59.000Z"}'

# 4. List valid vouchers for a customer
curl "http://localhost:3000/api/v1/vouchers?email=john@example.com"

# 5. Redeem a voucher
curl -X POST http://localhost:3000/api/v1/vouchers/redeem \
  -H "Content-Type: application/json" \
  -d '{"code": "<voucher-code>", "email": "john@example.com"}'
```

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

## Rate Limiting

The API is protected with rate limiting: **100 requests per 60 seconds** per IP. Exceeding the limit returns `429 Too Many Requests`.

## Project Structure

```
src/
  main.ts                              # App bootstrap, Swagger & validation setup
  swagger.ts                           # Swagger / OpenAPI configuration
  core/
    constants/                         # Shared constants (header keys, etc.)
  modules/
    app.module.ts                      # Root module (throttler, global, api)
    global.module.ts                   # Global providers (config, database)
    config/                            # Environment config with Zod validation
    database/                          # Prisma service
    health/                            # Health check endpoints (liveness, readiness)
    customers/                         # Customer CRUD
    special-offers/                    # Special offer CRUD
    vouchers/                          # Voucher generation, redemption, listing
    api/
      api.module.ts                    # API module with route registration
      api.routes.ts                    # Versioned route definitions
      middlewares/                     # Common response headers middleware
prisma/
  schema.prisma                        # Database schema
  migrations/                          # Migration files
```
