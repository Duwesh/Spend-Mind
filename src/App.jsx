import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./components/features/auth/Login";
import Signup from "./components/features/auth/Signup";
import Dashboard from "./components/features/analytics/Dashboard";
import ExpenseList from "./components/features/expenses/ExpenseList";
import SettingsLayout from "./components/features/settings/SettingsLayout";
import AIAdvisor from "./components/features/advisor/AIAdvisor";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>

          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<ExpenseList />} />
            <Route path="ai-advisor" element={<AIAdvisor />} />
            <Route path="settings" element={<SettingsLayout />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
