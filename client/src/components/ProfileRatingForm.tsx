import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Star } from "lucide-react";

interface ProfileRatingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ratedUserId: number;
}

export function ProfileRatingForm({ open, onOpenChange, ratedUserId }: ProfileRatingFormProps) {
  const [score, setScore] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const upsertMutation = trpc.profiles.upsertProfileRating.useMutation({
    onSuccess: () => {
      toast.success("Rating submitted!");
      onOpenChange(false);
      setScore(0);
      setReview("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit rating");
    },
  });

  const handleSubmit = async () => {
    if (score === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await upsertMutation.mutateAsync({
        ratedUserId,
        score,
        review: review || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rate This Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Star Rating */}
          <div>
            <Label>Rating</Label>
            <div className="flex gap-2 mt-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setScore(i + 1)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      i < score
                        ? "fill-gold-dim text-gold-dim"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            {score > 0 && (
              <p className="text-sm text-gold-dim font-medium mt-2">{score}/10</p>
            )}
          </div>

          {/* Review */}
          <div>
            <Label htmlFor="review">Review (Optional)</Label>
            <Textarea
              id="review"
              placeholder="Share your thoughts about their fragrance choices..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              maxLength={2000}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">{review.length}/2000</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || score === 0}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
