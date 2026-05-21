import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { User as UserIcon, Mail, Lock, Chrome, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !authLoading) {
      navigate({ to: "/dashboard" });
    }
  }, [user, authLoading, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with name
      await updateProfile(user, { displayName: name });

      // Store in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: name,
        email: email,
        createdAt: new Date().toISOString(),
      });

      toast.success("Account created successfully!");
      logActivity(user.uid, "signup", "Account Created", `Signed up via email as ${name}`);
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      console.error(error);
      const message = error.code === "auth/email-already-in-use" 
        ? "Email already in use" 
        : "Failed to create account. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Ensure user exists in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        lastLogin: new Date().toISOString(),
      }, { merge: true });

      toast.success("Signed up with Google");
      logActivity(user.uid, "signup", "Google Signup", `Signed up via Google as ${user.displayName}`);
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      console.error(error);
      toast.error("Google sign-in failed");
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
              <h1 className="font-serif text-4xl text-primary">Start your journey</h1>
              <p className="mt-2 text-muted-foreground">Join ApnaNyaya today for professional legal aid</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-card border border-border p-8 shadow-sm relative">
              <div className="grain absolute inset-0 opacity-10 pointer-events-none" />
              
              <form onSubmit={handleSignup} className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-background border border-border px-10 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                      placeholder="Justice Sahab"
                      required
                    />
                  </div>
                </div>

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
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Password</label>
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
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                  {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                  <span className="bg-card px-4 text-muted-foreground">Or register with</span>
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
                Already have an account?{" "}
                <Link to="/login" className="text-accent hover:underline font-medium">
                  Log in instead
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}
