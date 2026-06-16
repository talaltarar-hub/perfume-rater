import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Crown, Plus, Trash2, Loader2, Lock, ExternalLink } from "lucide-react";
import { getLoginUrl } from "@/const";

function AddPerfumeForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const utils = trpc.useUtils();
  const add = trpc.admin.addPerfume.useMutation({
    onSuccess: () => {
      toast.success("Perfume added to catalog!");
      setName(""); setBrand(""); setDescription(""); setNotes(""); setImageUrl("");
      utils.admin.listPerfumes.invalidate();
      utils.perfumes.list.invalidate();
      onSuccess();
    },
    onError: (err) => toast.error("Failed to add perfume", { description: err.message }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim()) {
      toast.error("Name and brand are required");
      return;
    }
    add.mutate({
      name: name.trim(),
      brand: brand.trim(),
      description: description.trim() || undefined,
      notes: notes.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Perfume Name <span className="text-destructive">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chanel No. 5"
            className="bg-input border-border/60"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Brand <span className="text-destructive">*</span>
          </label>
          <Input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Chanel"
            className="bg-input border-border/60"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the fragrance, its character, and story…"
          rows={3}
          className="resize-none bg-input border-border/60 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Fragrance Notes{" "}
          <span className="text-muted-foreground font-normal text-xs">(comma-separated)</span>
        </label>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Rose, Jasmine, Sandalwood, Musk"
          className="bg-input border-border/60"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Cover Image URL{" "}
          <span className="text-muted-foreground font-normal text-xs">(optional)</span>
        </label>
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/perfume-image.jpg"
          className="bg-input border-border/60"
          type="url"
        />
      </div>

      <Button
        type="submit"
        disabled={add.isPending || !name.trim() || !brand.trim()}
        className="w-full font-semibold"
        style={{
          background: "linear-gradient(135deg, oklch(0.78 0.12 80), oklch(0.65 0.10 60))",
          color: "oklch(0.12 0.01 60)",
        }}
      >
        {add.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding…</>
        ) : (
          <><Plus className="w-4 h-4 mr-2" /> Add to Catalog</>
        )}
      </Button>
    </form>
  );
}

function PerfumeRow({ perfume, onDelete }: { perfume: any; onDelete: () => void }) {
  const utils = trpc.useUtils();
  const del = trpc.admin.deletePerfume.useMutation({
    onSuccess: () => {
      toast.success(`"${perfume.name}" removed from catalog`);
      utils.admin.listPerfumes.invalidate();
      utils.perfumes.list.invalidate();
      onDelete();
    },
    onError: (err) => toast.error("Failed to delete", { description: err.message }),
  });

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border/40 last:border-0">
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border/40">
        {perfume.imageUrl ? (
          <img src={perfume.imageUrl} alt={perfume.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg"
            style={{ background: "oklch(0.20 0.02 70)" }}>
            🌸
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm truncate">{perfume.name}</p>
        <p className="text-xs text-muted-foreground">{perfume.brand}</p>
      </div>

      {/* Score */}
      <div className="text-center flex-shrink-0">
        <p className="text-sm font-bold" style={{ color: "var(--gold)" }}>
          {Number(perfume.avgScore) > 0 ? Number(perfume.avgScore).toFixed(1) : "—"}
        </p>
        <p className="text-xs text-muted-foreground">{Number(perfume.voteCount)} votes</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link href={`/perfumes/${perfume.id}`}>
          <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-muted-foreground hover:text-destructive"
              disabled={del.isPending}
            >
              {del.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete "{perfume.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the perfume and all its ratings and reviews from the catalog. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => del.mutate({ id: perfume.id })}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);

  // Redirect non-admins once auth is resolved
  useEffect(() => {
    if (!loading && isAuthenticated && user?.role !== "admin") {
      navigate("/");
    }
  }, [loading, isAuthenticated, user]);

  const { data: perfumes, isLoading } = trpc.admin.listPerfumes.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="container py-12 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="container py-24 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "oklch(0.22 0.03 70)" }}>
            <Lock className="w-7 h-7 text-gold-dim" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Sign In Required
            </h2>
            <p className="text-muted-foreground">You must be signed in to access the admin panel.</p>
          </div>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            style={{
              background: "linear-gradient(135deg, oklch(0.78 0.12 80), oklch(0.65 0.10 60))",
              color: "oklch(0.12 0.01 60)",
            }}
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="container py-24 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "oklch(0.22 0.03 70)" }}>
            <Crown className="w-7 h-7 text-gold-dim" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Admin Access Only
            </h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>Back to Catalog</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <NavBar />

      <div className="container py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-gold" />
            <h1
              className="text-3xl font-bold text-foreground"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Admin Panel
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">Manage the fragrance catalog.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
          {/* Catalog list */}
          <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
              <h2 className="font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                Catalog ({perfumes?.length ?? 0} fragrances)
              </h2>
            </div>
            <div className="px-6">
              {isLoading ? (
                <div className="space-y-4 py-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : perfumes && perfumes.length > 0 ? (
                perfumes.map((p) => (
                  <PerfumeRow key={p.id} perfume={p} onDelete={() => setRefreshKey((k) => k + 1)} />
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground text-sm italic">No fragrances in catalog yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Add form */}
          <div className="rounded-xl border border-border/60 bg-card p-6 sticky top-24">
            <h2
              className="font-semibold text-foreground mb-4 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <Plus className="w-4 h-4 text-gold" />
              Add New Fragrance
            </h2>
            <AddPerfumeForm onSuccess={() => setRefreshKey((k) => k + 1)} />
          </div>
        </div>
      </div>

      <footer className="border-t border-border/40 py-8 mt-12">
        <div className="container text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Scentify. A community for fragrance lovers.</p>
        </div>
      </footer>
    </div>
  );
}
