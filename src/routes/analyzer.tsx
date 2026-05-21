import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { analyzeLegalSituation, getLegalRights, generateLegalDraft, getDetailedExplanation } from "@/lib/groq";
import { Scale, ShieldCheck, Clock, AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, Gavel, LayoutDashboard, FileText, Search, Mic2, Settings, Globe, Info, Zap, X, Copy, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ActionRoadmap } from "@/components/analyzer/ActionRoadmap";
import { useAuth } from "@/context/AuthContext";
import { logActivity, getActivityById } from "@/lib/activity";

export const Route = createFileRoute("/analyzer")({
  validateSearch: (search: Record<string, unknown>): { caseId?: string } => {
    return {
      caseId: (search.caseId as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Situation Analyzer — ApnaNyaya" },
      { name: "description", content: "Analyze your legal situation and get an actionable roadmap instantly with ApnaNyaya." },
    ],
  }),
  component: AnalyzerPage,
});

const SAMPLES = [
  {
    label: "Unpaid Wages",
    text: "My employer in Bangalore has not paid my salary for the last 2 months. When I ask the HR, they say they have cash flow issues. Now they are threatening to fire me.",
  },
  {
    label: "Tenant Eviction",
    text: "My landlord told me to vacate within 7 days without notice. I have a valid rental agreement for 8 more months and have paid all my bills on time.",
  },
  {
    label: "E-commerce Fraud",
    text: "I bought a phone online for ₹50,000. It arrived broken and the box was tampered with. The seller refuses to refund me and says I broke it.",
  },
  {
    label: "UPI Fraud",
    text: "I received a call from someone claiming to be from my bank. They asked for a KYC update and I shared an OTP. Immediately, ₹20,000 was debited from my account via UPI.",
  },
  {
    label: "Gratuity Claim",
    text: "I worked for a private firm for 6 years and resigned last month. The company is refusing to pay my gratuity, saying I was an 'at-will' employee.",
  },
  {
    label: "RERA Complaint",
    text: "I booked a flat in 2021 with a delivery date of Dec 2023. The builder has only completed 40% of the work and is now asking for more money for 'increased raw material costs'.",
  },
  {
    label: "Medical Negligence",
    text: "My father underwent a minor knee surgery, but due to a doctor's error, he developed a severe infection and now cannot walk. The hospital refuses to share medical records.",
  },
  {
    label: "Insurance Reject",
    text: "My health insurance claim for a gall bladder surgery was rejected. They claim it was a 'pre-existing disease' even though I've had the policy for 5 years.",
  },
  {
    label: "Mutual Divorce",
    text: "My spouse and I want to file for a mutual consent divorce. We have been living separately for 14 months and have agreed on all terms including alimony.",
  },
  {
    label: "Illegal Encroachment",
    text: "My neighbor has started a semi-permanent construction that extends 3 feet into my ancestral land. They are threatening me when I try to stop them.",
  },
  {
    label: "Sexual Harassment",
    text: "I am facing persistent unwanted advances from my senior manager. I complained to HR, but they are trying to suppress the matter and asking me to 'adjust'.",
  },
  {
    label: "Child Custody",
    text: "After our separation, my husband is not allowing me to meet our 6-year-old daughter. He is keeping her in a different city without my consent.",
  },
  {
    label: "Defamation",
    text: "A former business partner is spreading false rumors about me on social media, claiming I embezzled funds. This is damaging my reputation and current business.",
  },
  {
    label: "Maintenance Claim",
    text: "I am a homemaker with two children. My husband has deserted us and is not providing any financial support. I need to claim maintenance for our survival.",
  },
  {
    label: "PF Withdrawal",
    text: "I applied for a PF withdrawal for my daughter's wedding 3 months ago. The EPFO portal shows 'under process' and the local office is not responding to calls.",
  },
  {
    label: "Partition Dispute",
    text: "My brothers are refusing to give me my share of our father's self-acquired property, claiming that because I am a married daughter, I have no rights.",
  },
  {
    label: "Gift Deed Revocation",
    text: "I gifted my house to my son on the condition that he takes care of me. Now he is mistreating me and trying to throw me out. I want to revoke the gift deed.",
  },
  {
    label: "RTI Delay",
    text: "I filed an RTI with the Municipal Corporation regarding local road tenders 45 days ago. I haven't received any response despite the 30-day legal limit.",
  },
  {
    label: "IP Theft",
    text: "I shared my startup's product design with a potential investor. They didn't invest but have now launched a near-identical product under a different name.",
  },
  {
    label: "Cyber Bullying",
    text: "Someone has created a fake profile using my photos and is sending offensive messages to my friends and family. I have reported to the platform but no action taken.",
  },
  {
    label: "Cheque Bounce",
    text: "A client gave me a cheque for ₹1.5 Lakhs for services rendered. The cheque has bounced due to 'insufficient funds'. The client is now ghosting me.",
  },
];

