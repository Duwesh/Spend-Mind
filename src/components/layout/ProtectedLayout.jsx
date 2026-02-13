import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { AppProvider } from "../../context/AppContext";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <AppProvider>
      {/* AppProvider is here so it has access to AuthContext if needed, 
            and to ensure it's only active when logged in */}
      <div className="min-h-screen bg-background flex">
        {/* Sidebar - Hidden on mobile, fixed on desktop */}
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 md:pl-64 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
