export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        const response = await fetch('http://127.0.0.1:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'lfm2.5-thinking:latest',
                messages: messages,
                stream: true,
            }),
        });

        if (!response.ok) {
            console.error('Ollama API error:', response.statusText);
            return NextResponse.json(
                { error: `Ollama API error: ${response.statusText}` },
                { status: response.status }
            );
        }

        // Return the stream directly
        return new NextResponse(response.body, {
            headers: {
                'Content-Type': 'application/x-ndjson',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('Error in chat route:', error);
        return NextResponse.json(
            { error: 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
