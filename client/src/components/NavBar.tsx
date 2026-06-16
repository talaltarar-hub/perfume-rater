import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { FlaskConical, Crown } from "lucide-react";

export function NavBar() {
  const { user, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Signed out successfully");
      navigate("/");
      window.location.reload();
    },
  });

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md"
      style={{ background: "oklch(0.12 0.01 60 / 0.92)" }}>
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, oklch(0.78 0.12 80), oklch(0.65 0.10 60))" }}>
            <FlaskConical className="w-4 h-4" style={{ color: "oklch(0.12 0.01 60)" }} />
          </div>
          <span
            className="text-xl font-semibold tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--gold)" }}
          >
            Scentify
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={`text-sm font-medium transition-colors hover:text-gold ${location === "/" ? "text-gold" : "text-muted-foreground"}`}>
            Catalog
          </Link>
          <Link href="/?sort=top" className="text-sm font-medium text-muted-foreground transition-colors hover:text-gold">
            Top Rated
          </Link>
          {user?.role === "admin" && (
            <Link href="/admin" className={`text-sm font-medium transition-colors hover:text-gold flex items-center gap-1 ${location === "/admin" ? "text-gold" : "text-muted-foreground"}`}>
              <Crown className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarFallback
                      className="text-xs font-semibold"
                      style={{ background: "oklch(0.22 0.03 70)", color: "var(--gold)" }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm text-foreground/80 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                {user?.role === "admin" && (
                  <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer">
                    <Crown className="w-4 h-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => logout.mutate()}
                  disabled={logout.isPending}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={() => (window.location.href = getLoginUrl())}
              className="font-medium"
              style={{
                background: "linear-gradient(135deg, oklch(0.78 0.12 80), oklch(0.65 0.10 60))",
                color: "oklch(0.12 0.01 60)",
              }}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
