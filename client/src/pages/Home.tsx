import { useState } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { NavBar } from "@/components/NavBar";
import { ScoreRingInline } from "@/components/ScoreRing";
import { AddPerfumeModal } from "@/components/AddPerfumeModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Star, Sparkles, Plus } from "lucide-react";

type SortMode = "top" | "newest";

function PerfumeCard({ perfume }: { perfume: any }) {
  return (
    <Link href={`/perfumes/${perfume.id}`}>
      <div className="luxury-card group cursor-pointer rounded-xl overflow-hidden border border-border/60 bg-card h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          {perfume.imageUrl ? (
            <img
              src={perfume.imageUrl}
              alt={perfume.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.18 0.02 70), oklch(0.22 0.03 80))" }}>
              <span className="text-5xl opacity-40">🌸</span>
            </div>
          )}
          {/* Score overlay */}
          <div className="absolute top-3 right-3">
            <ScoreRingInline score={Number(perfume.avgScore)} voteCount={Number(perfume.voteCount)} size="sm" />
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-1.5 flex-1">
          <p className="text-xs font-medium tracking-widest uppercase text-gold-dim">{perfume.brand}</p>
          <h3
            className="text-base font-semibold leading-snug text-foreground group-hover:text-gold transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {perfume.name}
          </h3>
          {perfume.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
              {perfume.description}
            </p>
          )}
          <div className="mt-auto pt-2 flex items-center gap-2">
            {Number(perfume.voteCount) > 0 ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-gold-dim" />
                {Number(perfume.voteCount)} review{Number(perfume.voteCount) !== 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground italic">No reviews yet</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function PerfumeCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-border/60 bg-card">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export default function Home() {
  const [location] = useLocation();
  const initialSort: SortMode = location.includes("sort=top") ? "top" : "newest";
  const [sortBy, setSortBy] = useState<SortMode>(initialSort);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const { data: perfumes, isLoading, refetch } = trpc.perfumes.list.useQuery({ sortBy });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <NavBar />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.78 0.12 80 / 0.07), transparent)"
          }} />
        <div className="container text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 text-xs text-gold-dim mb-6"
            style={{ background: "oklch(0.16 0.02 70 / 0.6)" }}>
            <Sparkles className="w-3 h-3" />
            Community-Curated Fragrance Reviews
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Discover Your Next
            <br />
            <span style={{ color: "var(--gold)" }}>Signature Scent</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Explore the world's finest fragrances, rated and reviewed by a passionate community of perfume enthusiasts.
          </p>
        </div>
      </section>

      <div className="gold-divider mx-8" />

      {/* Catalog */}
      <section className="py-12 flex-1">
        <div className="container">
          {/* Header + Sort + Add Button */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2
                className="text-2xl font-semibold text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {sortBy === "top" ? "Top Rated Fragrances" : "Fragrance Catalog"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isLoading ? "Loading…" : `${perfumes?.length ?? 0} fragrances`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <Button
                  onClick={() => setAddModalOpen(true)}
                  className="gap-2"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Perfume
                </Button>
              )}
              <div className="flex items-center gap-2 p-1 rounded-lg border border-border/60 bg-card">
                <button
                  onClick={() => setSortBy("newest")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    sortBy === "newest"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Newest
                </button>
                <button
                  onClick={() => setSortBy("top")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    sortBy === "top"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Top Rated
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {Array.from({ length: 10 }).map((_, i) => <PerfumeCardSkeleton key={i} />)}
            </div>
          ) : perfumes && perfumes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {perfumes.map((p) => <PerfumeCard key={p.id} perfume={p} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4 opacity-30">🌸</div>
              <h3 className="text-xl font-semibold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                No fragrances yet
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Be the first to add a perfume to Scentify!
              </p>
              {isAuthenticated && (
                <Button onClick={() => setAddModalOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add First Perfume
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-8">
        <div className="container text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Scentify. A community for fragrance lovers.</p>
        </div>
      </footer>

      {/* Add Perfume Modal */}
      <AddPerfumeModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
