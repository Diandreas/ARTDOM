<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArtistProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeaturedArtistController extends Controller
{
    public function index(): Response
    {
        $featuredArtists = User::whereHas('artistProfile', function ($query) {
            $query->where('is_featured', true);
        })
            ->with('artistProfile')
            ->join('artist_profiles', 'users.id', '=', 'artist_profiles.user_id')
            ->orderBy('artist_profiles.featured_order', 'asc')
            ->select('users.*')
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'stage_name' => $user->artistProfile->stage_name,
                'profile_photo' => $user->profile_photo,
                'featured_order' => $user->artistProfile->featured_order,
                'is_verified' => $user->artistProfile->is_verified,
            ]);

        return Inertia::render('Admin/FeaturedArtists/Index', [
            'featuredArtists' => $featuredArtists,
        ]);
    }

    public function search(Request $request)
    {
        $search = $request->input('search');

        if (empty($search)) {
            return response()->json([]);
        }

        $artists = User::where('role', 'artist')
            ->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhereHas('artistProfile', function ($q) use ($search) {
                        $q->where('stage_name', 'like', "%{$search}%");
                    });
            })
            ->whereHas('artistProfile', function ($query) {
                $query->where('is_featured', false);
            })
            ->limit(10)
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'stage_name' => $user->artistProfile->stage_name,
                'profile_photo' => $user->profile_photo,
                'is_verified' => $user->artistProfile->is_verified,
            ]);

        return response()->json($artists);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'artist_id' => 'required|exists:users,id',
        ]);

        $artistProfile = ArtistProfile::where('user_id', $validated['artist_id'])->firstOrFail();

        $maxOrder = ArtistProfile::where('is_featured', true)->max('featured_order') ?? 0;

        $artistProfile->update([
            'is_featured' => true,
            'featured_order' => $maxOrder + 1,
        ]);

        return back()->with('message', 'Artiste ajouté aux vedettes.');
    }

    public function updateOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:users,id',
            'orders.*.order' => 'required|integer',
        ]);

        foreach ($validated['orders'] as $item) {
            ArtistProfile::where('user_id', $item['id'])->update(['featured_order' => $item['order']]);
        }

        return back()->with('message', 'Ordre mis à jour.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $artistProfile = ArtistProfile::where('user_id', $user->id)->firstOrFail();

        $artistProfile->update([
            'is_featured' => false,
            'featured_order' => 0,
        ]);

        return back()->with('message', 'Artiste retiré des vedettes.');
    }
}
