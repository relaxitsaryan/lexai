import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <img src="/Logo.png" alt="ApnaNyaya Logo" className="h-8 w-auto" />
            <span className="font-serif text-xl text-primary">ApnaNyaya</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Legal intelligence for every Indian. Know your rights, generate documents, and act — in minutes, in your language.
          </p>
        </div>

        <FooterCol title="Product" links={[
          ["/features", "Features"],
          // ["/pricing", "Pricing"],
          ["/features", "Document Generator"],
          ["/features", "Contract Scanner"],
        ]} />
        <FooterCol title="Company" links={[
          ["/about", "About"],
          ["/about", "Team"],
          ["/about", "Roadmap"],
          ["/contact", "Contact"],
        ]} />
        <FooterCol title="Legal" links={[
          ["/", "Terms"],
          ["/", "Privacy"],
          ["/", "Disclaimer"],
        ]} />
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ApnaNyaya. All rights reserved.</p>
          <p>ApnaNyaya provides legal information, not legal advice.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-[0.18em] text-primary font-medium mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([to, label], i) => (
          <li key={i}>
            <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}