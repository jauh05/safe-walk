<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('api.auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/guardians', [DashboardController::class, 'addGuardian']);
    Route::delete('/guardians/{id}', [DashboardController::class, 'deleteGuardian']);
    Route::post('/journeys', [DashboardController::class, 'addJourney']);
    Route::post('/alerts/idle-whatsapp', [DashboardController::class, 'sendIdleAlertWhatsApp']);
});
