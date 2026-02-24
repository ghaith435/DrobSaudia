export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { queryRAG, generateEmbedding, RAGDocument } from '@/lib/ollama';
import { prisma } from '@/lib/prisma';

// GET - Query the knowledge base
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const category = searchParams.get('category');
        const topK = parseInt(searchParams.get('topK') || '5');

        if (!query) {
            return NextResponse.json(
                { error: 'Missing required parameter: q (query)' },
                { status: 400 }
            );
        }

        // Fetch documents from database
        let whereClause: Record<string, unknown> = { isActive: true };
        if (category) {
            whereClause.category = category;
        }

        const documents = await prisma.knowledgeDocument.findMany({
            where: whereClause,
            select: {
                id: true,
                title: true,
                content: true,
                category: true,
                embedding: true,
                metadata: true,
                createdAt: true,
                updatedAt: true
            }
        });

        // Convert to RAGDocument format
        const ragDocs: RAGDocument[] = documents.map(doc => ({
            id: doc.id,
            title: doc.title,
            content: doc.content,
            category: doc.category,
            embedding: doc.embedding ? JSON.parse(doc.embedding) : undefined,
            metadata: doc.metadata ? JSON.parse(doc.metadata as string) : {},
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        }));

        const result = await queryRAG(query, ragDocs, topK);

        return NextResponse.json({
            success: true,
            query,
            result
        });
    } catch (error) {
        console.error('RAG query error:', error);
        return NextResponse.json(
            { error: 'Failed to query knowledge base', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// POST - Add document to knowledge base
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.content || !body.category) {
            return NextResponse.json(
                { error: 'Missing required fields: title, content, category' },
                { status: 400 }
            );
        }

        // Generate embedding for the document
        let embedding: number[] | null = null;
        try {
            embedding = await generateEmbedding(body.content);
        } catch (embError) {
            console.warn('Failed to generate embedding:', embError);
            // Continue without embedding - can be generated later
        }

        // Create document in database
        const document = await prisma.knowledgeDocument.create({
            data: {
                title: body.title,
                titleAr: body.titleAr,
                content: body.content,
                contentAr: body.contentAr,
                category: body.category,
                tags: body.tags || [],
                source: body.source,
                sourceUrl: body.sourceUrl,
                embedding: embedding ? JSON.stringify(embedding) : null,
                metadata: body.metadata ? JSON.stringify(body.metadata) : null,
                isActive: true,
                createdBy: body.createdBy || 'system'
            }
        });

        return NextResponse.json({
            success: true,
            document: {
                id: document.id,
                title: document.title,
                category: document.category,
                hasEmbedding: !!embedding
            }
        });
    } catch (error) {
        console.error('RAG document creation error:', error);
        return NextResponse.json(
            { error: 'Failed to add document to knowledge base', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// DELETE - Remove document from knowledge base
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Missing required parameter: id' },
                { status: 400 }
            );
        }

        await prisma.knowledgeDocument.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        console.error('RAG document deletion error:', error);
        return NextResponse.json(
            { error: 'Failed to delete document', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// PATCH - Update document and regenerate embedding
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json(
                { error: 'Missing required field: id' },
                { status: 400 }
            );
        }

        // Build update data
        const updateData: Record<string, unknown> = {};

        if (body.title) updateData.title = body.title;
        if (body.titleAr) updateData.titleAr = body.titleAr;
        if (body.content) updateData.content = body.content;
        if (body.contentAr) updateData.contentAr = body.contentAr;
        if (body.category) updateData.category = body.category;
        if (body.tags) updateData.tags = body.tags;
        if (body.source) updateData.source = body.source;
        if (body.sourceUrl) updateData.sourceUrl = body.sourceUrl;
        if (body.metadata) updateData.metadata = JSON.stringify(body.metadata);
        if (typeof body.isActive === 'boolean') updateData.isActive = body.isActive;

        // Regenerate embedding if content changed
        if (body.content) {
            try {
                const embedding = await generateEmbedding(body.content);
                updateData.embedding = JSON.stringify(embedding);
            } catch (embError) {
                console.warn('Failed to regenerate embedding:', embError);
            }
        }

        const document = await prisma.knowledgeDocument.update({
            where: { id: body.id },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            document: {
                id: document.id,
                title: document.title,
                category: document.category,
                updatedAt: document.updatedAt
            }
        });
    } catch (error) {
        console.error('RAG document update error:', error);
        return NextResponse.json(
            { error: 'Failed to update document', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
