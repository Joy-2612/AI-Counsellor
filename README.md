# AI Counsellor

AI Counsellor is a full-stack web application designed to help users with career guidance, motivation, personalized roadmaps, job referrals, and more. It utilizes **Node.js**, **Express**, and **MongoDB** on the server side, along with a **React** client. The application features:

- **User Authentication & Profile**: Securely register, login, and maintain a profile (qualifications, bio, goals, etc.).
- **AI-Driven Personality Test**: A short interactive test to collect user input (voice or text), processed by an AI to generate a concise user profile.
- **Motivation & Talk-to-AI**: AI-generated quotes, tips, and videos; plus a direct chat-like interface for motivational, personalized discussions.
- **AI-Recommended Roadmaps**: Step-by-step learning or skill acquisition paths, with links and resources.
- **Job Referrals Portal**: Community job postings with referral counts, user-based requests, and search features.
- **AI-Generated Recommendations**: Tailored suggestions for platforms, competitions, exams, hackathons, and scholarships.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Server Configuration](#server-configuration)
   - [Client Configuration](#client-configuration)
3. [Environment Variables](#environment-variables)
4. [Key Features](#key-features)
5. [License](#license)

## Project Structure

```pgsql
AI-Counsellor/
├── README.md
├── client/
│ ├── README.md
│ ├── package.json
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ └── services/
└── server/
├── Controllers/
├── Middlewares/
├── Models/
├── Routes/
├── config/
├── prompts/
├── index.js
├── package.json
└── .env.example
```

- **client/**: Frontend (React) application

  - **components/**: Reusable React components (Navbar, Sidebar, etc.)
  - **pages/**: Major views/pages (Login, Profile, Recommendations, etc.)
  - **services/**: Services for API calls (e.g., `api.js` with Axios setup)

- **server/**: Backend (Node.js/Express) application
  - **Controllers/**: Logic for each feature (profile, motivation, etc.)
  - **Middlewares/**: Express middleware (e.g., authorization)
  - **Models/**: Mongoose data models (User, Job, Company)
  - **Routes/**: REST endpoints for different features
  - **config/**: Database config (`db.js`)
  - **prompts/**: Prompt templates for AI requests (XML-based)
  - **index.js**: Main server entry point

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/) (v6+ recommended)
- [MongoDB](https://www.mongodb.com/) instance or Atlas URI
- (Optional) An API key for **Gemini** / **Google Generative AI** if you want the AI features fully functional

### Installation

1. **Clone this repository** (or download the ZIP):

   ```bash
   git clone https://github.com/Joy-2612/AI-Counsellor.git
   ```

2. **Install server dependencies:**

   ```bash
   cd ./server
   npm install
   ```

3. **Install client dependencies:**

   ```bash
   cd ../client
   npm install
   ```

## Server Configuration

1. Go to the server directory:

   ```bash
   cd AI-Counsellor/server
   ```

2. Copy the example environment file and rename it to `.env`:

   ```bash
   cp .env.example .env
   ```

3. Fill in the required environment variables:

- `MONGO_URI`: Connection string to your MongoDB
- `GEMINI_API_KEY`: API key for Google Generative AI / Gemini (optional, only needed for AI features)

4. Start the server:

   ```bash
   npm start
   ```

The server will run by default on http://localhost:5000.

## Client Configuration

1. Open another terminal window and navigate to the **client** directory:

   ```bash
   cd AI-Counsellor/client
   ```

2. Ensure all dependencies are installed:

   ```bash
   npm install
   ```

3. Start the client:
   ```bash
   npm start
   ```

The React application will launch and run on **http://localhost:3000** by default.

## Environment Variables

In the `server/.env` file (based on `.env.example`):

```
MONGO_URI=your_mongo_connection_string
GEMINI_API_KEY=your_google_generative_ai_key
JWT_SECRET=some_secret_key (if you want to customize)
```

- **MONGO_URI**: Connect to MongoDB (local or Atlas).
- **GEMINI_API_KEY**: Provides AI functionalities for motivation, recommendations, roadmaps, etc.

## Key Features

### 1. Authentication & Profile

- Users can register and log in.
- Profile includes location, qualifications, bio, hobbies, and career goals.

### 2. Personality Test

- A short question-answer session (speech or text input).
- On submission, AI infers and updates user profile data (bio, goals, qualifications, etc.).

### 3. Motivation

- Fetch daily motivational quotes, videos, and tips from the AI.
- Extra "Talk to AI" page for personal encouragement and short, spoken-language suggestions.

### 4. Job Referrals

- Users can post job referrals with a link and number of available referrals.
- Other users can request a referral, which decrements the referral count.

### 5. Recommendations

- Based on user's stored profile, AI suggests relevant platforms, competitions, exams, hackathons, and scholarships.

### 6. Roadmap Generation

- Enter a skill/topic (e.g., "React"), AI returns a detailed step-by-step plan.
- Includes estimated completion time, related links, and optional YouTube references.

### License

This project is licensed under the MIT License. You are free to modify and distribute this project under its terms.
