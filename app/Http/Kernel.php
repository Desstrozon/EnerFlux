<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * Middleware globales para todas las rutas.
     */
    protected $middleware = [
        \Illuminate\Http\Middleware\HandleCors::class,
    ];

    /**
     * Grupos de middleware.
     */
    protected $middlewareGroups = [
        'web' => [
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
        'api' => [
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    /**
     * ⭐ Alias de middleware para usar por nombre en las rutas (Laravel 11).
     */
    protected $middlewareAliases = [
        'auth'     => \Illuminate\Auth\Middleware\Authenticate::class,
        'signed'   => \Illuminate\Routing\Middleware\ValidateSignature::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,

        // Tu middleware de rol:
        'admin'    => \App\Http\Middleware\EnsureRole::class,
    ];
}
