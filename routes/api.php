<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

// ==========================
// 🔐 AUTENTICACIÓN
// ==========================
Route::post('/login',  [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// (Opcional) Datos del usuario autenticado
// Route::middleware('auth:sanctum')->get('/me', fn(\Illuminate\Http\Request $r) => $r->user());

// ==========================
// 🧑‍💼 RUTAS SOLO ADMIN
// ==========================
// Grupo SOLO admin: usamos la CLASE del middleware directamente
Route::middleware([
    'auth:sanctum',
    \App\Http\Middleware\EnsureRole::class, // 👈 sin alias
])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/vendedores', [UserController::class, 'vendedores']);
    Route::put('/users/{id}', [UserController::class, 'update']);     // opcional
    Route::delete('/users/{id}', [UserController::class, 'destroy']); // opcional
});


