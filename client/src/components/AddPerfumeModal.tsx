import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddPerfumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddPerfumeModal({ open, onOpenChange, onSuccess }: AddPerfumeModalProps) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const submitMutation = trpc.perfumes.submit.useMutation({
    onSuccess: () => {
      toast.success("Perfume added successfully! 🎉");
      setName("");
      setBrand("");
      setDescription("");
      setImageUrl("");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add perfume");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim()) {
      toast.error("Please fill in name and brand");
      return;
    }
    submitMutation.mutate({
      name: name.trim(),
      brand: brand.trim(),
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Playfair Display', serif" }}>Add Your Perfume</DialogTitle>
          <DialogDescription>
            Share a fragrance with the Scentify community. Help others discover their next signature scent.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Perfume Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Bleu de Chanel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitMutation.isPending}
              maxLength={256}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand *</Label>
            <Input
              id="brand"
              placeholder="e.g., Chanel"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              disabled={submitMutation.isPending}
              maxLength={256}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the fragrance notes, scent profile, and your thoughts..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitMutation.isPending}
              maxLength={5000}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">{description.length}/5000</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={submitMutation.isPending}
            />
            <p className="text-xs text-muted-foreground">Optional: Link to a perfume bottle image</p>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitMutation.isPending || !name.trim() || !brand.trim()}
              className="gap-2"
            >
              {submitMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Perfume
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
