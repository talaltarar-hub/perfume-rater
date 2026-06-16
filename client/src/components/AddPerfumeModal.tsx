import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X } from "lucide-react";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const submitMutation = trpc.perfumes.submit.useMutation({
    onSuccess: () => {
      toast.success("Perfume added successfully! 🎉");
      setName("");
      setBrand("");
      setDescription("");
      setImageUrl("");
      setImageFile(null);
      setImagePreview(null);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add perfume");
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

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
      imageUrl: imagePreview || imageUrl.trim() || "",
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
            <Label>Perfume Image</Label>
            {imagePreview ? (
              <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  disabled={submitMutation.isPending}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-muted-foreground/50 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={submitMutation.isPending}
                  className="hidden"
                />
              </label>
            )}
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-xs">Or paste image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={submitMutation.isPending || !!imagePreview}
              />
            </div>
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
