import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function AuthLayout() {
  // For Login/Signup pages
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-center items-center bg-muted p-10 text-muted-foreground">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">SpendMind</h1>
          <p className="text-lg">
            Take control of your finances with AI-powered insights.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
