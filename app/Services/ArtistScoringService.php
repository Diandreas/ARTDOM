<?php

namespace App\Services;

use App\Enums\ArtistLevel;
use App\Models\User;

class ArtistScoringService
{
    /**
     * Calcule le score global d'un artiste (0–100).
     *
     * Composantes :
     *   40 % affinité/engagement  → écoutes, favoris
     *   25 % performance          → rating, reviews
     *   20 % tendance             → croissance récente
     *   10 % fraîcheur            → publications récentes
     *    5 % diversité            → nombre de services/albums
     */
    public function calculate(User $artist): int
    {
        $profile = $artist->artistProfile;
        if (! $profile) {
            return 0;
        }

        $totalPlays = $artist->albums()->sum('total_plays');
        $albumCount = $artist->albums()->count();
        $serviceCount = $artist->services()->count();
        $followerCount = $profile->followers()->count();
        $rating = (float) ($profile->rating ?? 0);
        $totalReviews = (int) ($profile->total_reviews ?? 0);

        $recentAlbumsCount = $artist->albums()
            ->where('published_at', '>=', now()->subDays(30))
            ->count();

        // Engagement (40 pts)
        $engagementScore = min(20, $totalPlays / 500)
            + min(10, $followerCount / 10)
            + min(10, $totalReviews / 2);

        // Performance (25 pts)
        $performanceScore = ($rating / 5) * 20
            + min(5, $totalReviews / 4);

        // Tendance (20 pts)
        $trendScore = min(20, $recentAlbumsCount * 5 + $followerCount / 20);

        // Fraîcheur (10 pts)
        $freshnessScore = min(10, $recentAlbumsCount * 3 + $albumCount);

        // Diversité (5 pts)
        $diversityScore = min(5, $serviceCount + $albumCount / 2);

        $total = $engagementScore + $performanceScore + $trendScore + $freshnessScore + $diversityScore;

        return (int) min(100, round($total));
    }

    /**
     * Met à jour le niveau d'un artiste si non géré manuellement.
     */
    public function updateLevel(User $artist): void
    {
        $profile = $artist->artistProfile;
        if (! $profile || $profile->is_level_manual) {
            return;
        }

        $score = $this->calculate($artist);
        $newLevel = ArtistLevel::fromScore($score);

        $profile->update(['level' => $newLevel]);
    }
}
