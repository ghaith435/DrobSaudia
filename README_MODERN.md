# Riyadh Guide - Modern Web App

This project has been upgraded to a modern tech stack using **Next.js 14**, **TypeScript**, and **Premium CSS**.

## Project Structure
- `src/app`: Main application routes (App Router).
- `src/components`: Reusable UI components (Navbar, PlaceCard, etc.).
- `src/data`: Static data files (e.g., `places.ts`).
- `src/styles`: (Optional) Additional styles, though we use `globals.css`.

## Features
- **Premium Design**: Dark mode with "Riyadh Gold" accents and Glassmorphism effects.
- **Responsive**: Fully responsive Navbar and Grid layout.
- **Data Integration**: Places are loaded from a structured data file, ready to be connected to a database later.

## How to Run

1. **Install Dependencies** (If not already done):
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   Navigate to `http://localhost:3000`

## Next Steps
- Connect to a database (Prisma + SQLite/MySQL).
- Add "Compare" functionality.
- Implement an "Admin Dashboard" using the same components.
