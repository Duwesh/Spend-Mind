# Spend Mind 🧠💰

[![Deploy to GitHub Pages](https://github.com/Duwesh/Spend-Mind/actions/workflows/deploy.yml/badge.svg)](https://github.com/Duwesh/Spend-Mind/actions/workflows/deploy.yml)

**Spend Mind** is an intelligent, AI-powered personal finance tracker designed to help you take control of your financial life. Beyond simple expense tracking, it helps you set goals, visualize your spending habits, and receive personalized advice to optimize your budget.

## ✨ Features

- **Dashboard Overview**: Visualize your monthly spending, budget progress, and daily trends at a glance.
- **PennyWise AI Chatbot**: An intelligent financial companion powered by **Google Gemini 1.5 Flash** and **LangGraph**. Ask questions about your spending, get real-time advice, and interact with your financial data.
- **Advanced AI Advisor**: A dedicated analysis suite that evaluates goal feasibility, suggests spending reductions, and optimizes your savings strategy.
- **Professional PDF Export**: Generate and download detailed, professionally styled expense reports with a single click.
- **Full Theme Support**: A premium UI experience with seamless transitions between **Light** and **Dark** modes.
- **Expense Tracking**: Easily add, categorize, and manage your daily expenses with automated synchronization.
- **Budget Management**: Set monthly limits for different categories (Food, Transport, Utilities, etc.) and get visual alerts.
- **Goal Setting**: Define financial goals (e.g., "New Laptop", "Vacation") and receive AI-driven timeline projections.
- **Secure Cloud Sync**: All your data is securely stored in the cloud using **Supabase**, featuring real-time updates across sessions.
- **Authentication**: Secure Email/Password login powered by Supabase Auth.

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **AI Engine**: Google Gemini 1.5 Flash via LangChain / LangGraph
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **PDF Generation**: jsPDF, jsPDF-AutoTable
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM (v7)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A [Supabase](https://supabase.com/) account

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/spend-mind.git
    cd spend-mind
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup**
    Run the SQL script provided in `supabase/schema.sql` in your Supabase project's SQL Editor to set up the necessary tables and policies.

5.  **Run the application**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌍 Deployment (GitHub Pages)

This project is configured for automatic deployment to GitHub Pages using **GitHub Actions**.

### CI/CD Workflow

The deployment is handled by the [deploy.yml](file:///.github/workflows/deploy.yml) workflow:

- **Triggers**: Automatic deployment on every push to the `main` branch, or via manual `workflow_dispatch`.
- **Environment**: Builds the project on `ubuntu-latest` and deploys the `dist` folder to the `gh-pages` branch.

### Setup Steps

1.  **Add Secrets**:
    - Go to your GitHub Repository **Settings** > **Secrets and variables** > **Actions**.
    - Click **New repository secret**.
    - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with your Supabase credentials.

2.  **Configure Pages**:
    - Go to **Settings** > **Pages**.
    - Under **Build and deployment**, select **Deploy from a branch**.
    - Set **Branch** to `gh-pages` and folder to `/ (root)`.

3.  **Automatic Deployment**:
    - Push your code to the `main` branch. GitHub Actions will handle the build and deployment automatically.

Your app will be live at `https://Duwesh.github.io/Spend-Mind/`.

## 📂 Project Structure

```
src/
├── components/
│   ├── features/       # Feature-specific components (Auth, Expenses, Analytics, etc.)
│   ├── layout/         # Layout components (Sidebar, Navbar)
│   └── ui/             # Reusable UI components (Buttons, Inputs, Cards, etc.)
├── context/            # Global state (AuthContext, AppContext)
├── lib/                # Utilities and Supabase client
└── App.jsx             # Main application entry point
```

## 📄 License

This project is licensed under the MIT License.
