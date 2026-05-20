import { createFileRoute } from "@tanstack/react-router";
import { SituationAnalyzer } from "@/components/analyzer/SituationAnalyzer";

export const Route = createFileRoute("/analyzer")({
  head: () => ({
    meta: [
      { title: "Situation Analyzer — LexAI" },
      {
        name: "description",
        content:
          "Describe your legal situation in Hindi, English or Hinglish. Get instant structured legal analysis powered by AI.",
      },
      { property: "og:title", content: "Situation Analyzer — LexAI" },
      {
        property: "og:description",
        content: "AI-powered legal situation analysis for Indian citizens.",
      },
    ],
  }),
  component: AnalyzerPage,
});

function AnalyzerPage() {
  return <SituationAnalyzer />;
}
