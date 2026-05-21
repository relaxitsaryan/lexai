import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Layout, Section, Eyebrow } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { FEATURES } from "@/lib/lex-data";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — ApnaNyaya" },
      { name: "description", content: "Situation Analyzer, Document Generator, Contract Scanner, Action Roadmap, Multilingual chat, Lawyer marketplace and a Deadline tracker — the full ApnaNyaya platform." },
      { property: "og:title", content: "Features — ApnaNyaya" },
      { property: "og:description", content: "Eight features that take a real-life problem and convert it into action — in minutes." },
    ],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <Layout>
      <Section className="pt-24 pb-12 lg:pt-32">
        <Reveal>
          <Eyebrow>The Platform</Eyebrow>
          <h1 className="mt-6 font-serif text-5xl md:text-7xl text-primary leading-[1] tracking-tight max-w-4xl">
            Eight features. <em className="italic text-accent">One promise.</em>
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            ApnaNyaya is not a chatbot. It is a full-stack legal intelligence platform that takes a real-life situation and converts it into action — instantly, in your language.
          </p>
        </Reveal>
      </Section>

      <Section className="py-16">
        <div className="border-t border-border">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            const reverse = i % 2 === 1;
            return (
              <Reveal key={f.n}>
                <div
                  className={`grid lg:grid-cols-12 gap-10 py-16 border-b border-border ${
                    reverse ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="lg:col-span-5">
                    <div className="flex items-baseline gap-4">
                      <span className="font-serif text-5xl text-accent num-mono">{f.n}</span>
                      <Icon size={22} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <h2 className="mt-6 font-serif text-3xl md:text-4xl text-primary leading-tight">
                      {f.title}
                    </h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed">{f.short}</p>
                  </div>
                  <div className="lg:col-span-7 lg:pl-10 lg:border-l lg:border-border">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary/70 mb-5">
                      What's inside
                    </p>
                    <ul className="space-y-4">
                      {f.bullets.map((b, k) => (
                        <li key={k} className="flex gap-4 text-foreground/85">
                          <span className="num-mono text-xs text-muted-foreground pt-1">
                            {String(k + 1).padStart(2, "0")}
                          </span>
                          <span className="leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                    {"example" in f && f.example && (
                      <div className="mt-8 border-l-2 border-accent pl-5 py-1">
                        <p className="font-serif italic text-lg text-foreground">"{f.example}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section className="py-16">
        <Reveal>
          <div className="border border-border p-10 md:p-16 flex flex-col md:flex-row gap-8 md:items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-primary max-w-xl leading-tight">
                Ready to see what your rights look like?
              </h2>
              <p className="mt-4 text-muted-foreground max-w-lg">
                Pick a plan that fits — free forever for citizens, or Pro for unlimited use.
              </p>
            </div>
            {/* <Link
              to="/pricing"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-sm hover:bg-primary/90 transition-colors w-fit"
            >
              View pricing
              <ArrowRight size={16} />
            </Link> */}
          </div>
        </Reveal>
      </Section>
    </Layout>
  );
}