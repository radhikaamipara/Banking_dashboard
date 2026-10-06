# SecureBank — YONO-inspired MERN Banking Dashboard

This is the original SecureBank MERN project with a professional digital-banking UX inspired by modern YONO-style banking flows. It is not an official SBI/YONO application.

## Project structure
- `client` — React + Vite frontend
- `server` — Node.js + Express + MongoDB backend

## Run
1. Start MongoDB.
2. Open a terminal in `server` and run `npm install` then `npm start` (or `npm run dev` if available).
3. Open another terminal in `client` and run `npm install` then `npm run dev`.
4. Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Main banking flows
Registration/login → account → transactions/transfers → cards → loans → notifications.

Admin actions are persisted and reflected back to customers through MongoDB-backed records and notifications, including card status changes.
