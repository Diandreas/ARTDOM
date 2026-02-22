<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsClient
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        if (! $user->isClient()) {
            if ($user->isAdmin()) {
                return redirect()->route('admin.dashboard')->with('error', 'Accès réservé aux clients.');
            }

            return redirect()->route('artist.dashboard')->with('error', 'Accès réservé aux clients.');
        }

        return $next($request);
    }
}
