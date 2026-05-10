<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSection;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HeroSectionController extends Controller
{
    public function index(): Response
    {
        $sections = HeroSection::with('artist.artistProfile')
            ->orderBy('order')
            ->get();

        $artists = User::where('role', 'artist')
            ->active()
            ->with('artistProfile')
            ->get(['id', 'name'])
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->artistProfile->stage_name ?? $u->name,
            ]);

        return Inertia::render('Admin/HeroSections', [
            'sections' => $sections,
            'artists' => $artists,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateSection($request);
        $validated = $this->handleMediaUploads($request, $validated);

        $maxOrder = HeroSection::max('order') ?? 0;
        HeroSection::create([...$validated, 'order' => $maxOrder + 1]);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Section héro ajoutée avec succès',
        ]);
    }

    public function update(Request $request, HeroSection $heroSection): RedirectResponse
    {
        $validated = $this->validateSection($request);
        $validated = $this->handleMediaUploads($request, $validated, $heroSection);

        $heroSection->update($validated);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Section héro mise à jour',
        ]);
    }

    public function destroy(HeroSection $heroSection): RedirectResponse
    {
        $this->deleteStorageFile($heroSection->image_url);
        $this->deleteStorageFile($heroSection->image_url_en);
        $this->deleteStorageFile($heroSection->video_url);

        $heroSection->delete();

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Section supprimée',
        ]);
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|integer|exists:hero_sections,id',
            'sections.*.order' => 'required|integer',
        ]);

        foreach ($request->sections as $item) {
            HeroSection::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Ordre mis à jour',
        ]);
    }

    public function toggle(HeroSection $heroSection): RedirectResponse
    {
        $heroSection->update(['is_active' => ! $heroSection->is_active]);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => $heroSection->is_active ? 'Section activée' : 'Section désactivée',
        ]);
    }

    private function validateSection(Request $request): array
    {
        return $request->validate([
            'media_type' => 'required|string|in:image,video_upload,video_youtube,artist',
            'title' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'subtitle_en' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:8192',
            'image_en' => 'nullable|image|max:8192',
            'image_url' => 'nullable|string|max:500',
            'image_url_en' => 'nullable|string|max:500',
            'video' => 'nullable|file|mimetypes:video/mp4,video/webm|max:102400',
            'video_url' => 'nullable|string|max:500',
            'youtube_url' => 'nullable|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'link_label' => 'nullable|string|max:100',
            'link_label_en' => 'nullable|string|max:100',
            'artist_id' => 'nullable|exists:users,id',
            'is_active' => 'boolean',
        ]);
    }

    private function handleMediaUploads(Request $request, array $validated, ?HeroSection $existing = null): array
    {
        if ($request->hasFile('image')) {
            $this->deleteStorageFile($existing?->image_url);
            $path = $request->file('image')->store('hero-sections', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        if ($request->hasFile('image_en')) {
            $this->deleteStorageFile($existing?->image_url_en);
            $path = $request->file('image_en')->store('hero-sections', 'public');
            $validated['image_url_en'] = Storage::url($path);
        }

        if ($request->hasFile('video')) {
            $this->deleteStorageFile($existing?->video_url);
            $path = $request->file('video')->store('hero-sections/videos', 'public');
            $validated['video_url'] = Storage::url($path);
        }

        return $validated;
    }

    private function deleteStorageFile(?string $url): void
    {
        if ($url && str_contains($url, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $url));
        }
    }
}
