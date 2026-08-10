import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "@/lib/axios";

type Message = {
    role: "user" | "model";
    message: string;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const send = async () => {
        if (!message.trim() || loading) return;

        const text = message;

        setMessages((previous) => [
            ...previous,
            {
                role: "user",
                message: text,
            },
        ]);

        setMessage("");
        setLoading(true);

        try {
            const { data } = await axios.post("/chat", {
                message: text,
            });

            setMessages((previous) => [
                ...previous,
                {
                    role: "model",
                    message: data.message,
                },
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen flex-col bg-zinc-950">
            <header className="border-b border-zinc-800 px-6 py-4">
                <h1 className="text-xl font-semibold text-white">
                    Discogs AI
                </h1>

                <p className="text-sm text-zinc-400">
                    Ask anything about artists, albums, labels and releases.
                </p>
            </header>

            <main className="flex-1 overflow-y-auto p-6">
                {messages.length === 0 && (
                    <div className="mt-20 text-center">
                        <h2 className="text-3xl font-bold text-white">
                            Welcome 👋
                        </h2>

                        <p className="mt-2 text-zinc-400">
                            Try asking:
                        </p>

                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <button
                                onClick={() =>
                                    setMessage(
                                        "Show me albums by Radiohead"
                                    )
                                }
                                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                            >
                                Show me albums by Radiohead
                            </button>

                            <button
                                onClick={() =>
                                    setMessage(
                                        "Search Nirvana albums"
                                    )
                                }
                                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                            >
                                Search Nirvana albums
                            </button>

                            <button
                                onClick={() =>
                                    setMessage(
                                        "What is OK Computer?"
                                    )
                                }
                                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                            >
                                What is OK Computer?
                            </button>
                        </div>
                    </div>
                )}

                <div className="mx-auto max-w-4xl space-y-6">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow ${
                                    message.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-zinc-800 text-zinc-100"
                                }`}
                            >
                                {message.role === "model" ? (
                                    <div className="prose prose-invert max-w-none">
                                        <ReactMarkdown>
                                            {message.message}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    message.message
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="rounded-2xl bg-zinc-800 px-4 py-3 text-sm text-zinc-300">
                                Gemini is thinking...
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </main>

            <footer className="border-t border-zinc-800 p-4">
                <div className="mx-auto flex max-w-4xl gap-3">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                send();
                            }
                        }}
                        placeholder="Ask about an artist or album..."
                        className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                    />

                    <button
                        onClick={send}
                        disabled={loading}
                        className="rounded-xl bg-blue-600 px-6 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </footer>
        </div>
    );
}