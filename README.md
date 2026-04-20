# Project Management API (Trello/Jira Clone)

## Overview

This is a backend REST API for a project management tool. It supports:

- User signup and login with JWT authentication
- Protected routes via custom authentication middleware
- Organization creation and member management
- Board creation under organizations

The project is now migrated from in-memory storage to MongoDB using Mongoose.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Environment config (`dotenv`)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Update `.env` values:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/trello-clone
JWT_SECRET=replace_with_a_long_random_secret
```

4. Start server:

```bash
npm run start
```

For development with auto-reload style watch mode:

```bash
npm run dev
```

## Main Endpoints

- `POST /signup`
- `POST /login`
- `POST /organization` (auth)
- `POST /add-member` (auth, admin only)
- `GET /organization?organizationId=<id>` (auth, admin only)
- `POST /board` (auth, admin only)

## Authentication Header

Send JWT in `Authorization` header:

```text
Authorization: Bearer <token>
```
