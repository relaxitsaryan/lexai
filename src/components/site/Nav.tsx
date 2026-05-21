import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/analyzer", label: "Analysis Engine" },
  // { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-background/85 backdrop-blur border-b border-border"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/Logo.png" alt="ApnaNyaya Logo" className="h-8 w-auto" />
          <span className="font-serif text-xl tracking-tight text-primary">
            ApnaNyaya
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-foreground/70 hover:text-foreground transition-colors relative"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              to="/dashboard"
              className="text-sm text-foreground/70 hover:text-foreground transition-colors relative"
              activeProps={{ className: "text-foreground" }}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-medium text-primary uppercase tracking-wider">{user.displayName || "User"}</span>
                <span className="text-[9px] text-muted-foreground">{user.email?.split('@')[0]}...</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-primary hover:text-accent transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2 text-primary"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border shadow-xl">
          <nav className="flex flex-col px-6 py-6 gap-5">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm text-foreground/80 font-medium"
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="text-sm text-foreground/80 font-medium"
              >
                Dashboard
              </Link>
            )}
            <div className="h-[1px] bg-border my-2" />
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary flex items-center justify-center text-primary">
                    <User size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{user.displayName}</span>
                    <span className="text-[10px] text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="text-sm px-4 py-2 border border-border text-primary text-center hover:bg-secondary transition-colors inline-flex items-center justify-center gap-2"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-sm px-4 py-3 border border-border text-primary text-center hover:bg-secondary font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="text-sm px-4 py-3 bg-primary text-primary-foreground text-center font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}