import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, X, Minus, Bot } from "lucide-react";
import { Layout, Section, Eyebrow } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { FEATURES, STATS, BARRIERS, USERS, COMPETITORS } from "@/lib/lex-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LexAI — Legal Intelligence for Every Indian" },
      { name: "description", content: "Describe your legal problem in plain Hindi or English. LexAI tells you your rights, generates real documents, and gives you a step-by-step action plan — in under 3 minutes." },
      { property: "og:title", content: "LexAI — Legal Intelligence for Every Indian" },
      { property: "og:description", content: "Know your rights, generate court-standard documents, and act — in minutes, in your language." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <Layout>
      <Hero />
      <Marquee />
      <Stats />
      <Problem />
      <FeaturesPreview />
      <Users />
      <Compare />
      <CTA />
      <ChatBotFAB />
    </Layout>
  );
}

function ChatBotFAB() {
  return (
    <Link
      to="/analyzer"
      className="fixed bottom-8 right-8 z-[60] flex items-center flex-row-reverse gap-3 group"
    >
      <div className="bg-primary text-primary-foreground p-4 shadow-2xl hover:bg-accent hover:text-accent-foreground transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
        <Bot size={28} />
      </div>
      <div className="hidden md:block bg-background border border-border px-4 py-2 text-[10px] uppercase tracking-widest text-primary shadow-xl font-medium opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
        Situation Analyzer
      </div>
    </Link>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/hero.png"
          alt="Legal background"
          className="w-full h-full object-cover "
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background/60" />
      </div>

      {/* Grain Texture */}
      <div className="grain absolute inset-0 opacity-40 pointer-events-none" />

      <Section className="relative z-10 pt-24 pb-28 lg:pt-36 lg:pb-40">
        <div className="mt-8 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <Reveal delay={0.05}>
              <h1 className="font-serif text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] text-primary tracking-tight">
                Legal intelligence
                <br />
                for every Indian <em className="italic text-accent"></em>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 text-lg md:text-xl text-primary max-w-2xl leading-relaxed">
                Describe your problem in plain Hindi or English. LexAI tells you your rights, generates real documents, and gives you a step-by-step action plan — in under three minutes.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/features"
                  className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-sm hover:bg-primary/90 transition-colors"
                >
                  Explore the platform
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 border border-primary/30 text-primary px-6 py-3.5 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  See pricing
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Reveal delay={0.35}>
              <div className="border border-border bg-background/50 backdrop-blur-sm p-6 relative">
                <div className="absolute -top-3 left-6 px-3 bg-background/80 backdrop-blur-sm border border-border text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Live example
                </div>
                <p className="text-sm text-muted-foreground">User typed</p>
                <p className="mt-1 font-serif text-xl leading-snug text-foreground">
                  "My employer hasn't paid me for 2 months."
                </p>
                <div className="rule my-5" />
                <p className="text-xs uppercase tracking-[0.18em] text-accent">LexAI classified</p>
                <ul className="mt-3 space-y-2 text-sm text-foreground">
                  <li>· Labour Law</li>
                  <li>· Payment of Wages Act 1936</li>
                  <li>· Industrial Disputes Act</li>
                </ul>
                <div className="rule my-5" />
                <p className="text-xs uppercase tracking-[0.18em] text-primary/70">Next step</p>
                <p className="mt-2 text-sm text-foreground">
                  Generate a legal notice to your employer — give them 15 days to respond.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </section>
  );
}

