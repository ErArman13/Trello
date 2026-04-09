📋 Project Management API (Trello/Jira Clone)
🚀 Overview
This is a backend REST API for a project management tool, allowing users to create organizations, invite members, and manage task boards. It features a custom-built authentication system using JSON Web Tokens (JWT) and custom middleware to protect private routes.

Note: This project is currently in Phase 1 (Prototype). Data is actively managed in-memory to demonstrate core logic, routing, and authentication flows. It is actively being upgraded to support a persistent database.

✨ Current Features
User Authentication: Secure signup and login endpoints generating JWTs.

Protected Routes: Custom Express middleware to verify tokens and authorize users.

Workspace Management: Authenticated users can create Organizations and act as the Admin.

Role-Based Access: Only Organization Admins can invite new members to their workspace.

💻 Tech Stack
Environment: Node.js

Framework: Express.js

Authentication: jsonwebtoken (JWT)

Data Storage: In-memory arrays (Temporary - see Roadmap)
