<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\Track;
use Illuminate\Database\Seeder;

class TracksSeeder extends Seeder
{
    /**
     * URLs de test pour fichiers audio (MP3 libres de droits)
     * Source: SoundHelix et autres sources libres
     */
    private array $testAudioUrls = [
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    ];

    /**
     * Titres de pistes africaines génériques
     */
    private array $trackTitles = [
        'Afrobeat Vibes',
        'Dancing in Lagos',
        'Sahara Nights',
        'Kora Dreams',
        'Accra Sunset',
        'Rumba Flow',
        'Congo Rhythms',
        'Zanzibar Soul',
        'Ivory Coast Groove',
        'Mali Magic',
        'Naija Anthem',
        'Abidjan Nights',
        'Tropical Heat',
        'Savanna Melody',
        'Urban Africa',
        'Ancestral Beats',
        'Modern Makossa',
        'Highlife Spirit',
        'Coupé-Décalé Fire',
        'Afro Fusion',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $albums = Album::all();

        if ($albums->isEmpty()) {
            $this->command->warn('Aucun album trouvé. Veuillez d\'abord exécuter les seeders d\'albums.');

            return;
        }

        $this->command->info('Création de tracks pour les albums...');

        foreach ($albums as $album) {
            // Nombre de pistes par album (entre 5 et 12)
            $trackCount = rand(5, 12);

            $this->command->info("Album: {$album->title} - Création de {$trackCount} pistes");

            for ($i = 1; $i <= $trackCount; $i++) {
                // Sélectionner un titre aléatoire et une URL audio
                $titleIndex = array_rand($this->trackTitles);
                $audioIndex = array_rand($this->testAudioUrls);

                // Créer un titre unique en ajoutant le numéro de piste
                $title = $this->trackTitles[$titleIndex];
                if ($i > 1) {
                    $title .= " (Part {$i})";
                }

                // Durée aléatoire entre 2:30 et 5:30 (150-330 secondes)
                $duration = rand(150, 330);

                // Nombre de lectures aléatoire (plus de plays pour les premières pistes)
                $plays = $i <= 3 ? rand(1000, 50000) : rand(100, 10000);

                Track::create([
                    'album_id' => $album->id,
                    'title' => $title,
                    'track_number' => $i,
                    'duration_seconds' => $duration,
                    'file_url' => $this->testAudioUrls[$audioIndex],
                    'plays' => $plays,
                    'lyrics' => null, // Pas de paroles pour les pistes de test
                ]);
            }
        }

        $totalTracks = Track::count();
        $this->command->info("✅ {$totalTracks} pistes créées avec succès pour {$albums->count()} albums!");
        $this->command->info('🎵 URLs audio de test ajoutées (SoundHelix - musique libre de droits)');
    }
}
