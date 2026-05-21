import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img src="/Logo.png" alt="Loading..." className="w-12 h-12 animate-pulse" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}
