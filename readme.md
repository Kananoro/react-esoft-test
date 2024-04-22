# Esoft Test TODO List

## Used Stack

- React
- JavaScript
- Docker
- PostgreSQL
- ExpressJS
- Prisma
- Express.js

### on backend

- bcrypt
- yup
- passport
- passport-jwt

### on frontend

- axios

## Getting Started

First, create .env file from .env.example (in folders: docker, backend)

Run the development:

From docker folder:

```bash
docker-compose up --build
```

From backend folder:

```bash
npm ci
#then
npm run nodemon
```

From frontend folder:

```bash
npm ci
#then
npm run dev
```

Create database with prisma:

```bash
npx prisma generate
# then
npx prisma db push
# seed if need to
npx prisma db seed
```

### users in seed

Director:

| Login    | Password  |
| -------- | --------- |
| kananoro | password1 |

Subordinates to this Director:

| Login      | Password  |
| ---------- | --------- |
| nekananoro | password2 |
| pepe       | password3 |
