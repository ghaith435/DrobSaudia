import { NextResponse } from 'next/server';
import { checkOllamaStatus } from '@/lib/ollama';

export async function GET() {
    try {
        const status = await checkOllamaStatus();
        return NextResponse.json({
            ollama: status,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json({
            ollama: { 
                available: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
            },
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
