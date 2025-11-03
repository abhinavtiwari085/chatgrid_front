# Message App Backend

This is the backend for a real-time team messaging app with workspaces, channels, direct messages, file uploads, and email invites.

## Key Points

### Overview
- Purpose: Slack-like messaging with workspaces, channels, and DMs.
- Stack: Node.js (Express + Socket.IO), MongoDB (Mongoose), Redis (Bull), Nodemailer (Gmail), Cloudinary, Zod, JWT.
- Real-time: Socket.IO rooms per channel/workspace; events for new messages and workspace updates.

### System Workflow (Start → Finish)
1) Boot: `src/index.js` loads env, builds Express server, attaches Socket.IO, mounts `/api` + `/ui`, then connects MongoDB.
2) Requests: Routes → middlewares (JWT, zod) → controllers → services → repositories (MongoDB) → unified responses.
3) Realtime: Client joins rooms (`JoinChannel`, `JoinWorkspace`); sends `NewMessage` → server persists and emits `NewMessageReceived`.
4) Async jobs: Services enqueue mail jobs to Bull; processor sends emails via Nodemailer.

### Execution Flow Examples (Route → Controller → Service → Repo)
- Sign in: `POST /api/v1/users/signin` → `userController.signIn` → `userService.signInService` → `userRepository.getByEmail` (+ `bcrypt`, `createJWT`).
- Create workspace: `POST /api/v1/workspaces` → `createWorkspaceController` → `workspaceService.createWorkspaceService` → `workspaceRepository.create` → `addMemberToWorkspace` → `addChannelToWorkspace('general')`.
- Fetch channel: `GET /api/v1/channels/:channelId` → `getChannelByIdController` → `channelService.getChannelByIdService` → `channelRepository.getChannelWithWorkspaceDetails` + `messageRepository.getPaginatedMessaged`.
- Upload media: `POST /api/v1/messages/upload` → `upload.single('file')` → `messageController.uploadToCloudinary` → Cloudinary.
- New message (WS): `NewMessage` → `messageSocketController` → `messageService.createMessageService` → `messageRepository.create` → emit `NewMessageReceived` to channel room.

### Main Folders & Roles
- `src/config/`: Env (`serverConfig`), MongoDB (`dbConfig`), Redis, Mailer, Cloudinary, Bull Board.
- `src/routes/`: Express routers for `/api` and `/api/v1`.
- `src/controllers/`: Translate HTTP to service calls; shape responses.
- `src/services/`: Business logic; call repos, queues, and emit socket events.
- `src/repositories/`: Mongoose data access (CRUD + custom queries).
- `src/schema/`: Mongoose models (User, Workspace, Channel, Message, Invite).
- `src/middlewares/`: JWT auth (`x-access-token`), Multer upload.
- `src/utils/`: JWT helper, response builders, event names, socket emitter, error classes.
- `src/queues/`, `src/producers/`, `src/processors/`: Bull queues for email delivery.

### Inputs / Outputs
- Auth header: `x-access-token` (JWT) for protected routes.
- Upload field: `file` (multipart/form-data) → returns `{ url }` from Cloudinary.
- Pagination: `/messages/:channelId?page=&limit=` returns sender-populated messages.

### External Services
- MongoDB (Mongoose), Redis/Bull (queues), Nodemailer (Gmail), Cloudinary (uploads), Socket.IO (realtime).

### Development
- Install: `npm install` (in `backend/`).
- Run dev: `npm run start` (eslint fix + nodemon on `src/index.js`).
- Bull Board UI: `GET /ui`.
- Postman: `Message Slack APIs.postman_collection.json`.
- Env setup: copy `backend/.env.example` to `backend/.env` and fill in values.

### Diagrams & Detailed Summary
For full call chains, data flow, and module dependency diagrams (Mermaid), see:
- `backend/summary.txt` (concise, diagrammed)
- `backend/BACKEND_WORKFLOW.txt` (expanded workflow documentation)

## ESLint Setup

[ESLint setup article](https://medium.com/@sindhujad6/setting-up-eslint-and-prettier-in-a-node-js-project-f2577ee2126f)
