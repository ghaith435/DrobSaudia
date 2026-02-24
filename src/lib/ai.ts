
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434';
const DEFAULT_MODEL = 'lfm2.5-thinking:latest';

export interface AIResponse {
    response: string;
    done: boolean;
    context?: number[];
}

export async function generateText(prompt: string, model: string = DEFAULT_MODEL): Promise<string> {
    try {
        const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`AI Service Error: ${response.statusText}`);
        }

        const data: AIResponse = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error generating text:', error);
        throw error;
    }
}

export async function generateChatResponse(messages: { role: string; content: string }[], model: string = DEFAULT_MODEL) {
    // This is for server-side non-streaming chat if needed
    try {
        const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`AI Service Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.message?.content || '';
    } catch (error) {
        console.error('Error generating chat response:', error);
        throw error;
    }
}
