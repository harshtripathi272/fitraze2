# FitRaze: Full-Stack Fitness Tracker

FitRaze is a comprehensive, full-stack health and fitness tracking application. It features a modern web client, a separate React Native mobile app, and a robust Python (FastAPI) backend. The platform is designed for detailed logging of nutrition, exercise, sleep, and other health metrics, complete with data analytics, goal setting, and AI-powered chat integration.

## Tech Stack

This repository is a monorepo containing three distinct projects:

| Area | Technology | Purpose |
| :--- | :--- | :--- |
| **Web Frontend** | React 18 (TypeScript), Vite, React Router | Main user-facing web application. |
| **Web UI** | shadcn/ui, Radix UI, TailwindCSS, Recharts | Component library, styling, and data visualization. |
| **Web State** | TanStack Query (React Query) | Asynchronous state management and server caching. |
| **Backend** | Python 3, FastAPI, SQLAlchemy | Core API for data processing and user management. |
| **Database** | PostgreSQL (Supabase Hosted), Alembic | Relational database and migration management. |
| **Backend Auth** | JWT, OAuth2PasswordBearer | Secure user authentication and route protection. |
| **Mobile App** | React Native, React Navigation | Cross-platform native application for iOS and Android. |
| **AI / RAG** | Qdrant, OpenAI | Vector database and embedding service for AI chat features. |
| **Deployment** | Netlify | Hosting for the frontend web client and serverless functions. |

---

## Key Features

This application is a feature-rich fitness tracker with a wide range of capabilities based on the available components and backend routes.

### 1. User Management & Onboarding
* **Authentication:** Full JWT-based sign-up and login flow, managed via FastAPI.
* **Health Questionnaire:** A comprehensive, multi-step onboarding survey that collects user data (age, weight, goals, health conditions, motivation) and saves it via the `/users/{user_id}/onboarding` API endpoint.

### 2. Comprehensive Daily Logging
The application is built around dedicated dialogs for logging all major health metrics:
* **Food Logging:** A food dialog that searches the USDA database (via `client/components/lib/usda.ts` and the `/api/v1/foods` backend route) and allows customization of portions.
* **AI Meal Scanning:** A modal to scan meals, which suggests nutritional information.
* **Water Logging:** A dedicated water tracking dialog and component connected to `/api/v1/water` endpoints.
* **Sleep Logging:** A dialog for logging sleep duration, quality, and times, connected to the `/sleep/log` backend.
* **Workout Logging:** A complete workout logger with preset plans, an exercise list, and set/rep/weight tracking.
* **Custom Workouts:** A visual `CustomWorkoutBuilder` to create custom fitness plans from a library of exercises.

### 3. Analytics & Progress Tracking
* **Analytics Dashboard:** A dedicated `/analytics` page with charts for weekly calories, macros, and weight progress, powered by the `/api/v1/users/{user_id}/analytics` endpoint.
* **Progress Page:** Tracks achievements, streaks, and gamified milestones.
* **Health Metrics:** A dashboard for monitoring core health stats like BMI, body fat, and muscle mass.
* **Goal Setting:** A dedicated page for creating, tracking, and updating primary fitness goals.

### 4. Integrations & AI
* **Google Fit:** Integrates with Google Fit to pull steps, distance, and active minutes data via the `/fit/summary` API route.
* **AI Chat:** Features an AI chat assistant. The backend uses a Qdrant vector database and OpenAI embeddings (`embedding_service.py`) to provide a RAG (Retrieval-Augmented Generation) context for chat messages.

### 5. Multi-Platform Support
* **Web Application:** A complete, feature-rich web app built with React and Vite.
* **Mobile Application:** A separate, dedicated React Native application (`mobile/`) providing a native experience with its own screens, components, and navigation stack.

## How to Run

This project is a monorepo containing multiple runnable applications.

### Backend (FastAPI Server)
The backend server runs on `http://localhost:8000`.

1.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
2.  **Run Database Migrations:**
    (Requires `alembic.ini` to be configured with the correct `sqlalchemy.url`)
    ```bash
    alembic upgrade head
    ```
3.  **Start the server:**
    ```bash
    # (From the root directory)
    uvicorn server.main:app --reload --port 8000
    ```
   

### Web Client (React App)
The web client runs on `http://localhost:5173` and proxies API requests to the backend.

1.  **Install Node dependencies:**
    ```bash
    npm install
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```
   

### Mobile Client (React Native)
The mobile client is run from the `mobile/` directory.

1.  **Install Node dependencies:**
    ```bash
    cd mobile
    npm install
    ```
2.  **Run on a simulator/device:**
    ```bash
    npm run android
    # OR
    npm run ios
    ```
