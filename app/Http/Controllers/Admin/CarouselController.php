<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarouselSlide;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CarouselController extends Controller
{
    public function index(): Response
    {
        $slides = CarouselSlide::orderBy('order')->get();

        return Inertia::render('Admin/Carousel', [
            'slides' => $slides,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image_url' => 'required|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'link_label' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $maxOrder = CarouselSlide::max('order') ?? 0;

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
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image_url' => 'required|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'link_label' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $slide->update($validated);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Slide mise à jour',
        ]);
    }

    public function destroy(CarouselSlide $slide): RedirectResponse
    {
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
