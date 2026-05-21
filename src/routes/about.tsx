import { createFileRoute } from "@tanstack/react-router";
import { Layout, Section, Eyebrow } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { ROADMAP, TEAM } from "@/lib/lex-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ApnaNyaya" },
      { name: "description", content: "ApnaNyaya is a legal aid platform for every Indian. Know your rights, generate documents, and act — in minutes, in your language." },
      { property: "og:title", content: "About — ApnaNyaya" },
      { property: "og:description", content: "ApnaNyaya is a legal aid platform for every Indian. Know your rights, generate documents, and act — in minutes, in your language." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <Section className="pt-24 pb-16 lg:pt-32">
        <Reveal>
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-6 font-serif text-5xl md:text-7xl text-primary leading-[1] tracking-tight max-w-4xl">
            We're building the legal layer for <em className="italic text-accent">a billion people.</em>
          </h1>
        </Reveal>
        <div className="mt-12 grid lg:grid-cols-2 gap-10">
          <Reveal delay={0.1}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              India's legal system was built for a small minority that can navigate it. ApnaNyaya is built for everyone else — the farmer, the student, the gig worker, the tenant, the founder, the citizen.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We combine a verified Indian legal corpus, retrieval-augmented AI, and a court-standard document engine into one product. The result is justice that begins with a sentence, not a retainer.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section className="py-24">
        <Reveal>
          <Eyebrow>Roadmap</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl md:text-5xl text-primary leading-tight max-w-3xl">
            From hackathon to startup.
          </h2>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
          {ROADMAP.map((p, i) => (
            <Reveal key={p.phase} delay={i * 0.08} className="bg-background p-8 flex flex-col min-h-[320px]">
              <p className="text-xs uppercase tracking-[0.2em] text-accent num-mono">{p.phase}</p>
              <h3 className="mt-4 font-serif text-2xl text-primary">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.when}</p>
              <ul className="mt-6 space-y-2 text-sm text-foreground/85 flex-1">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span className="text-accent">·</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-24">
        <Reveal>
          <Eyebrow>Team</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl md:text-5xl text-primary leading-tight max-w-3xl">
            Three people. Exactly the combination needed.
          </h2>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-3 gap-px bg-border border border-border">
          {TEAM.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="bg-background p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-primary/70 num-mono">0{i + 1}</p>
              <p className="mt-4 font-serif text-2xl text-primary">{t.name}</p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.role}</p>
            </Reveal>
          ))}
        </div>
      </Section>
    </Layout>
  );
}