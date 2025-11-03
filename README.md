MessageSlack – Full Stack Overview

Project Summary
- Real-time team messaging app with workspaces, channels, and DMs.
- Backend: Node.js (Express + Socket.IO), MongoDB (Mongoose), Redis/Bull, Nodemailer, Cloudinary, Zod, JWT.
- Frontend: React + Vite, React Router, TanStack Query, Socket.IO client, Tailwind + shadcn/ui.

Backend Key Points
- API: REST under `/api` and `/api/v1`; Socket.IO for realtime events.
- Auth: JWT (`x-access-token`) with Zod validation for inputs.
- Core flows: create/join workspaces, add channels/members, DMs, messages (paginate), file upload to Cloudinary.
- Queues: Bull on Redis for email sending; Bull Board at `/ui`.
- See `backend/summary.txt` and `backend/BACKEND_WORKFLOW.txt` for detailed flows and diagrams.

Frontend Key Points
- State: React Contexts for auth, workspace, messages, modals; React Query for fetching and caching.
- Routing: Protected routes redirect unauthenticated users; home routes to first workspace or prompts creation.
- Realtime: Joins workspace/channel rooms; emits `NewMessage`, listens for `NewMessageReceived` and `WorkspaceUpdated`.
- Uploads: `ChatInput` uploads files to `/messages/upload`, then sends message with returned URL.
- See `frontend/README.md` for diagrams and module dependencies.

Environment Setup
- Backend: copy `backend/.env.example` to `backend/.env` and fill values (MongoDB, Redis, Gmail/Nodemailer, Cloudinary, JWT).
- Frontend: set Vite env vars in `frontend/.env`:
  - `VITE_BACKEND_API_URL` (e.g., `http://localhost:3000/api`)
  - `VITE_BACKEND_SOCKET_URL` (e.g., `http://localhost:3000`)

Run Locally
- Terminal A (backend):
  - `cd backend && npm install`
  - `npm run start` (nodemon on `src/index.js`)
  - Queue UI at `http://localhost:<PORT>/ui`
- Terminal B (frontend):
  - `cd frontend && npm install`
  - `npm run dev` (Vite dev server)

Key Interfaces
- REST Endpoints (examples):
  - Auth: `POST /users/signup`, `POST /users/signin`
  - Workspaces: `GET/POST/PUT/DELETE /workspaces`, `PUT /workspaces/:id/members`, `PUT /workspaces/:id/channels`, `PUT /workspaces/:id/join`, `POST /workspaces/:id/invite-email`
  - Channels: `GET /channels/:channelId`
  - Messages: `GET /messages/:channelId`, `POST /messages/upload`
  - DMs: `POST /dms`, `GET /dms/:workspaceId`, invites create/list/act
- Socket.IO Events:
  - Emits: `JoinWorkspace`, `JoinChannel`, `NewMessage`
  - Listens: `WorkspaceUpdated`, `NewMessageReceived`


Folder Structure
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── processors
│   │   ├── producers
│   │   ├── queues
│   │   ├── repositories
│   │   ├── routes
│   │   ├── schema
│   │   ├── services
│   │   ├── utils
│   │   └── validators
│   ├── BACKEND_WORKFLOW.txt
│   ├── summary.txt
│   └── .env.example
├── frontend
│   ├── public
│   └── src
│       ├── apis
│       ├── components
│       ├── context
│       ├── hooks
│       ├── pages
│       └── Routes.jsx
└── Redis_Cloudinary_Mailing.txt
