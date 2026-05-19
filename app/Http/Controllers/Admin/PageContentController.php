<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PageContentController extends Controller
{
    public function edit(string $slug): Response
    {
        $page = PageContent::where('slug', $slug)->firstOrFail();

        return Inertia::render('Admin/PageContent', [
            'page' => $page,
        ]);
    }

    public function update(Request $request, string $slug): RedirectResponse
    {
        $page = PageContent::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'title_fr' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'content_fr' => 'required|string',
            'content_en' => 'required|string',
            'image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($page->image_url && str_contains($page->image_url, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $page->image_url));
            }
            $path = $request->file('image')->store('pages', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        unset($validated['image']);
        $page->update($validated);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Page mise à jour avec succès',
        ]);
    }
}
