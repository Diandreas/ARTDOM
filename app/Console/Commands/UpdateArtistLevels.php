<?php

namespace App\Console\Commands;

use App\Enums\ArtistLevel;
use App\Enums\ReservationStatus;
use App\Models\ArtistProfile;
use App\Models\Reservation;
use Illuminate\Console\Command;

class UpdateArtistLevels extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-artist-levels';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update artist levels automatically based on performance metrics';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('Starting artist level updates...');

        $profiles = ArtistProfile::query()
            ->where('is_level_manual', false)
            ->get();

        $updatedCount = 0;

        foreach ($profiles as $profile) {
            $oldLevel = $profile->level;
            $newLevel = $this->calculateLevel($profile);

            if ($oldLevel !== $newLevel) {
                $profile->update(['level' => $newLevel]);
                $updatedCount++;
            }
        }

        $this->info("Successfully updated {$updatedCount} artist levels.");
    }

    protected function calculateLevel(ArtistProfile $profile): ArtistLevel
    {
        $completedReservationsCount = Reservation::query()
            ->where('artist_id', $profile->user_id)
            ->where('status', ReservationStatus::Completed)
            ->count();

        $avgRating = $profile->rating ?? 0;

        if ($completedReservationsCount >= 15 && $avgRating >= 4.5) {
            return ArtistLevel::EmergingStar;
        }

        if ($completedReservationsCount >= 5 && $avgRating >= 4.0) {
            return ArtistLevel::RisingStar;
        }

        return ArtistLevel::Talent;
    }
}
