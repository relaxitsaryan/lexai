import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Layout, Section, Eyebrow } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import {
  Activity,
  getRecentActivities,
  getActivityStats,
  getActivityLabel,
  timeAgo,
} from "@/lib/activity";
import {
  FileText,
  Search,
  ShieldCheck,
  Zap,
  Settings,
  LogOut,
  ArrowRight,
  Scale,
  Loader2,
  User,
  Mail,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

// ─── Icon map for activity types ─────────────────────────────────
const ACTIVITY_ICONS: Record<string, typeof FileText> = {
  analysis_started: Search,
  analysis_completed: Scale,
  rights_checked: ShieldCheck,
  draft_generated: FileText,
  explanation_requested: Zap,
  login: User,
  signup: User,
  profile_updated: Settings,
};

function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    totalDrafts: 0,
    totalRightsChecks: 0,
  });
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  // Fetch data
  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName || "");

    const fetchData = async () => {
      setActivityLoading(true);
      try {
        const [recentActivities, activityStats] = await Promise.all([
          getRecentActivities(user.uid, showAllActivities ? 50 : 5),
          getActivityStats(user.uid),
        ]);
        setActivities(recentActivities);
        setStats(activityStats);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        toast.error("Failed to load some dashboard data");
      } finally {
        setActivityLoading(false);
      }
    };

    fetchData();
  }, [user, showAllActivities]);

  // Profile completeness
  const getProfileCompleteness = () => {
    if (!user) return 0;
    let score = 25; // base for having an account
    if (user.displayName) score += 25;
    if (user.email) score += 25;
    if (user.emailVerified) score += 25;
    return score;
  };

  // Save profile handler
  const handleSaveProfile = async () => {
    if (!user || !displayName.trim()) return;
    setSavingProfile(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      await updateDoc(doc(db, "users", user.uid), {
        displayName: displayName.trim(),
        updatedAt: new Date().toISOString(),
      });
      toast.success("Profile updated!");
      setShowSettings(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img src="/Logo.png" alt="Loading..." className="w-12 h-12 animate-pulse" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  const profileCompleteness = getProfileCompleteness();

  const statCards = [
    { label: "Total Analyses", value: String(stats.totalAnalyses), icon: Search },
    { label: "Drafts Generated", value: String(stats.totalDrafts), icon: FileText },
    { label: "Rights Checked", value: String(stats.totalRightsChecks), icon: ShieldCheck },
    { label: "Member Since", value: user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—", icon: Calendar },
  ];

  return (
    <Layout>
      <Section className="py-12">
        {/* ─── Header ─── */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <Eyebrow>Welcome back</Eyebrow>
              <h1 className="mt-4 font-serif text-5xl text-primary">
                {user.displayName || "Advocate"}
              </h1>
              <p className="mt-2 text-muted-foreground">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent hover:opacity-80 transition-opacity"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </Reveal>

        {/* ─── Live Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.label} delay={i * 0.05}>
                <div className="bg-card border border-border p-5 md:p-6 shadow-sm group hover:border-accent transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <Icon size={20} className="text-accent" />
                    <span className="text-2xl md:text-3xl font-serif text-primary">{s.value}</span>
                  </div>
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* ─── Main Grid ─── */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* ─── Recent Activity (live from Firestore) ─── */}
          <div className="lg:col-span-8">
            <Reveal delay={0.2}>
              <div className="border border-border bg-background p-6 md:p-8 min-h-[400px]">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                  <h3 className="font-serif text-2xl text-primary">Recent Activity</h3>
                  <button
                    onClick={() => setShowAllActivities((prev) => !prev)}
                    className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary underline"
                  >
                    {showAllActivities ? "Show less" : "View all"}
                  </button>
                </div>

                {activityLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-16">
                    <Scale size={40} className="mx-auto text-border mb-4" />
                    <h4 className="font-serif text-xl text-primary/60 mb-2">No activity yet</h4>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                      Start by analyzing a legal situation. Your activity history will appear here.
                    </p>
                    <Link
                      to="/analyzer"
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors"
                    >
                      Open Analyzer <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activities.map((activity) => {
                      const Icon = ACTIVITY_ICONS[activity.type] || FileText;
                      const isClickable = ["analysis_completed", "rights_checked", "draft_generated", "explanation_requested"].includes(activity.type);
                      
                      const content = (
                        <div className={`flex gap-4 items-start p-3 -mx-3 transition-colors ${isClickable ? "hover:bg-secondary/50 cursor-pointer" : ""}`}>
                          <div className="bg-secondary/50 p-3">
                            <Icon size={18} className="text-primary/70" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {timeAgo(activity.createdAt)} • {activity.description}
                            </p>
                          </div>
                          <span className="text-[9px] uppercase tracking-widest bg-secondary/60 text-muted-foreground px-2 py-1 whitespace-nowrap hidden sm:block">
                            {getActivityLabel(activity.type).split(" ")[0]}
                          </span>
                        </div>
                      );

                      if (isClickable) {
                        return (
                          <Link 
                            key={activity.id} 
                            to="/analyzer" 
                            search={{ caseId: activity.id }}
                            className="block"
                          >
                            {content}
                          </Link>
                        );
                      }

                      return <div key={activity.id}>{content}</div>;
                    })}
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* ─── Right Sidebar ─── */}
          <div className="lg:col-span-4">
            <Reveal delay={0.3}>
              <div className="space-y-6">
                {/* Quick Action */}
                <div className="border border-accent/20 bg-accent/5 p-8">
                  <h3 className="font-serif text-xl text-primary mb-4 italic">Quick Action</h3>
                  <p className="text-sm text-primary/70 mb-6">
                    Need legal advice right now? Start a new situation analysis.
                  </p>
                  <Link
                    to="/analyzer"
                    className="w-full bg-accent text-accent-foreground py-3 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Zap size={14} />
                    Start Analysis
                  </Link>
                </div>

                {/* Profile Integrity / Settings Panel */}
                {showSettings ? (
                  <div className="border border-border bg-background p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-serif text-xl text-primary italic">Edit Profile</h3>
                      <button
                        onClick={() => setShowSettings(false)}
                        className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                          Display Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full bg-background border border-border px-10 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                          Email (read-only)
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <input
                            type="email"
                            value={user.email || ""}
                            disabled
                            className="w-full bg-secondary/30 border border-border px-10 py-3 text-sm text-muted-foreground cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="w-full bg-primary text-primary-foreground py-3 text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                      >
                        {savingProfile ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-border bg-background p-8">
                    <h3 className="font-serif text-xl text-primary mb-4 italic">Profile Integrity</h3>
                    <div className="w-full bg-secondary h-1.5 mb-2">
                      <div
                        className="bg-accent h-full transition-all duration-500"
                        style={{ width: `${profileCompleteness}%` }}
                      />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex justify-between">
                      <span>Account Health</span>
                      <span>{profileCompleteness}%</span>
                    </p>
                    {!user.emailVerified && (
                      <p className="mt-3 text-[10px] text-accent/80 italic">
                        Verify your email to reach 100%
                      </p>
                    )}
                    <button
                      onClick={() => setShowSettings(true)}
                      className="mt-6 flex items-center gap-2 text-xs text-primary/70 hover:text-accent transition-colors"
                    >
                      <Settings size={14} />
                      Manage Settings
                    </button>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
