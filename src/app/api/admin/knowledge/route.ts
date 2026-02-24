import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List all knowledge documents
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const whereClause: Record<string, unknown> = {};

        if (category) {
            whereClause.category = category;
        }

        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { tags: { hasSome: [search] } }
            ];
        }

        const [documents, total] = await Promise.all([
            prisma.knowledgeDocument.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    titleAr: true,
                    content: true,
                    contentAr: true,
                    category: true,
                    tags: true,
                    source: true,
                    sourceUrl: true,
                    embedding: true,
                    isActive: true,
                    createdBy: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),
            prisma.knowledgeDocument.count({ where: whereClause })
        ]);

        const formattedDocuments = documents.map(doc => ({
            ...doc,
            hasEmbedding: !!doc.embedding,
            embedding: undefined // Don't send embedding data to client
        }));

        return NextResponse.json({
            success: true,
            documents: formattedDocuments,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Knowledge documents fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch documents', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// POST - Bulk upload documents
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (Array.isArray(body.documents)) {
            // Bulk upload
            const results = await Promise.all(
                body.documents.map(async (doc: Record<string, unknown>) => {
                    try {
                        const created = await prisma.knowledgeDocument.create({
                            data: {
                                title: doc.title as string,
                                titleAr: doc.titleAr as string | undefined,
                                content: doc.content as string,
                                contentAr: doc.contentAr as string | undefined,
                                category: doc.category as string || 'general',
                                tags: doc.tags as string[] || [],
                                source: doc.source as string | undefined,
                                sourceUrl: doc.sourceUrl as string | undefined,
                                isActive: true,
                                createdBy: doc.createdBy as string || 'admin'
                            }
                        });
                        return { success: true, id: created.id, title: created.title };
                    } catch (err) {
                        return { success: false, title: doc.title, error: (err as Error).message };
                    }
                })
            );

            return NextResponse.json({
                success: true,
                results,
                imported: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length
            });
        }

        return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    } catch (error) {
        console.error('Bulk upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload documents', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