function Marquee() {
  const items = [
    "Payment of Wages Act",
    "Consumer Protection Act 2019",
    "RTI Act 2005",
    "IT Act 2000",
    "DPDPA 2023",
    "Rent Control Acts",
    "Companies Act",
    "BNSS",
    "Domestic Violence Act",
    "POCSO",
    "Specific Relief Act",
    "Contract Act",
  ];
  return (
    <div className="border-y border-border bg-secondary/40 overflow-hidden">
      <motion.div
        className="flex gap-12 py-5 whitespace-nowrap text-xs uppercase tracking-[0.22em] text-primary/70"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t}
            <span className="text-accent">§</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Stats() {
  return (
    <Section className="py-24">
      <div className="grid md:grid-cols-4 gap-px bg-border border border-border">
        {STATS.map((s, i) => (
          <Reveal key={s.k} delay={i * 0.08} className="bg-background p-8">
            <p className="font-serif text-5xl text-primary num-mono">{s.v}</p>
            <p className="mt-3 text-sm text-muted-foreground">{s.k}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Problem() {
  return (
    <Section className="py-28">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>01 — The Problem</Eyebrow>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl text-primary leading-tight">
              India has a massive legal-access gap.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              1.4 billion people. 1.7 million lawyers. Legal help is out of reach for most citizens — not because they don't need it, but because the system is built to exclude them.
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <div className="border-t border-border">
            {BARRIERS.map((b, i) => (
              <Reveal key={b.t} delay={i * 0.06}>
                <div className="grid grid-cols-12 py-6 border-b border-border group">
                  <div className="col-span-1 text-xs text-muted-foreground num-mono pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="col-span-3 font-serif text-2xl text-primary">{b.t}</div>
                  <div className="col-span-8 text-sm text-muted-foreground leading-relaxed">
                    {b.d}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function FeaturesPreview() {
  return (
    <Section className="py-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <Reveal>
          <Eyebrow>02 — The Platform</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl md:text-5xl text-primary max-w-2xl leading-tight">
            Eight features. One promise — from problem to action, instantly.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Link to="/features" className="text-sm text-primary inline-flex items-center gap-2 group">
            View all features
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <Reveal
              key={f.n}
              delay={(i % 4) * 0.06}
              className="bg-background p-7 hover:bg-secondary/40 transition-colors group min-h-[260px] flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs num-mono text-muted-foreground">{f.n}</span>
                <Icon size={20} className="text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="mt-8 font-serif text-2xl text-primary leading-snug">{f.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                {f.short}
              </p>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function Users() {
  return (
    <Section className="py-28">
      <Reveal>
        <Eyebrow>03 — Who Uses LexAI</Eyebrow>
        <h2 className="mt-6 font-serif text-4xl md:text-5xl text-primary max-w-3xl leading-tight">
          Built not for enterprises — for every Indian who has ever faced a legal problem.
        </h2>
      </Reveal>
      <div className="mt-14 border-t border-border">
        {USERS.map((u, i) => (
          <Reveal key={u.who} delay={(i % 4) * 0.04}>
            <div className="grid grid-cols-12 gap-6 py-6 border-b border-border items-start hover:bg-secondary/30 transition-colors px-2 -mx-2">
              <div className="col-span-12 md:col-span-3 font-serif text-xl text-primary">{u.who}</div>
              <div className="col-span-12 md:col-span-5 text-sm text-muted-foreground">{u.problem}</div>
              <div className="col-span-12 md:col-span-4 text-sm text-foreground/80">{u.help}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Compare() {
  const cols = [
    ["LexAI", "lex"],
    ["VakilSearch", "vakil"],
    ["LawRato", "lawrato"],
    ["DocOnline", "doconline"],
    ["ChatGPT", "chatgpt"],
  ] as const;

  const cell = (v: boolean | "partial") =>
    v === true ? (
      <Check size={16} className="text-accent" />
    ) : v === "partial" ? (
      <Minus size={16} className="text-muted-foreground" />
    ) : (
      <X size={16} className="text-muted-foreground/40" />
    );

  return (
    <Section className="py-28">
      <Reveal>
        <Eyebrow>04 — The Landscape</Eyebrow>
        <h2 className="mt-6 font-serif text-4xl md:text-5xl text-primary max-w-3xl leading-tight">
          Honestly, here's how we compare.
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-14 border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              <th className="text-left p-4 font-medium text-primary">Capability</th>
              {cols.map(([label]) => (
                <th key={label} className="p-4 font-medium text-primary text-center">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPETITORS.map((row) => (
              <tr key={row.feature} className="border-b border-border last:border-0">
                <td className="p-4 text-foreground/80">{row.feature}</td>
                {cols.map(([, key]) => (
                  <td key={key} className="p-4">
                    <div className="flex justify-center">{cell(row[key as keyof typeof row] as boolean | "partial")}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </Section>
  );
}

function CTA() {
  return (
    <Section className="py-28">
      <Reveal>
        <div className="bg-primary text-primary-foreground p-12 md:p-20 relative overflow-hidden">
          <div className="grain absolute inset-0 opacity-20" />
          <div className="relative max-w-3xl">
            <Eyebrow>
              <span className="text-primary-foreground/80">Get started</span>
            </Eyebrow>
            <h2 className="mt-6 font-serif text-4xl md:text-6xl leading-[1.02]">
              Justice should not require a lawyer to <em className="italic text-accent">begin.</em>
            </h2>
            <p className="mt-6 text-primary-foreground/75 max-w-xl">
              Join the waitlist for the LexAI public beta. Free forever for citizens, with affordable Pro and pay-per-document options.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/contact" className="bg-accent text-accent-foreground px-6 py-3.5 text-sm hover:opacity-90 transition-opacity">
                Get early access
              </Link>
              <Link to="/pricing" className="border border-primary-foreground/30 text-primary-foreground px-6 py-3.5 text-sm hover:bg-primary-foreground hover:text-primary transition-colors">
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
