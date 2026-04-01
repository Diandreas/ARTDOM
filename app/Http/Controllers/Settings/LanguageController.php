<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateLanguageRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Cookie;

class LanguageController extends Controller
{
    public function update(UpdateLanguageRequest $request): RedirectResponse
    {
        $locale = $request->validated('locale');

        App::setLocale($locale);
        $request->session()->put('locale', $locale);

        return back()
            ->withCookie(cookie(
                'locale',
                $locale,
                60 * 24 * 365,
                secure: $request->isSecure(),
                sameSite: Cookie::SAMESITE_LAX,
            ))
            ->with('success', __('Language updated successfully.'));
    }
}
