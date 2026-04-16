<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Album;
use App\Models\ArtistProfile;
use App\Models\Service;
use App\Models\Track;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with realistic data and real images.
     */
    public function run(): void
    {
        $this->command->info('🌱 Seeding ARTEMO database with realistic data...');

        // Create admin user
        $this->command->info('Creating admin user...');
        User::factory()->admin()->create([
            'email' => 'admin@artemo.ci',
            'city' => 'Abidjan',
            'profile_photo' => 'https://i.pravatar.cc/400?img=1',
        ]);

        // Create test client
        $this->command->info('Creating test client...');
        $testClient = User::factory()->create([
            'email' => 'client@test.com',
            'city' => 'Abidjan',
            'role' => UserRole::Client,
            'profile_photo' => 'https://i.pravatar.cc/400?img=2',
        ]);

        // Create 10 regular clients
        $this->command->info('Creating 10 clients...');
        $clients = User::factory(10)->create([
            'role' => UserRole::Client,
        ])->each(function ($user, $index) {
            $user->update([
                'profile_photo' => 'https://i.pravatar.cc/400?img='.($index + 10),
            ]);
        });

        // Create 20 artists with realistic profiles
        $this->command->info('Creating 20 artists with profiles...');

        $artistsData = [
            ['name' => 'Aya Soul', 'category' => 'singer', 'city' => 'Abidjan', 'rate' => 50000, 'img' => 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400'],
            ['name' => 'Kofi Voice', 'category' => 'singer', 'city' => 'Bouaké', 'rate' => 40000, 'img' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
            ['name' => 'Aminata Melody', 'category' => 'singer', 'city' => 'Abidjan', 'rate' => 75000, 'img' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'],
            ['name' => 'DJ Blacky', 'category' => 'dj', 'city' => 'Abidjan', 'rate' => 100000, 'img' => 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400'],
            ['name' => 'DJ Ébène', 'category' => 'dj', 'city' => 'Yamoussoukro', 'rate' => 80000, 'img' => 'https://images.unsplash.com/photo-1520409364224-63400afe26e5?w=400'],
            ['name' => 'Kwame Moves', 'category' => 'dancer', 'city' => 'Abidjan', 'rate' => 35000, 'img' => 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400'],
            ['name' => 'Fatoumata Dance', 'category' => 'dancer', 'city' => 'Daloa', 'rate' => 30000, 'img' => 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400'],
            ['name' => 'Yao Guitar', 'category' => 'musician', 'city' => 'San-Pedro', 'rate' => 45000, 'img' => 'https://images.unsplash.com/photo-1531590878845-12627191e687?w=400'],
            ['name' => 'Adama Drums', 'category' => 'musician', 'city' => 'Korhogo', 'rate' => 40000, 'img' => 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400'],
            ['name' => 'Mariam Colors', 'category' => 'painter', 'city' => 'Abidjan', 'rate' => 60000, 'img' => 'https://images.unsplash.com/photo-1543965170-4c01a586684e?w=400'],
            ['name' => 'Sekou Beat', 'category' => 'singer', 'city' => 'Abidjan', 'rate' => 55000, 'img' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'],
            ['name' => 'Aïcha Flow', 'category' => 'singer', 'city' => 'Bouaké', 'rate' => 45000, 'img' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'],
            ['name' => 'DJ Zouglou', 'category' => 'dj', 'city' => 'Abidjan', 'rate' => 90000, 'img' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400'],
            ['name' => 'Bintou Steps', 'category' => 'dancer', 'city' => 'Man', 'rate' => 32000, 'img' => 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400'],
            ['name' => 'Ibrahim Sax', 'category' => 'musician', 'city' => 'Gagnoa', 'rate' => 50000, 'img' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400'],
            ['name' => 'Nadia Art', 'category' => 'painter', 'city' => 'Yamoussoukro', 'rate' => 55000, 'img' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'],
            ['name' => 'DJ Coupé', 'category' => 'dj', 'city' => 'Abidjan', 'rate' => 85000, 'img' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'],
            ['name' => 'Koffi Groove', 'category' => 'dancer', 'city' => 'Abidjan', 'rate' => 38000, 'img' => 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400'],
            ['name' => 'Safiatou Strings', 'category' => 'musician', 'city' => 'Bouaké', 'rate' => 42000, 'img' => 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=400'],
            ['name' => 'Moussa Canvas', 'category' => 'painter', 'city' => 'Daloa', 'rate' => 48000, 'img' => 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400'],
        ];

        $artistUsers = collect($artistsData)->map(function ($data, $index) {
            $user = User::factory()->artist()->create([
                'email' => "artist{$index}@ARTEMO.ci",
                'city' => $data['city'],
                'profile_photo' => $data['img'],
            ]);

            ArtistProfile::create([
                'user_id' => $user->id,
                'stage_name' => $data['name'],
                'bio' => "Artiste passionné(e) avec plus de 5 ans d'expérience dans le ".$data['category'].'. Je crée des moments inoubliables pour vos événements.',
                'categories' => json_encode([$data['category']]),
                'base_rate' => $data['rate'],
                'is_verified' => true,
                'verification_status' => 'approved',
                'portfolio_urls' => json_encode(["https://picsum.photos/seed/artist{$index}/1200/400"]),
            ]);

            return ['user' => $user, 'category' => $data['category']];
        });

        $this->command->info('Artists created with real photos!');

        // Create services for each artist
        $this->command->info('Creating services for artists...');
        $artistUsers->each(function ($data) {
            Service::factory(rand(3, 6))->create([
                'artist_id' => $data['user']->id,
                'category' => $data['category'],
            ]);
        });

        $testAudioUrls = [
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
            'https://cdn.pixabay.com/download/audio/2022/10/30/audio_bd4dca90c3.mp3',
            'https://cdn.pixabay.com/download/audio/2021/11/13/audio_cb4f13847f.mp3',
            'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
            'https://cdn.pixabay.com/download/audio/2022/03/10/audio_2cff3e0e03.mp3',
        ];

        // Create albums with covers
        $this->command->info('Creating 30 albums with covers...');
        for ($i = 0; $i < 30; $i++) {
            $artistData = $artistUsers->random();
            $album = Album::create([
                'artist_id' => $artistData['user']->id,
                'title' => fake()->randomElement(['Rythmes', 'Vibes', 'Émotions']).' '.fake()->randomElement(['du Cœur', 'd\'Afrique', 'Éternels']),
                'cover_url' => "https://picsum.photos/seed/album{$i}/600/600",
                'genre' => fake()->randomElement(['afrobeat', 'coupé-décalé', 'makossa', 'rumba', 'highlife', 'gospel']),
                'year' => rand(2020, 2026),
                'price' => rand(2500, 5000),
                'is_streamable' => true,
                'is_purchasable' => true,
                'total_plays' => 0,
                'published_at' => now()->subDays(rand(1, 365)),
            ]);

            // Create 8-12 tracks per album
            $trackNames = ['Mon Étoile', 'Danse avec Moi', 'Racines', 'Liberté', 'Amour Éternel', 'Rêves d\'Enfant', 'Mama Africa', 'Soleil Levant', 'Espoir', 'Voyage', 'Renaissance', 'Lumière'];
            $trackCount = rand(8, 12);
            for ($j = 1; $j <= $trackCount; $j++) {
                Track::create([
                    'album_id' => $album->id,
                    'title' => $trackNames[($j - 1) % count($trackNames)],
                    'duration_seconds' => rand(120, 360),
                    'track_number' => $j,
                    'file_url' => $testAudioUrls[array_rand($testAudioUrls)],
                    'plays' => rand(0, 50000),
                ]);
            }
        }

        $this->command->info('✅ Database seeded successfully with realistic data and real images!');
        $this->command->info('📧 Admin: admin@artemo.ci | Password: password');
        $this->command->info('📧 Test Client: client@test.com | Password: password');
        $this->command->info('📧 Artists: artist0@artemo.ci - artist19@artemo.ci | Password: password');
    }
}
