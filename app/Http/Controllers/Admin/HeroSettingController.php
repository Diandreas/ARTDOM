<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HeroSettingController extends Controller
{
    public function index(): Response
    {
        $settings = HeroSetting::first();

        if (! $settings) {
            $settings = HeroSetting::create([
                'type' => 'image',
                'title' => 'Découvrez les talents de Côte d\'Ivoire',
                'subtitle' => 'Réservez vos artistes préférés pour vos événements.',
                'image_url' => 'https://images.unsplash.com/photo-1514525253440-b393452eeb25?q=80&w=1600&auto=format&fit=crop',
                'link_url' => '/artists',
                'link_label' => 'Explorer les artistes',
                'is_active' => true,
            ]);
        }

        return Inertia::render('Admin/HeroSettings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $settings = HeroSetting::first();

        $validated = $request->validate([
            'type' => 'required|string|in:image,carousel,video',
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image_url' => 'nullable|string|max:500',
            'video_url' => 'nullable|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'link_label' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $settings->update($validated);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Configuration du héros mise à jour',
        ]);
    }
}
