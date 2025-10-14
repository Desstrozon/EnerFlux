<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (empty($roles)) $roles = ['administrador'];

        $user    = $request->user();
        $current = strtolower((string) optional($user)->rol);
        $allowed = array_map('strtolower', $roles);

        if (!$user || !in_array($current, $allowed, true)) {
            abort(403, 'Acceso no autorizado.');
        }

        return $next($request);
    }
}
