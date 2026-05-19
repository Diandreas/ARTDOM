<?php

namespace App\Http\Controllers;

use App\Models\PageContent;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function impactSocial(): Response
    {
        $page = PageContent::where('slug', 'impact-social')->firstOrFail();

        return Inertia::render('ImpactSocial', ['page' => $page]);
    }

    public function aPropos(): Response
    {
        $page = PageContent::where('slug', 'a-propos')->firstOrFail();

        return Inertia::render('APropos', ['page' => $page]);
    }
}
