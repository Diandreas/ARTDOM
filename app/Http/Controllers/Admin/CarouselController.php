<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarouselSlide;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CarouselController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->get('type', 'main');

        $slides = CarouselSlide::with('artist')
            ->where('type', $type)
            ->orderBy('order')
            ->get();

        $artists = User::where('role', 'artist')->active()->get(['id', 'name']);

        return Inertia::render('Admin/Carousel', [
            'slides' => $slides,
            'artists' => $artists,
            'currentType' => $type,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'artist_id' => 'nullable|string|exists:users,id',
            'type' => 'required|string|in:main,hero',
            'title' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'subtitle_en' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'image_en' => 'nullable|image|max:5120',
            'image_url' => 'nullable|string|max:500',
            'image_url_en' => 'nullable|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'link_label' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('carousel', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        if ($request->hasFile('image_en')) {
            $path = $request->file('image_en')->store('carousel', 'public');
            $validated['image_url_en'] = Storage::url($path);
        }

        $maxOrder = CarouselSlide::where('type', $validated['type'])->max('order') ?? 0;

        CarouselSlide::create([
            ...$validated,
            'order' => $maxOrder + 1,
        ]);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Slide ajoutée avec succès',
        ]);
    }

    public function update(Request $request, CarouselSlide $slide): RedirectResponse
    {
        $validated = $request->validate([
            'artist_id' => 'nullable|string|exists:users,id',
            'type' => 'required|string|in:main,hero',
            'title' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'subtitle_en' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'image_en' => 'nullable|image|max:5120',
            'image_url' => 'nullable|string|max:500',
            'image_url_en' => 'nullable|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'link_label' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if it exists and is local
            if ($slide->image_url && str_contains($slide->image_url, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $slide->image_url));
            }
            $path = $request->file('image')->store('carousel', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        if ($request->hasFile('image_en')) {
            // Delete old image if it exists and is local
            if ($slide->image_url_en && str_contains($slide->image_url_en, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $slide->image_url_en));
            }
            $path = $request->file('image_en')->store('carousel', 'public');
            $validated['image_url_en'] = Storage::url($path);
        }

        $slide->update($validated);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Slide mise à jour',
        ]);
    }

    public function destroy(CarouselSlide $slide): RedirectResponse
    {
        // Delete images from storage
        if ($slide->image_url && str_contains($slide->image_url, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $slide->image_url));
        }
        if ($slide->image_url_en && str_contains($slide->image_url_en, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $slide->image_url_en));
        }

        $slide->delete();

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Slide supprimée',
        ]);
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'slides' => 'required|array',
            'slides.*.id' => 'required|integer|exists:carousel_slides,id',
            'slides.*.order' => 'required|integer',
        ]);

        foreach ($request->slides as $item) {
            CarouselSlide::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Ordre mis à jour',
        ]);
    }

    public function toggle(CarouselSlide $slide): RedirectResponse
    {
        $slide->update(['is_active' => ! $slide->is_active]);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => $slide->is_active ? 'Slide activée' : 'Slide désactivée',
        ]);
    }
}
