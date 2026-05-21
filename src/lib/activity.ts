import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Types ────────────────────────────────────────────────────────
export type ActivityType =
  | "analysis_started"
  | "analysis_completed"
  | "rights_checked"
  | "draft_generated"
  | "explanation_requested"
  | "login"
  | "signup"
  | "profile_updated";

export interface Activity {
  id?: string;
  uid: string;
  type: ActivityType;
  title: string;
  description: string;
  metadata?: any;
  createdAt: Timestamp | null;
}

// ─── Friendly labels ─────────────────────────────────────────────
const TYPE_LABELS: Record<ActivityType, string> = {
  analysis_started: "Situation Analysis Started",
  analysis_completed: "Situation Analysis Completed",
  rights_checked: "Know Your Rights Checked",
  draft_generated: "Legal Draft Generated",
  explanation_requested: "Deep-Dive Explanation Requested",
  login: "Logged In",
  signup: "Account Created",
  profile_updated: "Profile Updated",
};

export function getActivityLabel(type: ActivityType): string {
  return TYPE_LABELS[type] || type;
}

// ─── Log an activity ─────────────────────────────────────────────
export async function logActivity(
  uid: string,
  type: ActivityType,
  title: string,
  description: string,
  metadata?: any
): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "activities"), {
      uid,
      type,
      title,
      description,
      metadata: metadata || {},
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Failed to log activity:", error);
    return null;
  }
}

// ─── Fetch recent activities for a user ──────────────────────────
export async function getRecentActivities(
  uid: string,
  count: number = 10
): Promise<Activity[]> {
  try {
    const q = query(
      collection(db, "activities"),
      where("uid", "==", uid),
      limit(50) // Fetch a reasonable amount to sort locally
    );
    const snapshot = await getDocs(q);
    const activities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Activity, "id">),
    }));

    // Sort in memory to avoid needing a Firestore composite index immediately
    return activities.sort((a, b) => {
      const getMs = (ts: any) => {
        if (!ts) return 0;
        if (typeof ts.toMillis === 'function') return ts.toMillis();
        if (ts instanceof Date) return ts.getTime();
        if (typeof ts === 'number') return ts;
        if (typeof ts === 'string') return new Date(ts).getTime();
        return 0;
      };
      return getMs(b.createdAt) - getMs(a.createdAt);
    }).slice(0, count);
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return [];
  }
}

// ─── Get activity by ID ──────────────────────────────────────────
export async function getActivityById(id: string): Promise<Activity | null> {
  try {
    const docSnap = await getDoc(doc(db, "activities", id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Omit<Activity, "id">) };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch activity:", error);
    return null;
  }
}

// ─── Get activity stats for a user ───────────────────────────────
export async function getActivityStats(uid: string): Promise<{
  totalAnalyses: number;
  totalDrafts: number;
  totalRightsChecks: number;
}> {
  try {
    const q = query(
      collection(db, "activities"),
      where("uid", "==", uid)
    );
    const snapshot = await getDocs(q);

    let totalAnalyses = 0;
    let totalDrafts = 0;
    let totalRightsChecks = 0;

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.type === "analysis_completed" || data.type === "analysis_started") totalAnalyses++;
      if (data.type === "draft_generated") totalDrafts++;
      if (data.type === "rights_checked") totalRightsChecks++;
    });

    return { totalAnalyses, totalDrafts, totalRightsChecks };
  } catch (error) {
    console.error("Failed to fetch activity stats:", error);
    return { totalAnalyses: 0, totalDrafts: 0, totalRightsChecks: 0 };
  }
}

// ─── Relative time helper ────────────────────────────────────────
export function timeAgo(timestamp: any): string {
  if (!timestamp || typeof timestamp.toMillis !== "function") return "Just now";
  const now = Date.now();
  const then = timestamp.toMillis();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(then).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
