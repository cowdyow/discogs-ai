<?php

namespace App\Services;

use App\Models\ChatMessage;

class ChatService
{
    public function __construct(
        private GeminiService $gemini,
    ) {
    }

     public function send(string $message): string
    {
        ChatMessage::create([
            'role' => 'user',
            'message' => $message,
        ]);

        $messages = ChatMessage::orderBy('id')
            ->get()
            ->map(fn (ChatMessage $message) => [
                'role' => $message->role,
                'content' => $message->message,
            ])
            ->toArray();

        $reply = $this->gemini->chat($messages);

        ChatMessage::create([
            'role' => 'model',
            'message' => $reply,
        ]);

        return $reply;
    }

    public function history()
    {
        return ChatMessage::orderBy('id')->get();
    }

    public function clear(): void
    {
        ChatMessage::truncate();
    }
}