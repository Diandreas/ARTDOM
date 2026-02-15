<?php

namespace Database\Seeders;

use App\Models\Track;
use Illuminate\Database\Seeder;

class UpdateTrackUrlsSeeder extends Seeder
{
    /**
     * URLs audio de test fonctionnelles (CORS-enabled, HTTPS)
     * Sources : Archive.org et autres CDN publics
     */
    private array $workingAudioUrls = [
        // Archive.org - Musique libre de droits avec CORS
        'https://archive.org/download/mythium/mythium_-_10_-_away.mp3',
        'https://archive.org/download/mythium/mythium_-_11_-_not_afraid.mp3',
        'https://archive.org/download/mythium/mythium_-_12_-_vanishing.mp3',
        'https://archive.org/download/mythium/mythium_-_13_-_still_alive.mp3',
        'https://archive.org/download/mythium/mythium_-_14_-_overture.mp3',
        // Free Music Archive via Archive.org
        'https://archive.org/download/Free_20s_Jazz_Collection/Eddie_Condon_and_his_Orchestra-Carnegie_Jump.mp3',
        'https://archive.org/download/Free_20s_Jazz_Collection/The_Georgians-So_This_is_Venice.mp3',
        'https://archive.org/download/Free_20s_Jazz_Collection/Bennie_Moten_and_his_Kansas_City_Orchestra-South.mp3',
        // Bensound - Musique libre (avec attribution)
        'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
        'https://cdn.pixabay.com/download/audio/2022/03/10/audio_2cff3e0e03.mp3',
        'https://cdn.pixabay.com/download/audio/2022/01/18/audio_f6292e4363.mp3',
        'https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3',
        'https://cdn.pixabay.com/download/audio/2022/03/24/audio_c7b0fbf8d0.mp3',
        'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe66c21.mp3',
        'https://cdn.pixabay.com/download/audio/2022/05/13/audio_c63d39c602.mp3',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tracks = Track::all();

        if ($tracks->isEmpty()) {
            $this->command->warn('Aucune piste trouvée.');
            return;
        }

        $this->command->info("Mise à jour de {$tracks->count()} pistes avec des URLs audio fonctionnelles...");

        $progressBar = $this->command->getOutput()->createProgressBar($tracks->count());
        $progressBar->start();

        foreach ($tracks as $track) {
            // Sélectionner une URL aléatoire
            $audioUrl = $this->workingAudioUrls[array_rand($this->workingAudioUrls)];

            $track->update([
                'file_url' => $audioUrl,
            ]);

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->command->newLine();
        $this->command->info('✅ Toutes les pistes ont été mises à jour avec des URLs audio fonctionnelles !');
        $this->command->info('🎵 Sources : Archive.org & Pixabay (musique libre de droits)');
    }
}
