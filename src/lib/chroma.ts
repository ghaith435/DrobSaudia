import { ChromaClient, Collection } from 'chromadb';

// ChromaDB client for RAG (Retrieval-Augmented Generation)
const chromaUrl = process.env.CHROMA_URL || 'http://localhost:8000';

let client: ChromaClient;

try {
    client = new ChromaClient({
        path: chromaUrl,
    });
} catch {
    console.warn('⚠️ ChromaDB not available. RAG features will use fallback.');
    client = null as any;
}

// Collection names
export const COLLECTIONS = {
    PLACES: 'riyadh_places',
    TOURS: 'riyadh_tours',
    HISTORY: 'riyadh_history',
    FAQ: 'riyadh_faq',
    REVIEWS: 'riyadh_reviews',
    KNOWLEDGE: 'riyadh_knowledge',
} as const;

// Get or create a collection
export async function getCollection(name: string): Promise<Collection | null> {
    if (!client) return null;

    try {
        const collection = await client.getOrCreateCollection({
            name,
            metadata: {
                'hnsw:space': 'cosine',
                description: `Riyadh Guide - ${name}`,
            },
        });
        return collection;
    } catch (error) {
        console.error(`ChromaDB: Failed to get collection ${name}:`, error);
        return null;
    }
}

// Add documents to a collection
export async function addDocuments(
    collectionName: string,
    documents: {
        id: string;
        text: string;
        metadata?: Record<string, string | number | boolean>;
    }[]
): Promise<boolean> {
    const collection = await getCollection(collectionName);
    if (!collection) return false;

    try {
        await collection.add({
            ids: documents.map((d) => d.id),
            documents: documents.map((d) => d.text),
            metadatas: documents.map((d) => d.metadata || {}),
        });
        return true;
    } catch (error) {
        console.error('ChromaDB: Failed to add documents:', error);
        return false;
    }
}

// Query similar documents
export async function queryDocuments(
    collectionName: string,
    queryText: string,
    nResults = 5,
    filter?: Record<string, unknown>
): Promise<{
    ids: string[];
    documents: string[];
    distances: number[];
    metadatas: Record<string, unknown>[];
} | null> {
    const collection = await getCollection(collectionName);
    if (!collection) return null;

    try {
        const results = await collection.query({
            queryTexts: [queryText],
            nResults,
            ...(filter ? { where: filter as any } : {}),
        });

        return {
            ids: (results.ids[0] || []) as string[],
            documents: (results.documents[0] || []) as string[],
            distances: (results.distances?.[0] || []) as number[],
            metadatas: (results.metadatas?.[0] || []) as Record<string, unknown>[],
        };
    } catch (error) {
        console.error('ChromaDB: Query failed:', error);
        return null;
    }
}

// Delete documents
export async function deleteDocuments(
    collectionName: string,
    ids: string[]
): Promise<boolean> {
    const collection = await getCollection(collectionName);
    if (!collection) return false;

    try {
        await collection.delete({ ids });
        return true;
    } catch (error) {
        console.error('ChromaDB: Delete failed:', error);
        return false;
    }
}

// Seed initial knowledge base
export async function seedKnowledgeBase(): Promise<void> {
    const knowledgeDocs = [
        {
            id: 'diriyah-overview',
            text: 'الدرعية هي مدينة تاريخية تقع شمال غرب الرياض، وهي مسقط رأس الدولة السعودية الأولى. تأسست عام 1446م وكانت عاصمة الدولة السعودية الأولى. تضم حي الطريف المسجل في قائمة اليونسكو للتراث العالمي. تحتوي على قصور تاريخية ومتاحف ومساجد قديمة.',
            metadata: { category: 'history', city: 'riyadh', place: 'diriyah', language: 'ar' },
        },
        {
            id: 'kingdom-tower',
            text: 'برج المملكة (Kingdom Centre) هو ناطحة سحاب تقع في الرياض بارتفاع 302 متر. يحتوي على جسر سماوي على شكل قوس مقلوب في أعلى البرج يوفر إطلالة بانورامية على المدينة. يضم مركز تسوق فاخر ومكاتب وشقق فندقية.',
            metadata: { category: 'landmarks', city: 'riyadh', place: 'kingdom-tower', language: 'ar' },
        },
        {
            id: 'riyadh-season',
            text: 'موسم الرياض هو أكبر فعالية ترفيهية في المملكة العربية السعودية، يُقام سنوياً ويضم مناطق ترفيه متعددة مثل بوليفارد الرياض وبوليفارد ووك وونتر وندرلاند. يستقطب ملايين الزوار من داخل وخارج المملكة.',
            metadata: { category: 'events', city: 'riyadh', place: 'riyadh-season', language: 'ar' },
        },
        {
            id: 'edge-of-world',
            text: 'حافة العالم (Jebel Fihrayn) هي منحدر صخري مذهل يبعد حوالي 90 كم شمال غرب الرياض. يوفر إطلالات خلابة على سهول واسعة تمتد حتى الأفق. يُعد من أفضل أماكن الطبيعة والمغامرة في المملكة. يُنصح بالزيارة في فصل الشتاء.',
            metadata: { category: 'nature', city: 'riyadh', place: 'edge-of-world', language: 'ar' },
        },
        {
            id: 'national-museum',
            text: 'المتحف الوطني السعودي يقع في حي المربع بالرياض ويُعد من أهم المتاحف في المملكة. افتُتح عام 1999م ويضم 8 قاعات عرض تروي تاريخ الجزيرة العربية من عصور ما قبل التاريخ إلى العصر الحديث. يحتوي على قطع أثرية نادرة ومجسمات تفاعلية.',
            metadata: { category: 'museum', city: 'riyadh', place: 'national-museum', language: 'ar' },
        },
        {
            id: 'masmak-fortress',
            text: 'قصر المصمك هو حصن مبني من الطوب اللبن يقع في وسط الرياض القديمة. شهد معركة فتح الرياض عام 1902م على يد الملك عبدالعزيز آل سعود، وهي الحدث المؤسس للدولة السعودية الحديثة. تحول الآن إلى متحف يروي قصة توحيد المملكة.',
            metadata: { category: 'history', city: 'riyadh', place: 'masmak', language: 'ar' },
        },
    ];

    await addDocuments(COLLECTIONS.KNOWLEDGE, knowledgeDocs);
    console.log('✅ Knowledge base seeded with', knowledgeDocs.length, 'documents');
}

export { client as chromaClient };
