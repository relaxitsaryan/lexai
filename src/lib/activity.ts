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
  getCountFromServer,
  onSnapshot,
  setDoc,
  increment,
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

// ─── Stats Tracking ──────────────────────────────────────────────
async function incrementActivityStat(uid: string, type: ActivityType) {
  try {
    const statsRef = doc(db, "users", uid, "dashboard", "stats");
    const updates: any = {};
    
    if (type === "analysis_completed" || type === "analysis_started") updates.totalAnalyses = increment(1);
    if (type === "draft_generated") updates.totalDrafts = increment(1);
    if (type === "rights_checked") updates.totalRightsChecks = increment(1);

    if (Object.keys(updates).length > 0) {
      await setDoc(statsRef, updates, { merge: true });
    }
  } catch (error) {
    console.error("Failed to increment activity stat:", error);
  }
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
    
    // Background update of stats - don't await to keep UI snappy
    incrementActivityStat(uid, type);
    
    return docRef.id;
  } catch (error) {
    console.error("Failed to log activity:", error);
    return null;
  }
}

// ─── Fetch recent activities (one-time) ──────────────────────────
export async function getRecentActivities(
  uid: string,
  count: number = 10
): Promise<Activity[]> {
  // Existing implementation for one-time fetch...
  // (Omitted for brevity, but I'll keep the logic I optimized earlier)
  try {
    const q = query(
      collection(db, "activities"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Activity, "id">),
    }));
  } catch (error: any) {
    // Fallback logic preserved...
    if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
      const q = query(collection(db, "activities"), where("uid", "==", uid), limit(Math.max(count, 20)));
      const snapshot = await getDocs(q);
      const activities = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Activity, "id">) }));
      return activities.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)).slice(0, count);
    }
    return [];
  }
}

// ─── Real-time subscription ──────────────────────────────────────
export function subscribeToRecentActivities(
  uid: string,
  onUpdate: (activities: Activity[]) => void,
  count: number = 10
) {
  const q = query(
    collection(db, "activities"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(count)
  );

  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Activity, "id">)
    }));
    onUpdate(activities);
  }, (error) => {
    console.error("Activity subscription error:", error);
    // Fallback if index fails
    const fallbackQ = query(collection(db, "activities"), where("uid", "==", uid), limit(20));
    onSnapshot(fallbackQ, (s) => {
      const activities = s.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Activity, "id">) }))
        .sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      onUpdate(activities);
    });
  });
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
    // Highly optimized: read from cached stats document first
    const statsSnap = await getDoc(doc(db, "users", uid, "dashboard", "stats"));
    if (statsSnap.exists()) {
      const data = statsSnap.data() as any;
      return {
        totalAnalyses: data.totalAnalyses || 0,
        totalDrafts: data.totalDrafts || 0,
        totalRightsChecks: data.totalRightsChecks || 0,
      };
    }

    // Fallback to counting if stats doc doesn't exist yet
    const baseQuery = query(collection(db, "activities"), where("uid", "==", uid));
    const [analysesStarted, analysesCompleted, drafts, rights] = await Promise.all([
      getCountFromServer(query(baseQuery, where("type", "==", "analysis_started"))),
      getCountFromServer(query(baseQuery, where("type", "==", "analysis_completed"))),
      getCountFromServer(query(baseQuery, where("type", "==", "draft_generated"))),
      getCountFromServer(query(baseQuery, where("type", "==", "rights_checked"))),
    ]);

    const result = {
      totalAnalyses: analysesStarted.data().count + analysesCompleted.data().count,
      totalDrafts: drafts.data().count,
      totalRightsChecks: rights.data().count,
    };

    // Cache this result for next time
    setDoc(doc(db, "users", uid, "dashboard", "stats"), result, { merge: true }).catch(() => {});

    return result;
  } catch (error) {
    // Fallback if composite indices are missing or cached doc fails
    console.warn("Activity stats query failed, falling back to manual count:", error);
    try {
      const q = query(collection(db, "activities"), where("uid", "==", uid), limit(500));
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
      
      const fallbackResult = { totalAnalyses, totalDrafts, totalRightsChecks };
      // Try to cache the fallback result too
      setDoc(doc(db, "users", uid, "dashboard", "stats"), fallbackResult, { merge: true }).catch(() => {});
      
      return fallbackResult;
    } catch (innerError) {
      console.error("Critical failure in activity stats:", innerError);
      return { totalAnalyses: 0, totalDrafts: 0, totalRightsChecks: 0 };
    }
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
