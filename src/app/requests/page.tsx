"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./requests.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Request {
    id: string;
    type: string;
    title: string;
    content: string;
    status: string;
    priority: string;
    createdAt: string;
    response?: string;
}

export default function RequestsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        type: "SUGGESTION",
        title: "",
        content: "",
        priority: "NORMAL",
    });

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);
    }, []);

    useEffect(() => {
        if (status === "unauthenticated") {
            sessionStorage.setItem('redirectAfterLogin', '/requests');
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user && activeTab === 'history') {
            fetchRequests();
        }
    }, [session, activeTab]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/requests");
            if (response.ok) {
                const data = await response.json();
                setRequests(data.requests || []);
            }
        } catch (err) {
            console.error("Failed to fetch requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const t = {
        ar: {
            title: "الطلبات والمقترحات",
            subtitle: "نحن نقدر ملاحظاتك ومقترحاتك",
            newRequest: "طلب جديد",
            history: "سجل الطلبات",
            type: "نوع الطلب",
            typeLabel: "اختر نوع الطلب",
            requestTitle: "عنوان الطلب",
            titlePlaceholder: "اكتب عنوان مختصر للطلب",
            content: "تفاصيل الطلب",
            contentPlaceholder: "اكتب تفاصيل طلبك أو مقترحك هنا...",
            priority: "الأولوية",
            submit: "إرسال الطلب",
            submitting: "جاري الإرسال...",
            success: "تم إرسال طلبك بنجاح! سنتواصل معك قريباً.",
            error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
            noRequests: "لا توجد طلبات سابقة",
            status: "الحالة",
            date: "التاريخ",
            response: "الرد",
            types: {
                SUGGESTION: "اقتراح",
                COMPLAINT: "شكوى",
                INQUIRY: "استفسار",
                SUPPORT: "دعم فني",
                BOOKING: "حجز",
                AUDIO_GUIDE: "طلب دليل صوتي",
                TRIP_PLAN: "خطة رحلة",
            },
            priorities: {
                LOW: "منخفضة",
                NORMAL: "عادية",
                HIGH: "مرتفعة",
                URGENT: "عاجلة",
            },
            statuses: {
                PENDING: "قيد الانتظار",
                IN_PROGRESS: "قيد المعالجة",
                COMPLETED: "مكتمل",
                CANCELLED: "ملغي",
                REJECTED: "مرفوض",
            },
            loginRequired: "يجب تسجيل الدخول للوصول لهذه الصفحة",
        },
        en: {
            title: "Requests & Suggestions",
            subtitle: "We value your feedback and suggestions",
            newRequest: "New Request",
            history: "Request History",
            type: "Request Type",
            typeLabel: "Select request type",
            requestTitle: "Request Title",
            titlePlaceholder: "Write a brief title for your request",
            content: "Request Details",
            contentPlaceholder: "Write the details of your request or suggestion here...",
            priority: "Priority",
            submit: "Submit Request",
            submitting: "Submitting...",
            success: "Your request has been submitted successfully! We'll contact you soon.",
            error: "An error occurred. Please try again.",
            noRequests: "No previous requests",
            status: "Status",
            date: "Date",
            response: "Response",
            types: {
                SUGGESTION: "Suggestion",
                COMPLAINT: "Complaint",
                INQUIRY: "Inquiry",
                SUPPORT: "Technical Support",
                BOOKING: "Booking",
                AUDIO_GUIDE: "Audio Guide Request",
                TRIP_PLAN: "Trip Plan",
            },
            priorities: {
                LOW: "Low",
                NORMAL: "Normal",
                HIGH: "High",
                URGENT: "Urgent",
            },
            statuses: {
                PENDING: "Pending",
                IN_PROGRESS: "In Progress",
                COMPLETED: "Completed",
                CANCELLED: "Cancelled",
                REJECTED: "Rejected",
            },
            loginRequired: "Please login to access this page",
        },
    };

    const labels = t[locale];
    const isRTL = locale === 'ar';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess(false);

        try {
            const response = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(true);
                setFormData({
                    type: "SUGGESTION",
                    title: "",
                    content: "",
                    priority: "NORMAL",
                });
                // Refresh history if on that tab
                if (activeTab === 'history') {
                    fetchRequests();
                }
            } else {
                setError(labels.error);
            }
        } catch {
            setError(labels.error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#22c55e';
            case 'IN_PROGRESS': return '#3b82f6';
            case 'PENDING': return '#f59e0b';
            case 'REJECTED': return '#ef4444';
            case 'CANCELLED': return '#6b7280';
            default: return '#94a3b8';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'URGENT': return '🔴';
            case 'HIGH': return '🟠';
            case 'NORMAL': return '🟡';
            case 'LOW': return '🟢';
            default: return '⚪';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'SUGGESTION': return '💡';
            case 'COMPLAINT': return '⚠️';
            case 'INQUIRY': return '❓';
            case 'SUPPORT': return '🔧';
            case 'BOOKING': return '📅';
            case 'AUDIO_GUIDE': return '🎧';
            case 'TRIP_PLAN': return '🗺️';
            default: return '📝';
        }
    };

    if (status === "loading") {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className={styles.loadingContainer} dir={isRTL ? 'rtl' : 'ltr'}>
                <div className={styles.authCard}>
                    <span className={styles.authIcon}>🔒</span>
                    <p>{labels.loginRequired}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page} dir={isRTL ? 'rtl' : 'ltr'}>
            <Navbar />

            <main className={styles.main}>
                {/* Background */}
                <div className={styles.bgDecor}></div>

                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        <span className={styles.icon}>💬</span>
                        {labels.title}
                    </h1>
                    <p className={styles.subtitle}>{labels.subtitle}</p>
                </header>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'new' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('new')}
                    >
                        ✏️ {labels.newRequest}
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'history' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        📋 {labels.history}
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {activeTab === 'new' ? (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            {success && (
                                <div className={styles.success}>
                                    ✅ {labels.success}
                                </div>
                            )}
                            {error && (
                                <div className={styles.error}>
                                    ⚠️ {error}
                                </div>
                            )}

                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <label>{labels.type}</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        {Object.entries(labels.types).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {getTypeIcon(key)} {value}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>{labels.priority}</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        {Object.entries(labels.priorities).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {getPriorityIcon(key)} {value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>{labels.requestTitle}</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder={labels.titlePlaceholder}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>{labels.content}</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder={labels.contentPlaceholder}
                                    rows={6}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={submitting}
                            >
                                {submitting ? labels.submitting : labels.submit}
                            </button>
                        </form>
                    ) : (
                        <div className={styles.historySection}>
                            {loading ? (
                                <div className={styles.loadingSpinner}>
                                    <div className={styles.spinner}></div>
                                </div>
                            ) : requests.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <span className={styles.emptyIcon}>📭</span>
                                    <p>{labels.noRequests}</p>
                                </div>
                            ) : (
                                <div className={styles.requestsList}>
                                    {requests.map((request) => (
                                        <div key={request.id} className={styles.requestCard}>
                                            <div className={styles.requestHeader}>
                                                <span className={styles.requestType}>
                                                    {getTypeIcon(request.type)} {labels.types[request.type as keyof typeof labels.types]}
                                                </span>
                                                <span
                                                    className={styles.requestStatus}
                                                    style={{ color: getStatusColor(request.status) }}
                                                >
                                                    {labels.statuses[request.status as keyof typeof labels.statuses]}
                                                </span>
                                            </div>
                                            <h3 className={styles.requestTitle}>{request.title}</h3>
                                            <p className={styles.requestContent}>{request.content}</p>
                                            <div className={styles.requestMeta}>
                                                <span>{formatDate(request.createdAt)}</span>
                                                <span>{getPriorityIcon(request.priority)} {labels.priorities[request.priority as keyof typeof labels.priorities]}</span>
                                            </div>
                                            {request.response && (
                                                <div className={styles.responseBox}>
                                                    <strong>{labels.response}:</strong>
                                                    <p>{request.response}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
