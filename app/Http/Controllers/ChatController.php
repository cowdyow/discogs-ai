<?php

namespace App\Http\Controllers;

use App\Services\ChatService;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index()
    {
        return inertia('chat/index');
    }

     public function store(Request $request, ChatService $chatService)
    {
        $validated = $request->validate([
            'message' => ['required', 'string'],
        ]);

        $reply = $chatService->send($validated['message']);

        return response()->json([
            'message' => $reply,
        ]);
    }
    
}
