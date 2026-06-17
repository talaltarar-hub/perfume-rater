import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X, Plus, Star } from "lucide-react";

interface TopPerfumesSelectorProps {
  userId: number;
  isOwnProfile: boolean;
}

export function TopPerfumesSelector({ userId, isOwnProfile }: TopPerfumesSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerfumes, setSelectedPerfumes] = useState<Array<{ id: number; name: string; brand: string; imageUrl: string | null | undefined; position: number }>>([]);

  // Fetch user's top perfumes
  const { data: topPerfumes, isLoading: topLoading } = trpc.profiles.getTopPerfumes.useQuery({ userId });

  // Fetch all perfumes for selection
  const { data: allPerfumes, isLoading: perfumesLoading } = trpc.perfumes.list.useQuery({ sortBy: "newest" });

  // Mutations
  const addTopPerfumeMutation = trpc.profiles.addTopPerfume.useMutation({
    onSuccess: () => {
      toast.success("Perfume added to your top 5!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add perfume");
    },
  });

  const removeTopPerfumeMutation = trpc.profiles.removeTopPerfume.useMutation({
    onSuccess: () => {
      toast.success("Perfume removed from your top 5");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove perfume");
    },
  });

  // Update selected perfumes when data loads
  useEffect(() => {
    if (topPerfumes) {
      setSelectedPerfumes(
        topPerfumes.map((p) => ({
          id: p.perfumeId,
          name: p.perfumeName || "Unknown",
          brand: p.perfumeBrand || "Unknown",
          imageUrl: p.perfumeImageUrl || undefined,
          position: p.position,
        }))
      );
    }
  }, [topPerfumes]);

  const handleAddPerfume = async (perfumeId: number, position: number) => {
    if (selectedPerfumes.length >= 5 && !selectedPerfumes.some(p => p.id === perfumeId)) {
      toast.error("You can only select 5 perfumes");
      return;
    }

    const perfume = allPerfumes?.find(p => p.id === perfumeId);
    if (!perfume) return;

    await addTopPerfumeMutation.mutateAsync({
      perfumeId,
      position,
    });

    // Refetch top perfumes
    const topPerfumesQuery = trpc.useUtils().profiles.getTopPerfumes;
    await topPerfumesQuery.invalidate({ userId });
  };

  const handleRemovePerfume = async (perfumeId: number) => {
    await removeTopPerfumeMutation.mutateAsync({ perfumeId });

    // Refetch top perfumes
    const topPerfumesQuery = trpc.useUtils().profiles.getTopPerfumes;
    await topPerfumesQuery.invalidate({ userId });
  };

  const filteredPerfumes = allPerfumes?.filter(
    (p) =>
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !selectedPerfumes.some((sp) => sp.id === p.id)
  );

  if (topLoading) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Star className="w-5 h-5 text-gold" />
          Top 5 Perfumes
        </h3>
        {isOwnProfile && selectedPerfumes.length < 5 && (
          <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        )}
      </div>

      {/* Display selected perfumes */}
      {selectedPerfumes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {isOwnProfile ? "Select your top 5 perfumes" : "No top perfumes selected yet"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {selectedPerfumes
            .sort((a, b) => a.position - b.position)
            .map((perfume, index) => (
              <Card key={perfume.id} className="p-4 relative group">
                {perfume.imageUrl && (
                  <img
                    src={perfume.imageUrl}
                    alt={perfume.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <div className="space-y-1">
                  <Badge className="bg-gold/20 text-gold">#{index + 1}</Badge>
                  <p className="font-semibold text-sm">{perfume.name}</p>
                  <p className="text-xs text-muted-foreground">{perfume.brand}</p>
                </div>

                {isOwnProfile && (
                  <button
                    onClick={() => handleRemovePerfume(perfume.id)}
                    className="absolute -top-2 -right-2 bg-destructive rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </Card>
            ))}
        </div>
      )}

      {/* Selection dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add to Top 5 Perfumes</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Search perfumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {perfumesLoading ? (
                <div className="col-span-full text-center text-muted-foreground">
                  Loading perfumes...
                </div>
              ) : filteredPerfumes?.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground">
                  No perfumes found
                </div>
              ) : (
                filteredPerfumes?.map((perfume) => (
                  <Card
                    key={perfume.id}
                    className="p-3 cursor-pointer hover:border-gold transition-colors"
                    onClick={() => {
                      const position = selectedPerfumes.length + 1;
                      handleAddPerfume(perfume.id, position);
                      setIsOpen(false);
                    }}
                  >
                    {perfume.imageUrl && (
                      <img
                        src={perfume.imageUrl}
                        alt={perfume.name}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                    )}
                    <p className="font-semibold text-sm truncate">{perfume.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{perfume.brand}</p>
                  </Card>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
