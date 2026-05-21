import {
  Scale,
  ShieldCheck,
  FileText,
  Route as RouteIcon,
  ScanLine,
  Languages,
  Users,
  CalendarClock,
} from "lucide-react";

export const FEATURES = [
  {
    n: "01",
    icon: Scale,
    title: "Situation Analyzer",
    short: "Describe your problem in Hindi, English or Hinglish. We classify the legal domain and surface the right laws instantly.",
    bullets: [
      "RAG over a verified Indian legal corpus",
      "Auto-classifies: labour, consumer, cyber, family, property and more",
      "Identifies key facts, parties and what is at stake",
    ],
    example: '"My employer has not paid me for 2 months." → Labour Law · Payment of Wages Act 1936 · Industrial Disputes Act',
  },
  {
    n: "02",
    icon: ShieldCheck,
    title: "Know Your Rights Engine",
    short: "Exactly which laws protect you, explained in plain, friendly language — no jargon, no legalese.",
    bullets: [
      "IPC, BNSS, CrPC for criminal matters",
      "Consumer Protection Act 2019, Labour Codes, RTI Act, IT Act, DPDPA",
      "Each law: what it says → what it means → what you can do",
    ],
  },
  {
    n: "03",
    icon: FileText,
    title: "Document Generator",
    short: "Court-standard legal notices, RTIs, FIRs, NDAs, consumer complaints and more — generated in minutes.",
    bullets: [
      "Legal notices to employers, landlords, providers",
      "RTI applications, FIR drafts, cybercrime complaints",
      "NDAs, rental agreements, offer letters, affidavits",
    ],
    example: "Lawyers charge ₹2,000–10,000 per document. ApnaNyaya does it for ₹49–499.",
  },
  {
    n: "04",
    icon: RouteIcon,
    title: "Action Roadmap",
    short: "A clear, numbered, step-by-step plan — not vague advice. Real authorities, real timelines.",
    bullets: [
      "Specific authority addresses and portals",
      "Statutory timelines and entitlements (e.g. 10× compensation)",
      "Tells you honestly whether you need a lawyer",
    ],
  },
  {
    n: "05",
    icon: ScanLine,
    title: "Contract & Document Scanner",
    short: "Upload any contract. We flag unfair clauses, missing protections and illegal terms with a traffic-light rating.",
    bullets: [
      "Detects one-sided clauses, hidden financial risk, IP issues",
      "Highlights missing protections (notice period, indemnity)",
      "Traffic-light report: Safe · Caution · Red Flag",
    ],
  },
  {
    n: "06",
    icon: Languages,
    title: "Multilingual Voice & Chat",
    short: "Speak or type in Hindi, English, Hinglish and regional languages. Justice should not require fluency.",
    bullets: [
      "Voice-first for low-literacy users",
      "Indian language support across the stack",
      "Output documents in your preferred language",
    ],
  },
  {
    n: "07",
    icon: Users,
    title: "Verified Lawyer Marketplace",
    short: "When you need a human, connect with a verified, specialised lawyer near you — transparent pricing, no surprises.",
    bullets: [
      "Specialisation, location and language filters",
      "Fixed-fee consultations from ₹299",
      "ApnaNyaya handles the brief so the lawyer is ready",
    ],
  },
  {
    n: "08",
    icon: CalendarClock,
    title: "Case & Deadline Tracker",
    short: "Legal matters have strict timelines. One missed deadline can destroy a case. We keep you on track.",
    bullets: [
      "Notice response and consumer-filing windows",
      "Follow-up nudges on sent notices",
      "GST, ROC and compliance reminders for businesses",
    ],
  },
] as const;

export const USERS = [
  { who: "Farmers & Rural Citizens", problem: "Illegal land acquisition, pension disputes, scams", help: "Land Acquisition Act rights, complaint drafting, authority contacts" },
  { who: "Students", problem: "Harassment, ragging, fee disputes, hostel issues", help: "UGC rules, complaint mechanisms, anti-ragging filings" },
  { who: "Gig & Salaried Workers", problem: "Unpaid wages, illegal termination, harassment at work", help: "Payment of Wages Act, Labour Court process, notices ready to send" },
  { who: "Tenants & Landlords", problem: "Illegal eviction, deposit refusal, rent disputes", help: "Rent Control Acts, legal notices, rental agreement drafting" },
  { who: "Small Business & Founders", problem: "Vendor disputes, investor terms, contracts", help: "Contract review, NDAs, term-sheet flagging, compliance" },
  { who: "Consumers", problem: "Defective products, refused refunds, service fraud", help: "Consumer Protection Act 2019, District Forum complaints" },
  { who: "Women & Senior Citizens", problem: "Domestic violence, maintenance, property fraud", help: "DV Act, Maintenance Act, police-complaint drafting" },
  { who: "Anyone Online", problem: "Cyber fraud, hacking, morphed images, defamation", help: "IT Act & DPDPA, cybercrime complaint, takedown requests" },
];

