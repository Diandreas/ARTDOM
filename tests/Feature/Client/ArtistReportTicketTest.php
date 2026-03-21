<?php

use App\Models\ArtistProfile;
use App\Models\Ticket;
use App\Models\User;

it('client can report an artist and admin can see the complaint ticket', function () {
    $client = User::factory()->client()->create();
    $artist = User::factory()->artist()->create();
    ArtistProfile::factory()->create([
        'user_id' => $artist->id,
        'stage_name' => 'Artiste Test',
    ]);

    $this->actingAs($client)
        ->from('/artist/'.$artist->id)
        ->post(route('client.artists.report', $artist), [
            'reason' => 'Comportement inapproprie pendant la prestation.',
        ])
        ->assertRedirect('/artist/'.$artist->id)
        ->assertSessionHas('message');

    $ticket = Ticket::query()->first();

    expect($ticket)->not->toBeNull();

    expect($ticket->type)->toBe('complaint');
    expect($ticket->status)->toBe('open');
    expect($ticket->user_id)->toBe($client->id);
    expect($ticket->subject)->toContain('Signalement artiste');
    expect($ticket->message)->toContain('Comportement inapproprie');

    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.tickets.index', ['type' => 'complaint']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Tickets')
            ->has('tickets.data', 1)
            ->where('tickets.data.0.type', 'complaint')
        );
});
