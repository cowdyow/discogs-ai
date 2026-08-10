<?php

use App\Http\Controllers\ChatController;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

   /*  Route::get('/test-gemini', function () {

        $response = Gemini::generativeModel('gemini-2.5-flash')
            ->generateContent('Say hello.');

        return $response->text();
    }); */
    Route::get('/chat', [ChatController::class, 'index'])
        ->name('chat.index');

    Route::post('/chat', [ChatController::class, 'store']);


});

require __DIR__.'/settings.php';