const STAGES = [
  "Consulting Indian Law Library...",
  "Analyzing provided facts...",
  "Applying relevant statutes...",
  "Generating legal report...",
];

function AnalyzerPage() {
  const { user } = useAuth();
  const search = useSearch({ from: "/analyzer" }) as any;
  const [situation, setSituation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedLaw, setExpandedLaw] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'rights' | 'roadmap'>('dashboard');
  const [draftResult, setDraftResult] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [detailedExplanation, setDetailedExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Restore past analysis if caseId is present
  useEffect(() => {
    if (search.caseId) {
      const restoreCase = async () => {
        setIsRestoring(true);
        try {
          const activity = await getActivityById(search.caseId);
          if (activity && activity.metadata) {
            setSituation(activity.metadata.situation || activity.description);
            setResult(activity.metadata.result);
            if (activity.metadata.view) setActiveView(activity.metadata.view);
          } else {
            setError("Could not find this case.");
          }
        } catch (e) {
          setError("Failed to restore case memory.");
        } finally {
          setIsRestoring(false);
        }
      };
      restoreCase();
    }
  }, [search.caseId]);

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  // Fix blank rights view: If we switch to rights view but the result came from basic analyzer, re-fetch rights data
  useEffect(() => {
    const shouldFetchRights = activeView === 'rights' && result && !result.laws && !isLoading;
    if (shouldFetchRights) {
      handleAnalyze(true); // pass skipReset/specificView flag
    }
  }, [activeView, result, isLoading]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async (specificRightsFetch = false) => {
    if (!situation.trim() || isLoading) return;
    setIsLoading(true);
    setStage(0);
    if (!specificRightsFetch) {
      setError(null);
      setResult(null);
    }

    // Log activity start
    const isRights = activeView === 'rights' || specificRightsFetch;
    if (user) {
      logActivity(
        user.uid,
        isRights ? "rights_checked" : "analysis_started",
        isRights ? "Know Your Rights" : "Situation Analysis",
        situation.substring(0, 120),
        { view: activeView }
      );
    }

    try {
      const response = isRights
        ? await (getLegalRights as any)({ data: [{ role: "user", content: situation }] })
        : await (analyzeLegalSituation as any)({ data: [{ role: "user", content: situation }] });
      
      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);
      
      if (specificRightsFetch) {
        setResult((prev: any) => ({ ...prev, ...parsed }));
      } else {
        setResult(parsed);
      }

      // Log completion
      if (user && !specificRightsFetch) {
        logActivity(
          user.uid,
          "analysis_completed",
          parsed.legalDomain || "Legal Analysis",
          `Risk: ${parsed.riskLevel || "N/A"} — ${situation.substring(0, 80)}`,
          { 
            domain: parsed.legalDomain, 
            risk: parsed.riskLevel,
            result: parsed,
            situation: situation,
            view: activeView 
          }
        );
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to process situation. Please check your internet or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLearnMore = async () => {
    if (isExplaining || !situation) return;
    setIsExplaining(true);

    if (user) {
      logActivity(
        user.uid,
        "explanation_requested",
        "Deep-Dive Explanation",
        situation.substring(0, 120),
        { view: activeView }
      );
    }

    try {
      const context = activeView === 'rights' ? "Focus on detailed statutory rights and legal protections." : "Focus on general legal strategy and next steps.";
      const response = await (getDetailedExplanation as any)({ data: { situation, context } });
      const explanation = response.choices[0].message.content;
      setDetailedExplanation(explanation);
    } catch (e) {
      console.error(e);
      setError("Failed to generate detailed explanation.");
    } finally {
      setIsExplaining(false);
    }
  };

  const handleDraftAction = async (actionType: string, stepTitle: string) => {
    if (isDrafting) return;
    setIsDrafting(true);
    try {
      const response = await (generateLegalDraft as any)({ 
        data: { situation, actionType, stepTitle } 
      });
      const draft = response.choices[0].message.content;
      setDraftResult(draft);

      // Log draft generation
      if (user) {
        logActivity(
          user.uid,
          "draft_generated",
          stepTitle,
          `Draft: ${actionType} — ${situation.substring(0, 80)}`,
          { actionType, stepTitle }
        );
      }
    } catch (e) {
      console.error(e);
      setError("Failed to generate draft. Please try again.");
    } finally {
      setIsDrafting(false);
    }
  };

  if (isRestoring) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#f5f0e8]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-accent" />
          <p className="text-xs uppercase tracking-widest text-[#1a1f2e] font-medium">Restoring Case Memory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f5f0e8] text-[#1a1f2e] font-sans selection:bg-accent/30 overflow-hidden">
      <style>{`
        .grain-bg {
          background-image: radial-gradient(rgba(0,0,0,0.05) 1px, transparent 0);
          background-size: 4px 4px;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-none {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      
      {/* ─── MOBILE TOP BAR ─── */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-[#fdfaf5] border-b border-[#e8e0d0] shrink-0 z-20">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/Logo.png" alt="Logo" className="w-6 h-6 object-contain group-hover:scale-105 transition-transform" />
          <span className="font-serif font-bold text-lg tracking-tight">ApnaNyaya</span>
        </Link>
        <span className="text-[8px] bg-accent/15 border border-accent/30 text-accent px-2 py-0.5 font-bold rounded-sm uppercase tracking-wider">
          Alpha Engine
        </span>
      </header>

      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden md:flex w-64 border-r border-[#e8e0d0] bg-[#fdfaf5] flex-col z-20 shadow-sm shrink-0">
        <div className="p-6 border-b border-[#e8e0d0]">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/Logo.png" alt="Logo" className="w-8 h-8 object-contain group-hover:scale-105 transition-transform" />
            <span className="font-serif font-bold text-xl tracking-tight">ApnaNyaya</span>
          </Link>
          <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Workspace Alpha</p>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <p className="px-6 text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 italic">Analysis Engine</p>
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveView('dashboard'); }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all relative cursor-pointer
                ${activeView === 'dashboard' 
                  ? "bg-[#faf3e0] text-accent font-semibold border-l-2 border-accent" 
                  : "text-muted-foreground hover:bg-[#faf3e0]/50 hover:text-primary"}
              `}
            >
              <LayoutDashboard size={16} />
              Situation Dashboard
            </button>
            <button
              onClick={() => { setActiveView('rights'); }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all relative cursor-pointer
                ${activeView === 'rights' 
                  ? "bg-[#faf3e0] text-accent font-semibold border-l-2 border-accent" 
                  : "text-muted-foreground hover:bg-[#faf3e0]/50 hover:text-primary"}
              `}
            >
              <ShieldCheck size={16} />
              Know Your Rights
            </button>
            <button
              onClick={() => { setActiveView('roadmap'); }}
              disabled={!result}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all relative cursor-pointer
                ${activeView === 'roadmap' 
                  ? "bg-[#faf3e0] text-accent font-semibold border-l-2 border-accent" 
                  : !result ? "opacity-30 cursor-not-allowed text-muted-foreground" : "text-muted-foreground hover:bg-[#faf3e0]/50 hover:text-primary"}
              `}
            >
              <Clock size={16} />
              Action Roadmap
            </button>
          </nav>

          <p className="px-6 text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-10 mb-4 italic">Next Steps</p>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-6 py-3 text-sm text-muted-foreground hover:bg-secondary/20 cursor-not-allowed opacity-60">
              <FileText size={16} />
              Draft Legal Notice
              <span className="ml-auto text-[8px] bg-accent/10 border border-accent/20 text-accent px-1.5 py-0.5 font-bold rounded-sm">PRO</span>
            </button>
            <button className="w-full flex items-center gap-3 px-6 py-3 text-sm text-muted-foreground hover:bg-secondary/20 cursor-not-allowed opacity-60">
              <Mic2 size={16} />
              AI Oral Hearing
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-[#e8e0d0]">
          <div className="flex items-center gap-3 p-3 bg-white border border-[#e8e0d0] rounded-lg">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 overflow-hidden">
              <img src="/Logo.png" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold leading-none">Aryan Mahtha</p>
              <p className="text-[9px] text-[#b5892f] font-bold mt-1 uppercase tracking-wider">Advocate Elite</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MOBILE BOTTOM NAVIGATION ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#fdfaf5]/90 backdrop-blur-md border-t border-[#e8e0d0] flex items-center justify-around py-3 px-2 z-30 shadow-lg select-none">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
            activeView === 'dashboard' ? 'text-accent' : 'text-muted-foreground'
          }`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveView('rights')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
            activeView === 'rights' ? 'text-accent' : 'text-muted-foreground'
          }`}
        >
          <ShieldCheck size={20} />
          <span>Know Rights</span>
        </button>
        <button
          onClick={() => setActiveView('roadmap')}
          disabled={!result}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
            activeView === 'roadmap' ? 'text-accent' : !result ? 'opacity-30 cursor-not-allowed' : 'text-muted-foreground'
          }`}
        >
          <Clock size={20} />
          <span>Roadmap</span>
        </button>
      </nav>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 overflow-y-auto relative grain-bg pb-24 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-12">
          
          <div className="flex items-center gap-4 mb-4">
             <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
               {activeView === 'dashboard' ? 'Module 01' : activeView === 'rights' ? 'Module 02' : 'Module 03'}
             </span>
             <div className="h-px bg-accent/20 flex-1" />
             <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold italic hidden sm:inline">
               {activeView === 'dashboard' ? 'Strategic Intelligence' : activeView === 'rights' ? 'Statutory Protection' : 'Action Steps'}
             </span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            {activeView === 'dashboard' ? 'Situation Dashboard' : activeView === 'rights' ? 'Know Your Rights Engine' : 'Action Roadmap'}
          </h1>
          <p className="text-[#6b6560] text-base md:text-lg max-w-2xl mb-8 md:mb-12 leading-relaxed font-sans">
            {activeView === 'dashboard' 
              ? 'Get a high-level strategic overview of your case including risk levels, key facts, and immediate steps.'
              : activeView === 'rights' 
                ? 'Identify specific Indian Laws, Acts, and Sections that protect you. Plain-language explanations for citizens.'
                : 'Your personalized, step-by-step legal journey with authorities, deadlines, and required documentation.'
            }
          </p>

          {/* Input Box */}
          <div className="bg-white border border-[#e8e0d0] p-4 md:p-8 shadow-sm relative mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-widest text-[#6b6560] font-bold italic">Enter Legal Premise</p>
              <span className="text-[9px] text-accent font-bold uppercase tracking-widest">Confidential Engine</span>
            </div>
            <textarea
              className="w-full min-h-[120px] md:min-h-[160px] p-4 md:p-6 bg-[#f5f0e8]/30 border border-[#e8e0d0] text-base md:text-lg font-serif focus:outline-none focus:border-accent transition-colors resize-none placeholder:italic"
              placeholder="Describe your situation in detail..."
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
            />
            
            <div className="mt-4 md:mt-6 flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-none">
              {SAMPLES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSituation(s.text)}
                  className="text-[10px] px-3 py-1.5 border border-[#e8e0d0] text-[#6b6560] hover:bg-[#faf3e0] hover:border-accent hover:text-accent transition-all font-bold uppercase tracking-wider whitespace-nowrap shrink-0 md:shrink cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="mt-6 md:mt-12 pt-6 md:pt-8 border-t border-[#e8e0d0] flex flex-col sm:flex-row items-center gap-4 justify-between">
              <button
                onClick={() => handleAnalyze()}
                disabled={!situation.trim() || isLoading}
                className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 text-sm font-bold transition-all active:scale-95 cursor-pointer
                  ${isLoading || !situation.trim() ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/95 shadow-lg"}
                `}
              >
                {isLoading ? <Scale className="text-accent" size={20} /> : <Zap size={20} className="fill-accent text-accent" />}
                {isLoading ? "Consulting Engine..." : "Analyze Legal Premise"}
              </button>
              
              <div className="flex items-center gap-4 text-center sm:text-right w-full sm:w-auto justify-center sm:justify-end">
                 <div>
                   <p className="text-[9px] uppercase tracking-widest font-bold opacity-40">Intelligence Layer</p>
                   <p className="text-[10px] uppercase tracking-widest font-bold text-accent">Llama-3.3-70B</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Loading View */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white border border-accent/20 p-8 md:p-16 text-center shadow-xl"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
                  <Scale className="text-accent" size={28} />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 font-serif">Synthesizing Legal Logic</h3>
                <p className="text-accent text-xs font-bold mb-6 md:mb-8 uppercase tracking-[0.2em]">{STAGES[stage]}</p>
                <div className="max-w-xs mx-auto h-1.5 bg-[#e8e0d0] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results View - Dashboard */}
          {result && activeView === 'dashboard' && (
            <div className="lex-result space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                 <div className="p-4 md:p-6 bg-white border border-[#e8e0d0] shadow-sm">
                   <p className="text-[10px] uppercase tracking-widest text-[#6b6560] font-bold mb-2">Legal Domain</p>
                   <h3 className="font-serif text-lg md:text-xl font-bold text-primary">{result.legalDomain}</h3>
                 </div>
                 <div className="p-4 md:p-6 bg-white border border-[#e8e0d0] shadow-sm flex items-center justify-between">
                   <div>
                     <p className="text-[10px] uppercase tracking-widest text-[#6b6560] font-bold mb-2">Detected Language</p>
                     <h3 className="font-serif text-lg md:text-xl font-bold text-primary">{result.languageDetected}</h3>
                   </div>
                   <Globe size={24} className="text-accent/40" />
                 </div>
                 <div className={`p-4 md:p-6 border shadow-sm flex items-center justify-between
                   ${result.riskLevel === 'High' ? 'bg-red-50/50 border-red-100' : 'bg-green-50/50 border-green-100'}
                 `}>
                   <div>
                     <p className="text-[10px] uppercase tracking-widest font-bold mb-2 opacity-60">Risk Level</p>
                     <h3 className={`font-serif text-lg md:text-xl font-bold ${result.riskLevel === 'High' ? 'text-red-700' : 'text-green-700'}`}>{result.riskLevel}</h3>
                   </div>
                   <AlertTriangle size={24} className={result.riskLevel === 'High' ? 'text-red-400' : 'text-green-400'} />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                 <div className="bg-white border border-[#e8e0d0] p-6 md:p-8 shadow-sm">
                   <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-4 md:mb-6 italic underline decoration-accent decoration-2 underline-offset-4">Core Discrepancies (Key Facts)</p>
                   <ul className="space-y-3 md:space-y-4">
                     {result.keyFacts?.map((fact: string, i: number) => (
                       <li key={i} className="flex gap-3 md:gap-4 text-xs md:text-sm font-semibold text-primary/80">
                         <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                         {fact}
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div className="bg-white border border-[#e8e0d0] p-6 md:p-8 shadow-sm">
                   <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-4 md:mb-6 italic underline decoration-accent decoration-2 underline-offset-4">Suggested Actions</p>
                   <ul className="space-y-4 md:space-y-5">
                     {result.suggestedActions?.map((action: string, i: number) => (
                       <li key={i} className="flex gap-3 md:gap-4 text-[11px] md:text-xs font-bold leading-relaxed items-start">
                         <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-sm bg-primary text-white flex items-center justify-center text-[10px] sm:text-[11px] shrink-0 font-mono">{i+1}</span>
                         <span className="flex-1">{action}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
              </div>

              <div className="p-6 md:p-8 bg-primary text-white/90 font-serif text-base md:text-lg leading-relaxed shadow-lg border-l-8 border-accent">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-4 font-sans">Risk Assessment</p>
                {result.riskExplanation}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 md:mt-8">
                   <button 
                     onClick={() => setActiveView('rights')}
                     className="flex items-center gap-3 text-xs font-bold text-accent uppercase tracking-widest hover:gap-5 transition-all w-fit cursor-pointer"
                   >
                     View Statutory Protections <ArrowRight size={16} />
                   </button>
                   <button 
                     onClick={handleLearnMore}
                     className="flex items-center gap-3 text-xs font-bold text-white/60 hover:text-white uppercase tracking-widest transition-all w-fit cursor-pointer"
                   >
                     Learn More About Strategy <Info size={16} />
                   </button>
                 </div>
              </div>
            </div>
          )}

          {/* Results View - Rights Engine */}
          {result && activeView === 'rights' && (
            <div ref={resultsRef} className="space-y-8 md:space-y-12">
               {/* Use the rich rights engine UI here */}
               <div className="bg-white border border-[#e8e0d0] p-6 md:p-10 shadow-sm border-t-4 border-accent">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                     <span className="px-3 py-1 bg-accent/10 text-accent font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.1em] border border-accent/20">Statutory Rights Search: Result Found</span>
                     <Scale size={28} className="text-secondary/50 hidden sm:block" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3 md:mb-4">{result.situationSummary}</h2>
                  <div className="text-base md:text-lg italic text-[#6b6560] font-serif leading-relaxed mb-6 md:mb-8">
                    "{result.rightsOverview}"
                  </div>

                  <button 
                     onClick={handleLearnMore}
                     className="mb-6 md:mb-8 flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest hover:underline cursor-pointer"
                   >
                     Learn More About These Rights <Info size={12} />
                   </button>
                  
                  <div className="grid gap-4 mt-8 md:mt-12">
                     <p className="text-[10px] uppercase tracking-[0.3em] text-[#6b6560] font-bold mb-2">Identified Legal Acts</p>
                     {result.laws?.map((law: any) => (
                       <div key={law.id} className="border border-[#e8e0d0] bg-[#fdfaf5]/30">
                          <div className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer" onClick={() => setExpandedLaw(expandedLaw === law.id ? null : law.id)}>
                             <div className="flex items-center gap-4 flex-1">
                               <div className="w-10 h-10 bg-white border border-[#e8e0d0] flex items-center justify-center font-bold text-sm shrink-0">{law.id}</div>
                               <div>
                                 <p className="text-[9px] uppercase font-bold text-accent mb-1 tracking-wider">{law.shortName}</p>
                                 <h4 className="font-serif text-lg md:text-xl font-bold text-primary leading-tight">{law.name}</h4>
                               </div>
                             </div>
                             
                             <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e8e0d0]/50">
                               <div className={`px-2 py-1 text-[8px] font-bold uppercase tracking-tighter border ${law.relevance === 'primary' ? 'bg-accent text-white border-accent' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                  {law.relevance}
                               </div>
                               <ChevronDown size={16} className={`transition-transform duration-300 ${expandedLaw === law.id ? 'rotate-180' : ''}`} />
                             </div>
                          </div>
                          <AnimatePresence>
                            {expandedLaw === law.id && (
                              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-white border-t border-[#e8e0d0]">
                                <div className="p-5 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                                   <div className="md:col-span-8">
                                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-3 md:mb-4">The Protection</p>
                                      <p className="text-base md:text-lg font-serif italic text-primary leading-relaxed border-l-4 border-accent/20 pl-4 md:pl-6 mb-6 md:mb-8">{law.plainExplanation}</p>
                                      <div className="space-y-3">
                                         {law.keyRights?.map((r: string) => (
                                           <div key={r} className="flex gap-3 text-xs font-bold text-primary/70">
                                              <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" /> <span>{r}</span>
                                           </div>
                                         ))}
                                      </div>
                                   </div>
                                   <div className="md:col-span-4 bg-[#fdfaf5] p-5 md:p-6 border border-[#e8e0d0]">
                                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-4">Statute Detail</p>
                                      <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                                         {law.sections?.map((s: string) => <span key={s} className="px-2 py-1 bg-primary text-white text-[9px] font-bold uppercase">{s}</span>)}
                                      </div>
                                      <div className="p-4 bg-white border border-[#e8e0d0]">
                                         <p className="text-[9px] uppercase font-bold text-accent mb-2">Violation Penalty</p>
                                         <p className="text-[11px] font-bold text-primary leading-relaxed italic">{law.penalty}</p>
                                      </div>
                                   </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {result && activeView === 'roadmap' && (
            <div className="lex-result" ref={resultsRef}>
              <ActionRoadmap 
                roadmap={result.actionRoadmap || []} 
                language={result.languageDetected}
                onDraftClick={(type) => {
                  const step = result.actionRoadmap?.find((s: any) => s.actionType === type);
                  handleDraftAction(type, step?.title || "Legal Document");
                }}
              />
            </div>
          )}

          {/* Draft Modal */}
          <AnimatePresence>
            {draftResult && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-primary/40 backdrop-blur-sm"
              >
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-[#fdfaf5] border-2 border-accent w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] mx-4"
                >
                  <div className="p-4 md:p-6 border-b border-[#e8e0d0] flex items-center justify-between bg-white">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-accent font-bold mb-1">AI Document Engine</p>
                      <h2 className="font-serif text-lg md:text-xl font-bold">Legal Document Draft</h2>
                    </div>
                    <button onClick={() => setDraftResult(null)} className="p-2 hover:bg-secondary/40 rounded-full transition-colors cursor-pointer">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 md:p-10 font-serif text-base leading-[1.8] whitespace-pre-wrap bg-white m-3 md:m-4 border border-[#e8e0d0] shadow-inner select-text text-primary/90">
                    {draftResult.replace(/[#*]/g, '')}
                  </div>
                  <div className="p-4 md:p-6 border-t border-[#e8e0d0] flex flex-col sm:flex-row items-center justify-between bg-secondary/10 gap-4">
                    <p className="text-[11px] text-muted-foreground italic text-center sm:text-left max-w-xs">
                      This is an AI-generated draft. Please review carefully with a lawyer before sending.
                    </p>
                    <div className="flex gap-4 w-full sm:w-auto justify-center">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(draftResult);
                          alert("Copied to clipboard!");
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-primary text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer"
                      >
                        <Copy size={14} /> Copy Draft
                      </button>
                      <button onClick={() => window.print()} className="px-4 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 shadow-lg cursor-pointer">
                        Print Draft
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drafting Loader */}
          <AnimatePresence>
            {isDrafting && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-20 right-6 md:bottom-10 md:right-10 z-[110] bg-white border-2 border-accent p-5 md:p-6 shadow-2xl flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-accent">AI Drafting...</p>
                  <p className="text-xs font-bold font-serif">Generating Legal Verbiage</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

           {/* Explanation Modal */}
          <AnimatePresence>
            {detailedExplanation && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-primary/40 backdrop-blur-sm"
              >
                <motion.div 
                   initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                   className="bg-white border-2 border-accent w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] mx-4"
                >
                  <div className="p-4 md:p-6 border-b border-[#e8e0d0] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-accent font-bold mb-1">Detailed Legal Guidance</p>
                      <h2 className="font-serif text-lg md:text-xl font-bold">Deep-Dive Explanation</h2>
                    </div>
                    <button onClick={() => setDetailedExplanation(null)} className="p-2 hover:bg-secondary/40 rounded-full transition-colors cursor-pointer">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 md:p-10 font-serif text-base leading-[1.8] whitespace-pre-wrap select-text text-primary/80">
                    {detailedExplanation}
                  </div>
                  <div className="p-4 md:p-6 border-t border-[#e8e0d0] flex justify-end bg-secondary/10">
                    <button onClick={() => setDetailedExplanation(null)} className="w-full sm:w-auto px-6 py-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 cursor-pointer text-center">
                      Close Guidance
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explanation Loader */}
          <AnimatePresence>
            {isExplaining && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[120] bg-white border-2 border-accent p-6 md:p-8 shadow-2xl text-center"
              >
                <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-accent">Calling Legal Expert AI...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 md:p-6 flex items-center gap-4 mt-6 md:mt-8">
              <AlertTriangle className="text-red-600 font-bold shrink-0" />
              <p className="text-sm text-red-600 font-bold">{error}</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );



}
