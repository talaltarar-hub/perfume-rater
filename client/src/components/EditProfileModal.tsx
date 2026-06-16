import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [profileVideoUrl, setProfileVideoUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const updateProfileMutation = trpc.profiles.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated!");
      onOpenChange(false);
      setBio("");
      setProfileImageUrl("");
      setProfileVideoUrl("");
      setImagePreview(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file to server as raw bytes
      setIsUploadingImage(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const response = await fetch("/api/upload-profile-image", {
          method: "POST",
          headers: {
            "Content-Type": file.type || "image/jpeg",
          },
          body: arrayBuffer,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        if (data.url) {
          setProfileImageUrl(data.url);
          toast.success("Image uploaded");
        }
      } catch (error) {
        toast.error("Failed to upload image");
        setImagePreview(null);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await updateProfileMutation.mutateAsync({
        bio: bio || undefined,
        profileImageUrl: profileImageUrl || undefined,
        profileVideoUrl: profileVideoUrl || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell the community about your fragrance preferences..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={1000}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">{bio.length}/1000</p>
          </div>

          {/* Profile Image */}
          <div>
            <Label>Profile Picture</Label>
            <div className="mt-2 space-y-2">
              {imagePreview && (
                <div className="relative w-24 h-24">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full rounded-lg object-cover"
                  />
                  {!isUploadingImage && (
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setProfileImageUrl("");
                      }}
                      className="absolute -top-2 -right-2 bg-destructive rounded-full p-1"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              )}
              <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-gold-dim transition-colors disabled:opacity-50">
                <div className="flex items-center gap-2">
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload Image</span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-muted-foreground">Max 5MB</p>
            </div>
          </div>

          {/* Profile Video URL */}
          <div>
            <Label htmlFor="videoUrl">Profile Video URL</Label>
            <Input
              id="videoUrl"
              type="url"
              placeholder="https://example.com/video.mp4"
              value={profileVideoUrl}
              onChange={(e) => setProfileVideoUrl(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">Optional: Link to a video showcasing your collection</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || isUploadingImage}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isUploadingImage}
              className="flex-1"
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
