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
        {/* Image section */}
        {perfume.imageUrl && (
          <div className="relative h-[250px] overflow-hidden bg-secondary/20">
            <img
              src={perfume.imageUrl}
              alt={perfume.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        {/* Text section */}
        <div className="relative p-6 flex flex-col gap-3 flex-1 bg-background min-h-[150px] justify-between">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-gold-dim mb-2">{perfume.brand}</p>
            <h3
              className="text-2xl font-bold leading-snug text-foreground group-hover:text-gold transition-colors"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {perfume.name}
            </h3>
          </div>

          {perfume.description && (
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {perfume.description}
            </p>
          )}

          {/* Score overlay */}
          <div className="absolute top-3 right-3">
            <ScoreRingInline score={Number(perfume.avgScore)} voteCount={Number(perfume.voteCount)} size="sm" />
          </div>

          {/* Review count */}
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
      <Skeleton className="h-[300px] w-full" />
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
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-gold-dim" />
            <span className="text-sm font-medium tracking-widest uppercase text-gold-dim">Community-Curated Fragrance Reviews</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Discover Your Next
            <br />
            <span className="text-gold">Signature Scent</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore the world's finest fragrances, rated and reviewed by a passionate community of perfume enthusiasts.
          </p>
        </div>
      </section>

      {/* Catalog */}
      <section className="flex-1 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Fragrance Catalog</h2>
              <p className="text-muted-foreground text-sm mt-1">{perfumes?.length || 0} fragrances</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort toggle */}
              <div className="flex gap-2 bg-secondary/50 p-1 rounded-lg border border-border/40">
                <Button
                  variant={sortBy === "newest" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy("newest")}
                  className="gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Newest
                </Button>
                <Button
                  variant={sortBy === "top" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy("top")}
                  className="gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Top Rated
                </Button>
              </div>

              {/* Add perfume button */}
              {isAuthenticated && (
                <Button onClick={() => setAddModalOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Perfume
                </Button>
              )}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <PerfumeCardSkeleton key={i} />
              ))}
            </div>
          ) : perfumes && perfumes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {perfumes.map((perfume) => (
                <PerfumeCard key={perfume.id} perfume={perfume} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No perfumes yet. Be the first to add one!</p>
            </div>
          )}
        </div>
      </section>

      {/* Add Perfume Modal */}
      <AddPerfumeModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
