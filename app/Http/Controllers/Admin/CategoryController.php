<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Categories', [
            'categories' => Category::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|max:100|unique:categories,slug',
            'label_fr' => 'required|string|max:100',
            'label_en' => 'required|string|max:100',
            'icon' => 'nullable|string|max:10',
        ]);

        $validated['order'] = Category::max('order') + 1;
        Category::create($validated);

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Catégorie créée']);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|max:100|unique:categories,slug,'.$category->id,
            'label_fr' => 'required|string|max:100',
            'label_en' => 'required|string|max:100',
            'icon' => 'nullable|string|max:10',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Catégorie mise à jour']);
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Catégorie supprimée']);
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate(['categories' => 'required|array']);

        foreach ($request->categories as $index => $id) {
            Category::where('id', $id)->update(['order' => $index + 1]);
        }

        return redirect()->back();
    }
}
