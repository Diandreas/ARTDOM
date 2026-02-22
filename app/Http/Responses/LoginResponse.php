<?php

namespace App\Http\Responses;

use App\Actions\Fortify\RedirectAuthenticatedUser;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request): RedirectResponse
    {
        return redirect()->intended(RedirectAuthenticatedUser::redirectPath());
    }
}