export const COMPETITORS = [
  { feature: "Built for every Indian, not just enterprises", lex: true, vakil: false, lawrato: false, doconline: false, chatgpt: "partial" },
  { feature: "Voice + Hindi + regional languages", lex: true, vakil: false, lawrato: false, doconline: false, chatgpt: "partial" },
  { feature: "Court-standard document generation", lex: true, vakil: "partial", lawrato: false, doconline: true, chatgpt: false },
  { feature: "Contract scanning with red-flag report", lex: true, vakil: false, lawrato: false, doconline: false, chatgpt: "partial" },
  { feature: "Step-by-step action roadmap", lex: true, vakil: false, lawrato: false, doconline: false, chatgpt: false },
  { feature: "Case & deadline tracker", lex: true, vakil: false, lawrato: false, doconline: false, chatgpt: false },
  { feature: "Verified lawyer marketplace", lex: true, vakil: true, lawrato: true, doconline: false, chatgpt: false },
];

export const PRICING_TIERS = [
  {
    name: "Free",
    price: "₹0",
    cadence: "forever",
    desc: "Know your rights, in your language.",
    features: [
      "3 situation analyses / month",
      "Plain-language law explainers",
      "Action roadmap (basic)",
      "Hindi · English · Hinglish",
    ],
    cta: "Start free",
    accent: false,
  },
  {
    name: "Pro Monthly",
    price: "₹299",
    cadence: "/ month",
    desc: "For anyone who wants to actually take action.",
    features: [
      "Unlimited situation analyses",
      "Unlimited document generation",
      "Contract & document scanner",
      "Case & deadline tracker",
      "Priority support",
    ],
    cta: "Go Pro",
    accent: true,
  },
  {
    name: "Pro Annual",
    price: "₹2,499",
    cadence: "/ year",
    desc: "Everything in Pro — save 30%.",
    features: [
      "All Pro features",
      "30% saving vs monthly",
      "Early access to new features",
      "Lawyer-consultation credits",
    ],
    cta: "Save 30%",
    accent: false,
  },
];

export const PAY_PER_DOC = [
  ["Legal notice (employer / landlord / service)", "₹99"],
  ["RTI application", "₹49"],
  ["Consumer-court complaint", "₹199"],
  ["FIR / cybercrime complaint draft", "₹99"],
  ["NDA / freelance contract", "₹149"],
  ["Rental / leave & licence agreement", "₹249"],
  ["Investor term-sheet review", "₹499"],
  ["Affidavit / declaration", "₹49"],
] as const;

export const B2B = [
  { who: "HR & People Teams", what: "Employee legal helpdesk, policy review, contract templates", price: "₹60,000–1,20,000 / yr" },
  { who: "Startups & Accelerators", what: "Founder legal toolkit, term-sheet reviews, compliance tracker", price: "₹36,000–96,000 / yr" },
  { who: "NGOs & Civic Tech", what: "White-labelled legal-aid portal for beneficiaries", price: "₹24,000–60,000 / yr" },
  { who: "Co-working Spaces", what: "Member-benefit legal help, startup tools", price: "₹18,000–36,000 / yr" },
];

export const ROADMAP = [
  { phase: "Phase 0", title: "Hackathon MVP", when: "24 hours", points: ["Situation Analyzer + RAG", "Document generator (3 templates)", "Hindi + English UI"] },
  { phase: "Phase 1", title: "Public Beta", when: "Months 1–3", points: ["All 8 core features live", "10,000 early users", "Pay-per-document live", "Pro subscription launch"] },
  { phase: "Phase 2", title: "Scale", when: "Months 4–9", points: ["Lawyer marketplace live", "B2B pilots with 10 partners", "Regional languages added", "50,000 users"] },
  { phase: "Phase 3", title: "Series A", when: "Year 2", points: ["100,000+ registered users", "50+ B2B clients", "API for third-party developers", "Series A — ₹5–10 Cr"] },
];

export const TEAM = [
  { name: "Product & AI Lead", role: "Owns the legal AI engine, RAG pipeline and product UX." },
  { name: "Engineering Lead", role: "Full-stack platform, scalable backend, deployment and infra." },
  { name: "Legal & GTM Lead", role: "Legal corpus curation, lawyer partnerships and go-to-market." },
];

export const STATS = [
  { v: "1.4B", k: "Population of India" },
  { v: "1.7M", k: "Registered lawyers" },
  { v: "₹35,000 Cr+", k: "Legal services market" },
  { v: "< 3 min", k: "From problem to action plan" },
];

export const BARRIERS = [
  { t: "Cost", d: "A basic consultation costs ₹1,000–5,000. Most Indians cannot afford repeated visits." },
  { t: "Language", d: "Laws are written in English legalese. Most Indians speak Hindi or regional languages." },
  { t: "Awareness", d: "People don't know which law applies or which authority to approach." },
  { t: "Geography", d: "Good lawyers cluster in metros. Rural India has almost no access." },
  { t: "Fear", d: "Courts feel intimidating. Most people avoid legal action even when clearly in the right." },
];