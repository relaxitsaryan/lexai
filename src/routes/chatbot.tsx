import { createFileRoute } from "@tanstack/react-router";
import { Layout, Section, Eyebrow } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { ChatInterface } from "@/components/chatbot/ChatInterface";
import { Scale, ShieldCheck, Languages } from "lucide-react";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "Legal Assistant — LexAI" },
      { name: "description", content: "Speak or type in Hindi, English, Hinglish. Justice should not require fluency. Get instant legal aid from our multilingual assistant." },
      { property: "og:title", content: "Legal Assistant — LexAI" },
      { property: "og:description", content: "Multilingual Voice & Chatbot for Legal Aid." },
    ],
  }),
  component: ChatbotPage,
});

function ChatbotPage() {
  return (
    <Layout>
      <Section className="pt-6 pb-6 lg:pt-6">
        <Reveal>
          <Eyebrow>05 — Multilingual Assistant</Eyebrow>
          <h1 className="mt-6 font-serif text-5xl md:text-7xl text-primary leading-[1] tracking-tight max-w-4xl">
            Justice should not require <em className="italic text-accent">fluency.</em>
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Speak or type in Hindi, English, Hinglish and regional languages. Describe your problem in your own words, and get instant legal guidance tailored to Indian laws.
          </p>
        </Reveal>
      </Section>

      <Section className="pb-0">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <ChatInterface />
            </Reveal>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <Reveal delay={0.2}>
              <div className="border border-border p-8 bg-secondary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Languages size={80} />
                </div>
                <h3 className="font-serif text-2xl text-primary mb-4">Supported Languages</h3>
                <ul className="space-y-3 text-sm text-foreground/80">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" /> English (Official)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Hindi (हिन्दी)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Hinglish (Mixed)
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground italic">
                    + Other regional dialects via Voice
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="space-y-6">
                <Block
                  icon={<Scale size={18} />}
                  title="Legal Aid Only"
                  description="System prompt restricted to Indian law (IPC, CrPC, BNSS, Consumer etc.) for accurate guidance."
                />
                <Block
                  icon={<ShieldCheck size={18} />}
                  title="Privacy First"
                  description="Conversations are processed securely via Groq and are not used for public model training."
                />
              </div>
            </Reveal>

            <div className="rule opacity-30" />

            <Reveal delay={0.4}>
              <div className="bg-primary p-6 text-primary-foreground">
                <p className="text-xs uppercase tracking-widest opacity-80 mb-3">Live Status</p>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <p className="font-serif text-lg">Llama 3.3 70B Active</p>
                </div>
                <p className="mt-2 text-[10px] opacity-70">Ultra-low latency inference via Groq</p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

function Block({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 text-accent">{icon}</div>
      <div>
        <h4 className="font-medium text-primary text-sm uppercase tracking-wide">{title}</h4>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
