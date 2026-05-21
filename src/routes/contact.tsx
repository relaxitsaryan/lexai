import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, Section, Eyebrow } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { Check } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ApnaNyaya" },
      { name: "description", content: "Get early access to ApnaNyaya, partner with us, or request the developer API." },
      { property: "og:title", content: "Contact — ApnaNyaya" },
      { property: "og:description", content: "Reach the ApnaNyaya team — early access, partnerships and API." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <Layout>
      <Section className="pt-24 pb-12 lg:pt-32">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-6 font-serif text-5xl md:text-7xl text-primary leading-[1] tracking-tight max-w-4xl">
            Let's talk about <em className="italic text-accent">access.</em>
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Join the waitlist, partner with us, or request API access. We read every message.
          </p>
        </Reveal>
      </Section>

      <Section className="py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-5 space-y-10">
            <Block label="Early access" body="Be among the first 1,000 users when the public beta launches. Free forever." />
            <Block label="Partnerships" body="HR teams, startups, NGOs and co-working spaces — white-label ApnaNyaya for your community." />
            <Block label="API" body="Building a legal-adjacent product? Embed ApnaNyaya's retrieval and document engine." />
            <Block label="Press & speaking" body="Hackathons, panels, podcasts — we'd love to talk about access to justice." />
            <div className="rule" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary/70 mb-2">Direct</p>
              <a href="mailto:hello@apnanyaya.in" className="font-serif text-2xl text-primary hover:text-accent transition-colors">
                hello@apnanyaya.in
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-7">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="border border-border p-8 md:p-10 bg-card space-y-6"
            >
              <Field label="Your name" type="text" name="name" required />
              <Field label="Email" type="email" name="email" required />
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-primary/70 mb-2">I'm here for</label>
                <select
                  required
                  className="w-full bg-transparent border-b border-input pb-2 text-foreground focus:outline-none focus:border-primary"
                >
                  <option>Early access (waitlist)</option>
                  <option>Partnership (HR / NGO / startup)</option>
                  <option>API access</option>
                  <option>Press / Speaking</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-primary/70 mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full bg-transparent border border-input p-3 text-foreground focus:outline-none focus:border-primary resize-none"
                  placeholder="Tell us about your situation or what you're building..."
                />
              </div>
              <button
                type="submit"
                disabled={sent}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-sm hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {sent ? (
                  <>
                    <Check size={16} /> Got it — we'll be in touch
                  </>
                ) : (
                  "Send message"
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </Section>
    </Layout>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-primary/70 mb-2">{label}</label>
      <input
        {...props}
        className="w-full bg-transparent border-b border-input pb-2 text-foreground focus:outline-none focus:border-primary"
      />
    </div>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-accent num-mono">{label}</p>
      <p className="mt-3 text-foreground/85 leading-relaxed">{body}</p>
    </div>
  );
}