"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./knowledge.module.css";

interface Document {
    id: string;
    title: string;
    titleAr?: string;
    content: string;
    contentAr?: string;
    category: string;
    tags: string[];
    source?: string;
    sourceUrl?: string;
    hasEmbedding: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function KnowledgeLibraryPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [testQuery, setTestQuery] = useState('');
    const [testResult, setTestResult] = useState<{
        answer?: string;
        sources?: Array<{ title: string; score: number; relevantContent: string }>;
    } | null>(null);
    const [isTesting, setIsTesting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        titleAr: '',
        content: '',
        contentAr: '',
        category: 'general',
        tags: '',
        source: '',
        sourceUrl: ''
    });

    const categories = [
        { id: 'general', name: 'عام', nameEn: 'General' },
        { id: 'places', name: 'أماكن سياحية', nameEn: 'Tourist Places' },
        { id: 'history', name: 'تاريخ', nameEn: 'History' },
        { id: 'culture', name: 'ثقافة', nameEn: 'Culture' },
        { id: 'events', name: 'فعاليات', nameEn: 'Events' },
        { id: 'tips', name: 'نصائح', nameEn: 'Tips' },
        { id: 'restaurants', name: 'مطاعم', nameEn: 'Restaurants' },
        { id: 'transportation', name: 'مواصلات', nameEn: 'Transportation' }
    ];

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/knowledge');
            if (response.ok) {
                const data = await response.json();
                setDocuments(data.documents || []);
            }
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            const method = selectedDoc ? 'PATCH' : 'POST';
            const body = selectedDoc
                ? { ...formData, id: selectedDoc.id, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) }
                : { ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) };

            const response = await fetch('/api/ai/rag', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                fetchDocuments();
                closeModal();
            }
        } catch (error) {
            console.error('Failed to save document:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا المستند؟')) return;

        try {
            const response = await fetch(`/api/ai/rag?id=${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchDocuments();
            }
        } catch (error) {
            console.error('Failed to delete document:', error);
        }
    };

    const handleTestRAG = async () => {
        if (!testQuery.trim()) return;

        setIsTesting(true);
        try {
            const response = await fetch(`/api/ai/rag?q=${encodeURIComponent(testQuery)}`);
            if (response.ok) {
                const data = await response.json();
                setTestResult(data.result);
            }
        } catch (error) {
            console.error('RAG test failed:', error);
        } finally {
            setIsTesting(false);
        }
    };

    const openModal = (doc?: Document) => {
        if (doc) {
            setSelectedDoc(doc);
            setFormData({
                title: doc.title,
                titleAr: doc.titleAr || '',
                content: doc.content,
                contentAr: doc.contentAr || '',
                category: doc.category,
                tags: doc.tags.join(', '),
                source: doc.source || '',
                sourceUrl: doc.sourceUrl || ''
            });
        } else {
            setSelectedDoc(null);
            setFormData({
                title: '',
                titleAr: '',
                content: '',
                contentAr: '',
                category: 'general',
                tags: '',
                source: '',
                sourceUrl: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDoc(null);
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !filterCategory || doc.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className={styles.page} dir="rtl">
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>📚 مكتبة المعارف (RAG)</h1>
                    <p>إدارة قاعدة المعرفة لتعليم وتدريب المرشد الذكي</p>
                </div>
                <button className={styles.addBtn} onClick={() => openModal()}>
                    ➕ إضافة مستند
                </button>
            </header>

            {/* Stats */}
            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>📄</span>
                    <div>
                        <span className={styles.statValue}>{documents.length}</span>
                        <span className={styles.statLabel}>إجمالي المستندات</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>🧠</span>
                    <div>
                        <span className={styles.statValue}>
                            {documents.filter(d => d.hasEmbedding).length}
                        </span>
                        <span className={styles.statLabel}>مستندات مُعيَّنة</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>📁</span>
                    <div>
                        <span className={styles.statValue}>
                            {new Set(documents.map(d => d.category)).size}
                        </span>
                        <span className={styles.statLabel}>الفئات</span>
                    </div>
                </div>
            </div>

            <div className={styles.mainContent}>
                {/* Documents Section */}
                <section className={styles.documentsSection}>
                    {/* Filters */}
                    <div className={styles.filters}>
                        <input
                            type="text"
                            placeholder="🔍 بحث في المستندات..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className={styles.categorySelect}
                        >
                            <option value="">جميع الفئات</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Documents List */}
                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>جاري التحميل...</p>
                        </div>
                    ) : filteredDocuments.length === 0 ? (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>📭</span>
                            <p>لا توجد مستندات</p>
                            <button onClick={() => openModal()}>إضافة أول مستند</button>
                        </div>
                    ) : (
                        <div className={styles.documentsList}>
                            {filteredDocuments.map(doc => (
                                <div key={doc.id} className={styles.documentCard}>
                                    <div className={styles.docHeader}>
                                        <h3>{doc.title}</h3>
                                        <span className={`${styles.badge} ${doc.hasEmbedding ? styles.active : styles.inactive}`}>
                                            {doc.hasEmbedding ? '🧠 مُعيَّن' : '⏳ بانتظار التضمين'}
                                        </span>
                                    </div>
                                    <p className={styles.docContent}>{doc.content.slice(0, 150)}...</p>
                                    <div className={styles.docMeta}>
                                        <span className={styles.docCategory}>
                                            {categories.find(c => c.id === doc.category)?.name || doc.category}
                                        </span>
                                        {doc.tags.length > 0 && (
                                            <div className={styles.docTags}>
                                                {doc.tags.slice(0, 3).map((tag, i) => (
                                                    <span key={i} className={styles.tag}>{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.docActions}>
                                        <button onClick={() => openModal(doc)}>✏️ تعديل</button>
                                        <button onClick={() => handleDelete(doc.id)} className={styles.deleteBtn}>
                                            🗑️ حذف
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* RAG Test Section */}
                <section className={styles.testSection}>
                    <h2>🧪 اختبار قاعدة المعرفة</h2>
                    <p>اختبر استجابة النظام للأسئلة باستخدام المستندات المحملة</p>

                    <div className={styles.testInput}>
                        <textarea
                            placeholder="اكتب سؤالاً لاختبار قاعدة المعرفة..."
                            value={testQuery}
                            onChange={(e) => setTestQuery(e.target.value)}
                            rows={3}
                        />
                        <button
                            onClick={handleTestRAG}
                            disabled={isTesting || !testQuery.trim()}
                        >
                            {isTesting ? '⏳ جاري الاختبار...' : '🔍 اختبار'}
                        </button>
                    </div>

                    {testResult && (
                        <div className={styles.testResult}>
                            <h3>📝 النتيجة:</h3>
                            <div className={styles.resultAnswer}>
                                {testResult.answer}
                            </div>
                            {testResult.sources && testResult.sources.length > 0 && (
                                <div className={styles.resultSources}>
                                    <h4>📚 المصادر:</h4>
                                    {testResult.sources.map((source, i) => (
                                        <div key={i} className={styles.sourceItem}>
                                            <span className={styles.sourceTitle}>{source.title}</span>
                                            <span className={styles.sourceScore}>
                                                {(source.score * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{selectedDoc ? '✏️ تعديل المستند' : '➕ إضافة مستند جديد'}</h2>
                            <button onClick={closeModal} className={styles.closeBtn}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>العنوان (إنجليزي)</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>العنوان (عربي)</label>
                                    <input
                                        type="text"
                                        value={formData.titleAr}
                                        onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>المحتوى (إنجليزي) *</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={6}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>المحتوى (عربي)</label>
                                <textarea
                                    value={formData.contentAr}
                                    onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                                    rows={6}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>الفئة</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>الوسوم (مفصولة بفاصلة)</label>
                                    <input
                                        type="text"
                                        placeholder="تاريخ, ثقافة, الدرعية"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>المصدر</label>
                                    <input
                                        type="text"
                                        placeholder="مثال: وزارة السياحة"
                                        value={formData.source}
                                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>رابط المصدر</label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        value={formData.sourceUrl}
                                        onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" onClick={closeModal} className={styles.cancelBtn}>
                                    إلغاء
                                </button>
                                <button type="submit" disabled={isUploading} className={styles.submitBtn}>
                                    {isUploading ? '⏳ جاري الحفظ...' : selectedDoc ? '💾 حفظ التعديلات' : '➕ إضافة المستند'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
