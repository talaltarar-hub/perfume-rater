import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { NavBar } from "@/components/NavBar";
import { ScoreRingInline } from "@/components/ScoreRing";
import { RatingForm } from "@/components/RatingForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getLoginUrl } from "@/const";
import { ArrowLeft, Star, Lock, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function ReviewItem({ review }: { review: any }) {
  const initials = review.userName
    ? review.userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const scoreColor =
    review.score >= 8 ? "oklch(0.78 0.18 140)" :
    review.score >= 6 ? "oklch(0.78 0.12 80)" :
    review.score >= 4 ? "oklch(0.75 0.14 50)" :
    "oklch(0.60 0.18 25)";

  return (
    <div className="py-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 border border-border/60 flex-shrink-0">
            <AvatarFallback
              className="text-xs font-semibold"
              style={{ background: "oklch(0.22 0.03 70)", color: "var(--gold)" }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{review.userName ?? "Anonymous"}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.updatedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold flex-shrink-0"
          style={{ background: `${scoreColor}18`, color: scoreColor, border: `1px solid ${scoreColor}30` }}
        >
          <Star className="w-3 h-3 fill-current" />
          {review.score}/10
        </div>
      </div>
      {review.review && (
        <p className="text-sm text-foreground/80 leading-relaxed pl-12">{review.review}</p>
      )}
    </div>
  );
}

export default function PerfumeDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id ?? "0", 10);
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = trpc.perfumes.getById.useQuery(
    { id },
    { enabled: id > 0 }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="container py-12 grid md:grid-cols-[380px_1fr] gap-12">
          <Skeleton className="aspect-[3/4] rounded-2xl w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="container py-24 text-center">
          <p className="text-muted-foreground">Perfume not found.</p>
          <Link href="/">
            <Button variant="outline" className="mt-4">Back to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const avgScore = Number(data.avgScore);
  const voteCount = Number(data.voteCount);
  const notes = data.notes ? data.notes.split(",").map((n) => n.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <NavBar />

      <div className="container py-8">
        {/* Back */}
        <Link href="/">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Catalog
          </button>
        </Link>

        {/* Main layout */}
        <div className="grid md:grid-cols-[360px_1fr] gap-12 items-start">
          {/* Left: Image + Score */}
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-2xl aspect-[3/4]"
              style={{ boxShadow: "0 32px 80px oklch(0 0 0 / 0.5)" }}>
              {data.imageUrl ? (
                <img
                  src={data.imageUrl}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, oklch(0.18 0.02 70), oklch(0.24 0.04 80))" }}>
                  <span className="text-8xl opacity-30">🌸</span>
                </div>
              )}
            </div>

            {/* Community Score Card */}
            <div className="rounded-xl border border-border/60 bg-card p-6 text-center space-y-3">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                Community Score
              </p>
              <div className="flex justify-center">
                <ScoreRingInline score={avgScore} voteCount={voteCount} size="lg" />
              </div>
              <div className="gold-divider" />
              <p className="text-xs text-muted-foreground">
                Based on {voteCount} community {voteCount === 1 ? "rating" : "ratings"}
              </p>
            </div>
          </div>

          {/* Right: Details + Rating + Reviews */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-gold-dim mb-2">
                {data.brand}
              </p>
              <h1
                className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {data.name}
              </h1>
              {data.description && (
                <p className="text-base text-muted-foreground leading-relaxed">{data.description}</p>
              )}
            </div>

            {/* Notes */}
            {notes.length > 0 && (
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                  Fragrance Notes
                </p>
                <div className="flex flex-wrap gap-2">
                  {notes.map((note) => (
                    <span
                      key={note}
                      className="px-3 py-1 rounded-full text-xs font-medium border"
                      style={{
                        background: "oklch(0.22 0.03 70 / 0.5)",
                        borderColor: "oklch(0.78 0.12 80 / 0.25)",
                        color: "var(--gold-light)",
                      }}
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="gold-divider" />

            {/* Rating Section */}
            <div>
              <h2
                className="text-xl font-semibold text-foreground mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Rate This Fragrance
              </h2>

              {isAuthenticated ? (
                <div className="rounded-xl border border-border/60 bg-card p-6">
                  <RatingForm perfumeId={id} perfumeName={data.name} />
                </div>
              ) : (
                <div className="rounded-xl border border-border/60 bg-card p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.22 0.03 70)" }}>
                    <Lock className="w-5 h-5 text-gold-dim" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Sign in to rate</p>
                    <p className="text-sm text-muted-foreground">
                      Join the community to share your rating and review.
                    </p>
                  </div>
                  <Button
                    onClick={() => (window.location.href = getLoginUrl())}
                    style={{
                      background: "linear-gradient(135deg, oklch(0.78 0.12 80), oklch(0.65 0.10 60))",
                      color: "oklch(0.12 0.01 60)",
                    }}
                  >
                    Sign In to Rate
                  </Button>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-gold-dim" />
                <h2
                  className="text-xl font-semibold text-foreground"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Community Reviews
                </h2>
                {voteCount > 0 && (
                  <span className="text-sm text-muted-foreground">({voteCount})</span>
                )}
              </div>

              {data.reviews.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground text-sm italic">
                    No reviews yet. Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {data.reviews.map((r: any) => (
                    <ReviewItem key={r.id} review={r} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-12">
        <div className="container text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Scentify. A community for fragrance lovers.</p>
        </div>
      </footer>
    </div>
  );
}
