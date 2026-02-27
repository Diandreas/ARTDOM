<?php

use App\Models\User;
use App\Models\Video;
use App\Models\VideoComment;
use App\Notifications\AdminGlobalMessageNotification;

it('admin can open moderation page and see reported comments', function () {
    $admin = User::factory()->admin()->create();
    $author = User::factory()->create();
    $artist = User::factory()->artist()->create();

    $video = Video::query()->create([
        'artist_id' => $artist->id,
        'title' => 'Test video',
        'description' => 'Description',
        'video_url' => 'https://example.com/video.mp4',
        'thumbnail_url' => 'https://example.com/thumb.jpg',
        'duration_seconds' => 120,
        'category' => 'tutorial',
        'visibility' => 'public',
    ]);

    VideoComment::query()->create([
        'video_id' => $video->id,
        'user_id' => $author->id,
        'content' => 'Commentaire signale',
        'is_reported' => true,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.moderation.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Moderation')
        ->has('reportedComments', 1)
    );
});

it('admin can export monthly report as csv', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.reports.export', [
        'year' => now()->year,
        'month' => now()->month,
    ]));

    $response->assertOk();
    expect((string) $response->headers->get('content-disposition'))
        ->toContain('attachment;')
        ->toContain('admin-report-');
});

it('admin can send global notification to active clients', function () {
    $admin = User::factory()->admin()->create();
    User::factory()->create(['role' => 'client', 'is_active' => true]);
    User::factory()->create(['role' => 'client', 'is_active' => false]);

    $this->actingAs($admin)
        ->post(route('admin.broadcast.store'), [
            'title' => 'Maintenance',
            'message' => 'Une maintenance est prevue cette nuit.',
            'target_role' => 'client',
            'only_active' => true,
            'send_email' => false,
        ])
        ->assertRedirect();

    $this->assertDatabaseCount('notifications', 1);
    $this->assertDatabaseHas('notifications', [
        'type' => AdminGlobalMessageNotification::class,
    ]);
});
