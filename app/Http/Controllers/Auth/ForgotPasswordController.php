<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ForgotPasswordController extends Controller
{
    /**
     * Affiche le formulaire de mot de passe oublié
     * 
     * Route: GET /forgot-password
     * 
     * Retourne la page Inertia 'Auth/ForgotPassword'
     */
    public function showForm(): Response
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    /**
     * Envoie un code OTP par SMS/Email
     * 
     * Route: POST /forgot-password
     * 
     * Logique:
     * 1. Valide l'email ou le téléphone
     * 2. Génère un code OTP à 6 chiffres
     * 3. Stocke le code en cache (expire dans 5 minutes)
     * 4. Envoie le code par SMS ou Email
     * 5. Redirige vers la page de vérification OTP
     */
    public function sendOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required_without:phone', 'email', 'exists:users,email'],
            'phone' => ['required_without:email', 'string', 'exists:users,phone'],
        ]);

        $field = $request->filled('email') ? 'email' : 'phone';
        $value = $request->input($field);

        // Générer un code OTP à 6 chiffres
        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Stocker le code en cache (expire dans 5 minutes)
        $cacheKey = "password_reset_otp_{$value}";
        Cache::put($cacheKey, $otp, now()->addMinutes(5));

        // TODO: Envoyer le code par SMS ou Email
        // Pour l'instant, on peut logger le code pour le développement
        \Log::info("OTP pour {$value}: {$otp}");

        // Rediriger vers la page de vérification OTP
        return redirect()->route('verify-otp.show')->with([
            'field' => $field,
            'value' => $value,
            'message' => 'Un code de vérification a été envoyé à votre '.($field === 'email' ? 'email' : 'téléphone'),
        ]);
    }

    /**
     * Affiche le formulaire de vérification OTP
     * 
     * Route: GET /verify-otp
     */
    public function showVerifyOtpForm(): Response
    {
        return Inertia::render('Auth/VerifyOtp');
    }

    /**
     * Vérifie le code OTP et génère un token de réinitialisation
     * 
     * Route: POST /verify-otp
     * 
     * Logique:
     * 1. Valide le code OTP
     * 2. Vérifie que le code correspond à celui en cache
     * 3. Génère un token de réinitialisation Laravel
     * 4. Redirige vers la page de réinitialisation avec le token
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'field' => ['required', 'in:email,phone'],
            'value' => ['required', 'string'],
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $cacheKey = "password_reset_otp_{$request->value}";
        $storedOtp = Cache::get($cacheKey);

        if (!$storedOtp || $storedOtp !== $request->otp) {
            throw ValidationException::withMessages([
                'otp' => 'Le code OTP est invalide ou a expiré.',
            ]);
        }

        // Trouver l'utilisateur
        $user = User::where($request->field, $request->value)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'value' => 'Utilisateur non trouvé.',
            ]);
        }

        // Générer un token de réinitialisation Laravel
        $token = Password::createToken($user);

        // Supprimer le code OTP du cache
        Cache::forget($cacheKey);

        // Rediriger vers la page de réinitialisation
        return redirect()->route('reset-password.show', [
            'token' => $token,
            'email' => $user->email,
        ]);
    }

    /**
     * Affiche le formulaire de réinitialisation du mot de passe
     * 
     * Route: GET /reset-password
     */
    public function showResetForm(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $request->token,
            'email' => $request->email,
        ]);
    }

    /**
     * Réinitialise le mot de passe
     * 
     * Route: POST /reset-password
     * 
     * Logique:
     * 1. Valide le token et le nouveau mot de passe
     * 2. Met à jour le mot de passe de l'utilisateur
     * 3. Supprime le token
     * 4. Redirige vers la page de connexion
     */
    public function resetPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        // Utiliser le système de réinitialisation de mot de passe de Laravel
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return redirect()->route('login')->with('status', 'Votre mot de passe a été réinitialisé avec succès.');
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }
}
