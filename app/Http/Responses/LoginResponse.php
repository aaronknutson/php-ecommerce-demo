<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): RedirectResponse|JsonResponse
    {
        $user = auth()->user();

        if ($user && $user->role === 'admin') {
            return redirect()->intended('/admin');
        }

        return redirect()->intended(config('fortify.home'));
    }
}
