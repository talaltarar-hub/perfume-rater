import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface RatingFormProps {
  perfumeId: number;
  perfumeName: string;
  onSuccess?: () => void;
}

export function RatingForm({ perfumeId, perfumeName, onSuccess }: RatingFormProps) {
  const utils = trpc.useUtils();

  const { data: existing, isLoading: loadingExisting } = trpc.ratings.getMyRating.useQuery(
    { perfumeId },
    { retry: false }
  );

  const [score, setScore] = useState<number>(0);
  const [review, setReview] = useState("");
  const [hovered, setHovered] = useState<number>(0);

  useEffect(() => {
    if (existing) {
      setScore(existing.score);
      setReview(existing.review ?? "");
    }
  }, [existing]);

  const upsert = trpc.ratings.upsert.useMutation({
    onSuccess: () => {
      toast.success(existing ? "Rating updated!" : "Rating submitted!", {
        description: `Your review for ${perfumeName} has been saved.`,
      });
      utils.perfumes.getById.invalidate({ id: perfumeId });
      utils.perfumes.list.invalidate();
      utils.ratings.getMyRating.invalidate({ perfumeId });
      onSuccess?.();
    },
    onError: (err) => {
      toast.error("Failed to submit rating", { description: err.message });
    },
  });

  const scoreLabels: Record<number, string> = {
    1: "Terrible",
    2: "Very Poor",
    3: "Poor",
    4: "Below Average",
    5: "Average",
    6: "Good",
    7: "Very Good",
    8: "Excellent",
    9: "Outstanding",
    10: "Masterpiece",
  };

  const activeScore = hovered || score;

  const scoreColor = (s: number) => {
    if (s >= 8) return "oklch(0.78 0.18 140)";
    if (s >= 6) return "oklch(0.78 0.12 80)";
    if (s >= 4) return "oklch(0.75 0.14 50)";
    return "oklch(0.60 0.18 25)";
  };

  if (loadingExisting) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading your rating…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-foreground mb-1">
          {existing ? "Update your rating" : "Rate this fragrance"}
        </p>
        <p className="text-xs text-muted-foreground">
          {existing
            ? `You previously rated this ${existing.score}/10. You can update it below.`
            : "Select a score from 1 (terrible) to 10 (masterpiece)."}
        </p>
      </div>

      {/* Score selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setScore(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              className={cn(
                "w-9 h-9 rounded-lg text-sm font-bold transition-all duration-150 border",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "active:scale-95",
                score === n
                  ? "border-transparent text-background shadow-md scale-110"
                  : hovered >= n
                  ? "border-transparent text-background opacity-80"
                  : "border-border/60 text-muted-foreground bg-card hover:border-primary/40"
              )}
              style={
                score === n || hovered >= n
                  ? { background: scoreColor(n), color: "oklch(0.12 0.01 60)" }
                  : undefined
              }
            >
              {n}
            </button>
          ))}
        </div>

        {activeScore > 0 && (
          <p
            className="text-sm font-semibold transition-all"
            style={{ color: scoreColor(activeScore), fontFamily: "'Playfair Display', serif" }}
          >
            {activeScore}/10 — {scoreLabels[activeScore]}
          </p>
        )}
      </div>

      {/* Review text */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Your Review <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your thoughts on the scent, longevity, projection, and occasion…"
          rows={4}
          maxLength={2000}
          className="resize-none text-sm bg-input border-border/60 focus:border-primary/60 placeholder:text-muted-foreground/50"
        />
        <p className="text-xs text-muted-foreground text-right">{review.length}/2000</p>
      </div>

      <Button
        onClick={() => upsert.mutate({ perfumeId, score, review: review || undefined })}
        disabled={score === 0 || upsert.isPending}
        className="w-full font-semibold"
        style={{
          background: score > 0
            ? "linear-gradient(135deg, oklch(0.78 0.12 80), oklch(0.65 0.10 60))"
            : undefined,
          color: score > 0 ? "oklch(0.12 0.01 60)" : undefined,
        }}
      >
        {upsert.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</>
        ) : existing ? (
          "Update Rating"
        ) : (
          "Submit Rating"
        )}
      </Button>
    </div>
  );
}
