# Scentify – Perfume Rating App TODO

## Database & Backend
- [x] Add `perfumes` table (id, name, brand, description, notes, imageUrl, createdAt)
- [x] Add `ratings` table (id, userId, perfumeId, score 1-10, review text, createdAt, updatedAt)
- [x] Generate and apply DB migration SQL
- [x] tRPC: perfumes.list (with avg score, vote count, sort by top-rated)
- [x] tRPC: perfumes.getById (full detail + all reviews)
- [x] tRPC: ratings.upsert (protected – submit or update rating + review)
- [x] tRPC: ratings.getMyRating (protected – fetch current user's rating for a perfume)
- [x] tRPC: admin.addPerfume (admin-only – add new perfume to catalog)
- [x] tRPC: admin.deletePerfume (admin-only)

## Frontend – Global
- [x] Elegant luxury theme (dark/gold palette, serif typography)
- [x] Google Fonts (Playfair Display + Inter)
- [x] Top navigation bar with logo, links, login/logout
- [x] Responsive layout

## Frontend – Catalog Page (/)
- [x] Grid of perfume cards (name, brand, cover image, avg score, vote count)
- [x] Sort by: Top Rated / Newest
- [x] Leaderboard section or sort toggle

## Frontend – Perfume Detail Page (/perfumes/:id)
- [x] Full perfume info (image, name, brand, description, notes)
- [x] Prominent community score display (avg + vote count)
- [x] Rating submission form (1–10 selector + text review) – logged-in only
- [x] Show existing user rating if already rated
- [x] List of all community reviews

## Frontend – Admin Panel (/admin)
- [x] Admin-only route (redirect non-admins)
- [x] Add new perfume form (name, brand, description, notes, image URL)
- [x] List existing perfumes with delete option

## Testing
- [x] Vitest: perfumes.list returns sorted results
- [x] Vitest: ratings.upsert requires auth
- [x] Vitest: admin.addPerfume requires admin role
