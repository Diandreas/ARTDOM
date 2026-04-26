<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
                'title_en' => 'Discover talents from Côte d\'Ivoire',
                'subtitle' => 'Réservez vos artistes préférés pour vos événements.',
                'subtitle_en' => 'Book your favorite artists for your events.',
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
        $settings = HeroSetting::firstOrFail();

        $validated = $request->validate([
            'type' => 'required|string|in:image,carousel,video',
            'title' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'subtitle_en' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'image_en' => 'nullable|image|max:5120',
            'image_url' => 'nullable|string|max:500',
            'image_url_en' => 'nullable|string|max:500',
            'video_url' => 'nullable|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'link_label' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($settings->image_url && str_contains($settings->image_url, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $settings->image_url));
            }
            $path = $request->file('image')->store('hero', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        if ($request->hasFile('image_en')) {
            if ($settings->image_url_en && str_contains($settings->image_url_en, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $settings->image_url_en));
            }
            $path = $request->file('image_en')->store('hero', 'public');
            $validated['image_url_en'] = Storage::url($path);
        }

        $settings->update($validated);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Configuration du héros mise à jour',
        ]);
    }
}
