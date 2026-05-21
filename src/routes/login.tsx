import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Layout, Section } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { Mail, Lock, Chrome, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !authLoading) {
      navigate({ to: "/dashboard" });
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      logActivity(cred.user.uid, "login", "Email Login", `Logged in via email`);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      console.error(error);
      const message = error.code === "auth/wrong-password" || error.code === "auth/user-not-found" 
        ? "Invalid email or password" 
        : "Failed to login. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      logActivity(cred.user.uid, "login", "Google Login", `Logged in via Google`);
      toast.success("Logged in with Google");
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      console.error(error);
      toast.error("Google sign-in failed");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to send reset email");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md">
          <Reveal>
            <div className="text-center mb-10">
              <Link to="/" className="inline-block mb-6">
                <img src="/Logo.png" alt="ApnaNyaya" className="h-12 w-auto mx-auto" />
              </Link>
              <h1 className="font-serif text-4xl text-primary">Welcome back</h1>
              <p className="mt-2 text-muted-foreground">Access your legal intelligence dashboard</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-card border border-border p-8 shadow-sm relative">
              <div className="grain absolute inset-0 opacity-10 pointer-events-none" />
              
              <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-background border border-border px-10 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Password</label>
                    <button 
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[10px] uppercase tracking-widest text-accent hover:underline"
                    >
                      {resetLoading ? "Sending..." : "Forgot password?"}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-background border border-border px-10 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-4 text-sm font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                  {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                  <span className="bg-card px-4 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full border border-border bg-background py-4 text-sm font-medium hover:bg-secondary/50 transition-all flex items-center justify-center gap-3"
              >
                <Chrome className="w-4 h-4" />
                Google
              </button>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-accent hover:underline font-medium">
                  Create one here
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}
