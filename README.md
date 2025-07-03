# Mini Docs - Document Management API

A simplified document management system built with **NestJS**, **Prisma**, and **PostgreSQL**.

## Features

* User authentication (Admin & Regular)
* Create, edit, view, list, and delete documents
* Role-based access control
* RESTful API with validation and error handling

## Tech Stack

* **NestJS** (backend framework)
* **Prisma** (ORM)
* **PostgreSQL** (database)

## Setup & Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```