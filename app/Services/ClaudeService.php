<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ClaudeService
{
    public function chat(string $message): string
    {
        $response = Http::withHeaders([
            'x-api-key' => config('services.anthropic.key'),
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])->post('https://api.anthropic.com/v1/messages', [
            'model' => 'claude-sonnet-4',
            'max_tokens' => 1024,
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $message,
                ],
            ],
        ]);

        $response->throw();

        return $response->json('content.0.text');
    }
}