import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./components/features/auth/Login";
import Signup from "./components/features/auth/Signup";
import Dashboard from "./components/features/analytics/Dashboard";
import ExpenseList from "./components/features/expenses/ExpenseList";
import Budgets from "./components/features/budgets/Budgets";
import Reports from "./components/features/reports/Reports";
import SettingsLayout from "./components/features/settings/SettingsLayout";
import AIAdvisor from "./components/features/advisor/AIAdvisor";

function App() {
  const isProduction = import.meta.env.MODE === "production";
  const basename = isProduction ? "/Spend-Mind" : "";

  return (
    <Router basename={basename}>
      <AuthProvider>
        <Routes>
          {/* Redirect /Spend-Mind/ paths to / in dev to fix "No routes matched" errors */}
          {!isProduction && (
            <Route path="/Spend-Mind/*" element={<Navigate to="/" replace />} />
          )}

          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>

          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<ExpenseList />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="reports" element={<Reports />} />
            <Route path="ai-advisor" element={<AIAdvisor />} />
            <Route path="settings" element={<SettingsLayout />} />
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
