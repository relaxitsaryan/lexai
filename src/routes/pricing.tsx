import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Layout, Section, Eyebrow } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { PRICING_TIERS, PAY_PER_DOC, B2B } from "@/lib/lex-data";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ApnaNyaya" },
      { name: "description", content: "Free for citizens. Pro from ₹299/month. Pay-per-document from ₹49. B2B and API plans for HR, startups, NGOs and developers." },
      { property: "og:title", content: "Pricing — ApnaNyaya" },
      { property: "og:description", content: "Affordable legal intelligence — freemium, pay-per-document, B2B and API." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <Layout>
      <Section className="pt-24 pb-12 lg:pt-32">
        <Reveal>
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="mt-6 font-serif text-5xl md:text-7xl text-primary leading-[1] tracking-tight max-w-4xl">
            Affordable, by <em className="italic text-accent">design.</em>
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Legal help that costs a coffee, not a consultation. Free forever for individuals, with Pro and pay-per-document for anyone who needs to act.
          </p>
        </Reveal>
      </Section>

      <Section className="py-16">
        <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
          {PRICING_TIERS.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 0.08}
              className={`p-10 flex flex-col ${t.accent ? "bg-primary text-primary-foreground" : "bg-background"}`}
            >
              <p className={`text-xs uppercase tracking-[0.22em] ${t.accent ? "text-accent" : "text-primary/70"}`}>
                {t.name}
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-serif text-6xl num-mono">{t.price}</span>
                <span className={`text-sm ${t.accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {t.cadence}
                </span>
              </div>
              <p className={`mt-4 text-sm ${t.accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {t.desc}
              </p>
              <ul className="mt-8 space-y-3 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-10 inline-flex items-center justify-center px-5 py-3 text-sm transition-colors ${
                  t.accent
                    ? "bg-accent text-accent-foreground hover:opacity-90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {t.cta}
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-24">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Pay-per-document</Eyebrow>
              <h2 className="mt-6 font-serif text-4xl text-primary leading-tight">
                One urgent problem? Pay only for what you need.
              </h2>
              <p className="mt-5 text-muted-foreground max-w-md leading-relaxed">
                No subscription. Court-standard documents drafted in minutes — the same documents lawyers charge thousands for.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.1} className="border border-border">
              {PAY_PER_DOC.map(([doc, price], i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 border-b border-border last:border-0 hover:bg-secondary/40 transition-colors"
                >
                  <span className="text-sm text-foreground">{doc}</span>
                  <span className="font-serif text-xl text-primary num-mono">{price}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </Section>

      <Section className="py-24">
        <Reveal>
          <Eyebrow>B2B & Enterprise</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl text-primary leading-tight max-w-3xl">
            White-label ApnaNyaya for HR teams, startups, NGOs and co-working spaces.
          </h2>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-2 gap-px bg-border border border-border">
          {B2B.map((b, i) => (
            <Reveal key={b.who} delay={i * 0.06} className="bg-background p-8">
              <p className="font-serif text-2xl text-primary">{b.who}</p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{b.what}</p>
              <p className="mt-6 text-xs uppercase tracking-[0.18em] text-accent num-mono">{b.price}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-24">
        <Reveal>
          <div className="border border-border bg-secondary/30 p-10 md:p-14 flex flex-col md:flex-row gap-8 md:items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary/70">Developer API</p>
              <h3 className="mt-3 font-serif text-3xl text-primary leading-tight max-w-xl">
                Embed legal intelligence into your product.
              </h3>
              <p className="mt-3 text-sm text-muted-foreground max-w-lg">
                Free tier for builders. Paid tiers for LegalTech startups, civic-tech NGOs and HR software — usage-based.
              </p>
            </div>
            <Link to="/contact" className="bg-primary text-primary-foreground px-6 py-3.5 text-sm hover:bg-primary/90 transition-colors w-fit">
              Request API access
            </Link>
          </div>
        </Reveal>
      </Section>
    </Layout>
  );
}