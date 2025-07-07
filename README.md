# Mini Docs - Document Management API

A simplified document management system built with **NestJS**, **Prisma**, and **PostgreSQL**. This project demonstrates best practices for building secure, scalable RESTful APIs with role-based access control and modern tooling.

---

## Overview
Mini Docs is a backend API for managing documents with user authentication and role-based access. It is ideal for learning or as a foundation for more complex document management systems.

## Architecture
- **NestJS**: Modular, scalable Node.js framework
- **Prisma**: Type-safe ORM for database access
- **PostgreSQL**: Relational database
- **Docker**: Containerized development and deployment

```
[Client] ⇄ [NestJS API] ⇄ [Prisma ORM] ⇄ [PostgreSQL]
```

## Features
- **User Authentication**: JWT-based login for Admin and Regular users
- **Role-Based Access Control**: Restrict endpoints by user role
- **Document CRUD**: Create, read, update, delete documents
- **Validation & Error Handling**: Robust request validation and error responses
- **RESTful API**: Clean, predictable endpoints

## API Usage
- Interactive API documentation is available at `/api/docs` when the server is running.

Example: Create a document (requires authentication)

```http
POST /documents
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Sample Doc",
  "content": "This is a sample document."
}
```

Example: List documents

```http
GET /documents
Authorization: Bearer <token>
```

> For full API details, see the controller files in `src/documents/` and `src/auth/`.

## Setup & Installation

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Run database migrations
npx prisma migrate dev

# 4. Start development server
npm run start:dev
```

## Docker Setup

```bash
# Build and start all services (API, DB, etc.)
docker-compose up --build
```

## Environment Variables
- Copy `.env.sample` to `.env` and fill in the required values.

## Generating JWT Keys
To generate the required JWT private and public keys, run:

```bash
openssl genrsa -out certs/jwt_private.pem 2048
openssl rsa -in certs/jwt_private.pem -pubout -out certs/jwt_public.pem
```

## Testing

```bash
# Run unit and e2e tests
npm run test
npm run test:e2e
```
