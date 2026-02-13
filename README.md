# Spend Mind 🧠💰

**Spend Mind** is an intelligent, AI-powered personal finance tracker designed to help you take control of your financial life. Beyond simple expense tracking, it helps you set goals, visualize your spending habits, and receive personalized advice to optimize your budget.

## ✨ Features

- **Dashboard Overview**: Visualize your monthly spending, budget progress, and daily trends at a glance.
- **Expense Tracking**: Easily add, categorize, and manage your daily expenses.
- **Budget Management**: Set monthly limits for different categories (Food, Transport, Utilities, etc.) and get alerts when you're close to overspending.
- **AI Financial Advisor**: Get personalized insights and actionable recommendations to save money based on your actual spending patterns.
- **Goal Setting**: Define financial goals (e.g., "New Laptop", "Vacation") and track your progress.
- **Secure Cloud Sync**: All your data is securely stored in the cloud using **Supabase**, allowing you to access it from anywhere.
- **Authentication**: Secure Email/Password login and signup.

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL, Auth)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM

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
