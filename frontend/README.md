# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# TicketLunch

## Project Structure Update

- The frontend React app is now located in the `frontend/` folder.
- A new backend Node server is created in the `backend/` folder to run scraping scripts.

## Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install express cors node-fetch cheerio
   ```

3. Start the backend server:
   ```bash
   node server.js
   ```

The backend server will run on http://localhost:4000 and expose an API endpoint `/scrape` to trigger scraping.

## Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Running Both Servers Concurrently

You can open two terminal windows/tabs and run the backend and frontend servers separately.

Alternatively, you can use tools like `concurrently` to run both with a single command (optional).

## Connecting Frontend to Backend

