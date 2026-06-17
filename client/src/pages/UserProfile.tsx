import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { NavBar } from "@/components/NavBar";
import { ScoreRingInline } from "@/components/ScoreRing";
import { EditProfileModal } from "@/components/EditProfileModal";
import { ProfileRatingForm } from "@/components/ProfileRatingForm";
import { TopPerfumesSelector } from "@/components/TopPerfumesSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Edit2, Star, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  const numUserId = parseInt(userId || "0");
  const isOwnProfile = currentUser?.id === numUserId;

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = trpc.profiles.getProfile.useQuery({ userId: numUserId });

  // Fetch top 5 perfumes
  const { data: topPerfumes, isLoading: topPerfumesLoading } = trpc.profiles.getTopPerfumes.useQuery({ userId: numUserId });

  // Fetch profile ratings
  const { data: profileRatings, isLoading: ratingsLoading } = trpc.profiles.getProfileRatings.useQuery({ userId: numUserId });

  // Fetch current user's rating of this profile (if logged in)
  const { data: myRating } = trpc.profiles.getMyProfileRating.useQuery(
    { ratedUserId: numUserId },
    { enabled: !!currentUser && !isOwnProfile }
  );

  if (profileLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-48 w-full rounded-xl mb-8" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const avgProfileScore = profileRatings && profileRatings.length > 0
    ? profileRatings.reduce((sum, r) => sum + r.score, 0) / profileRatings.length
    : 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <NavBar />

      <section className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 p-8 border-border/60">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                {profile?.profileImageUrl && (
                  <img
                    src={profile.profileImageUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-gold-dim"
                  />
                )}
                <h1 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {profile?.bio ? "Perfume Enthusiast" : "User Profile"}
                </h1>
                {profile?.bio && (
                  <p className="text-muted-foreground text-lg">{profile.bio}</p>
                )}
              </div>

              <div className="flex flex-col items-end gap-4">
                {isOwnProfile && (
                  <Button onClick={() => setEditModalOpen(true)} variant="outline" className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                )}

                {/* Profile Score */}
                <div className="text-center">
                  <ScoreRingInline score={avgProfileScore} voteCount={profileRatings?.length || 0} size="md" />
                  <p className="text-xs text-muted-foreground mt-2">Profile Rating</p>
                </div>
              </div>
            </div>

            {profile?.profileVideoUrl && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gold-dim mb-2">Video</p>
                <video
                  src={profile.profileVideoUrl}
                  controls
                  className="w-full max-h-96 rounded-lg border border-border/60"
                />
              </div>
            )}
          </Card>

          {/* Top 5 Perfumes */}
          <div className="mb-8">
            <TopPerfumesSelector userId={numUserId} isOwnProfile={isOwnProfile} />
          </div>

          {/* Profile Ratings */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                Community Ratings
              </h2>
              {!isOwnProfile && currentUser && (
                <Button onClick={() => setRatingModalOpen(true)} className="gap-2">
                  <Heart className="w-4 h-4" />
                  Rate This Profile
                </Button>
              )}
            </div>

            {ratingsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            ) : profileRatings && profileRatings.length > 0 ? (
              <div className="space-y-4">
                {profileRatings.map((rating) => (
                  <Card key={rating.id} className="p-4 border-border/60">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{rating.ratingUserName || "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(rating.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-gold-dim">{rating.score}/10</span>
                      </div>
                    </div>
                    {rating.review && (
                      <p className="text-sm text-muted-foreground">{rating.review}</p>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No ratings yet</p>
            )}
          </div>

          {/* Show current user's rating if exists */}
          {myRating && (
            <Card className="p-6 border-gold-dim/50 bg-secondary/30 mb-8">
              <p className="text-sm text-gold-dim font-medium mb-2">Your Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-semibold text-lg">{myRating.score}/10</span>
              </div>
              {myRating.review && (
                <p className="text-sm text-muted-foreground mt-2">{myRating.review}</p>
              )}
            </Card>
          )}
        </div>
      </section>

      {/* Modals */}
      <EditProfileModal open={editModalOpen} onOpenChange={setEditModalOpen} />
      <ProfileRatingForm open={ratingModalOpen} onOpenChange={setRatingModalOpen} ratedUserId={numUserId} />
    </div>
  );
}
