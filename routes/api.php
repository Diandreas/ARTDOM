<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    // Accept an FCM token from the client and store it on the authenticated user
    Route::post('/fcm-token', [NotificationController::class, 'updateToken']);
    // Endpoint to trigger a test push to the authenticated user
    Route::post('/fcm-test', [NotificationController::class, 'testPush']);
});
