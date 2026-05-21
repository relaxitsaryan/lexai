import { useState } from "react";
import { CheckCircle2, Circle, Clock, MapPin, FileText, Download, MessageSquare, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

export interface RoadmapStep {
  step: number;
  title: string;
  authority: string;
  howTo: string;
  timeline: string;
  deadline: string;
  documents: string[];
  actionType: "draft_notice" | "file_complaint" | "consult_lawyer" | "other";
}

interface ActionRoadmapProps {
  roadmap: RoadmapStep[];
  onDraftClick?: (actionType: string) => void;
  language?: string;
}

export function ActionRoadmap({ roadmap, onDraftClick, language = "English" }: ActionRoadmapProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev.filter((s) => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const progress = Math.round((completedSteps.length / roadmap.length) * 100);

  const getPortalLink = (domain: string) => {
    const d = domain.toLowerCase();
    if (d.includes("labour") || d.includes("wage") || d.includes("salary") || d.includes("employment")) {
      return "https://samadhan.labour.gov.in/";
    }
    if (d.includes("consumer") || d.includes("product") || d.includes("fraud") || d.includes("refund")) {
      return "https://consumerhelpline.gov.in/";
    }
    if (d.includes("cyber") || d.includes("online") || d.includes("it act")) {
      return "https://cybercrime.gov.in/";
    }
    if (d.includes("rti")) {
      return "https://rtionline.gov.in/";
    }
    return "https://www.digitalindia.gov.in/services";
  };

  return (
    <div className="space-y-8 pb-20 roadmap-container">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .roadmap-container, .roadmap-container * { visibility: visible; }
          .roadmap-container { position: absolute; left: 0; top: 0; width: 100%; border: none !important; }
          header, aside, .no-print, button, .footer-actions { display: none !important; }
          .roadmap-step-content { display: block !important; height: auto !important; opacity: 1 !important; }
          .bg-primary { background-color: #1a1f2e !important; color: white !important; -webkit-print-color-adjust: exact; }
          .bg-accent { background-color: #b5892f !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>
      
      {/* Progress Header */}
      <div className="bg-primary text-white p-8 shadow-lg relative overflow-hidden border-b-4 border-accent">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Clock size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-2">Progress Overview</p>
            <h2 className="font-serif text-3xl font-bold">Action Roadmap</h2>
            <p className="mt-2 text-white/70 text-sm max-w-md">
              Follow these steps to resolve your legal situation. Mark them as completed to track your journey toward justice.
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-serif font-bold text-accent">{progress}%</div>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Completion Rate</p>
          </div>
        </div>
        <div className="mt-8 h-1.5 bg-white/10 rounded-full overflow-hidden no-print">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Roadmap Steps */}
      <div className="space-y-6">
        {roadmap.map((step, index) => {
          const isCompleted = completedSteps.includes(step.step);
          
          return (
            <div 
              key={step.step}
              className={`bg-white border transition-all duration-300 relative
                ${isCompleted ? "border-emerald-200 shadow-sm opacity-80" : "border-[#e8e0d0] shadow-md hover:border-accent/40"}
              `}
            >
              {/* Step indicator line */}
              {index !== roadmap.length - 1 && (
                <div className="absolute left-[39px] top-[80px] bottom-[-24px] w-0.5 bg-[#e8e0d0] z-0 no-print" />
              )}

              <div className="p-6 md:p-8 flex items-start gap-6 relative z-10">
                {/* Checkbox / Number */}
                <button 
                  onClick={() => toggleStep(step.step)}
                  className={`w-10 h-10 shrink-0 border-2 flex items-center justify-center transition-all no-print
                    ${isCompleted 
                      ? "bg-emerald-500 border-emerald-500 text-white" 
                      : "bg-white border-[#e8e0d0] text-primary hover:border-accent"}
                  `}
                >
                  {isCompleted ? <CheckCircle2 size={24} /> : <span className="font-serif font-bold text-lg">{step.step}</span>}
                </button>
                {/* Print version of step number */}
                <div className="w-10 h-10 hidden print:flex shrink-0 border-2 border-primary items-center justify-center">
                   <span className="font-serif font-bold text-lg">{step.step}</span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className={`font-serif text-2xl font-bold transition-all ${isCompleted ? "text-emerald-700 line-through opacity-60" : "text-primary"}`}>
                        {step.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-accent">
                          <Clock size={12} /> {step.timeline}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-primary/60">
                          <MapPin size={12} /> {step.authority}
                        </span>
                      </div>
                    </div>
                    {isCompleted && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 border border-emerald-200 no-print">
                        Completed
                      </span>
                    )}
                  </div>

                  <div className={`roadmap-step-content ${!isCompleted ? "block" : "hidden print:block"}`}>
                    <motion.div 
                      initial={false}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-6 pt-4 border-t border-[#f0eee9]"
                    >
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-3 tracking-widest">How to Approach</p>
                          <div className="p-4 bg-secondary/30 border border-[#e8e0d0] text-base leading-relaxed italic">
                            {step.howTo}
                          </div>
                          <p className="mt-4 text-[10px] uppercase font-bold text-muted-foreground mb-3 tracking-widest">Documents Needed</p>
                          <ul className="space-y-2">
                            {step.documents.map((doc, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm font-semibold text-primary/80">
                                <FileText size={14} className="mt-0.5 text-accent shrink-0" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-3 tracking-widest">Deadline Alert</p>
                            <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm font-bold leading-relaxed">
                              {step.deadline}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 no-print">
                            <button 
                              onClick={() => onDraftClick?.(step.actionType)}
                              className="w-full flex items-center justify-between px-5 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/95 transition-all"
                            >
                              Draft Necessary Document
                              <ArrowRight size={14} />
                            </button>
                            <a 
                              href={getPortalLink(step.authority)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-between px-5 py-3 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest hover:bg-secondary/40 transition-all cursor-pointer shadow-sm"
                            >
                              Official {step.authority.split(' ').slice(-1)} Portal
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap gap-4 pt-8 footer-actions">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 border border-primary text-primary text-sm font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-md group"
        >
          <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> Download Action Plan PDF
        </button>
        <Link 
          to="/contact"
          className="flex items-center gap-2 px-6 py-3 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest hover:bg-secondary/40 transition-all shadow-sm"
        >
          <MessageSquare size={16} /> I'm stuck on a step
        </Link>
      </div>
    </div>
  );
}
