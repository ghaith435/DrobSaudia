"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./admin.module.css";

interface AnalyticsData {
    overview: {
        totalUsers: number;
        totalPlaces: number;
        totalRequests: number;
        totalViews: number;
        activeUsers: number;
        pendingRequests: number;
    };
    recentRequests: any[];
    recentUsers: any[];
    requestsByType: { type: string; count: number }[];
    requestsByStatus: { status: string; count: number }[];
    topPlaces: any[];
    topSearches: { query: string; count: number }[];
    topServices: { service: string; count: number; percentage: number }[];
    dailyVisits: { date: string; count: number }[];
}

interface User {
    id: string;
    name: string;
    nameAr?: string;
    email: string;
    phone?: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
}

interface UserRequest {
    id: string;
    userId: string;
    type: string;
    status: string;
    title: string;
    content: string;
    response?: string;
    priority: string;
    createdAt: string;
    user?: {
        name: string;
        email: string;
    };
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'user' | 'request' | 'place' | 'city' | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Data states
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        overview: {
            totalUsers: 0,
            totalPlaces: 0,
            totalRequests: 0,
            totalViews: 0,
            activeUsers: 0,
            pendingRequests: 0,
        },
        recentRequests: [],
        recentUsers: [],
        requestsByType: [],
        requestsByStatus: [],
        topPlaces: [],
        topSearches: [],
        topServices: [],
        dailyVisits: [],
    });

    const [users, setUsers] = useState<User[]>([]);
    const [usersPage, setUsersPage] = useState(1);
    const [usersTotalPages, setUsersTotalPages] = useState(1);
    const [userFilter, setUserFilter] = useState({ role: '', status: '', search: '' });

    const [requests, setRequests] = useState<UserRequest[]>([]);
    const [requestsPage, setRequestsPage] = useState(1);
    const [requestsTotalPages, setRequestsTotalPages] = useState(1);
    const [requestFilter, setRequestFilter] = useState({ type: '', status: '' });

    // Fetch analytics
    const fetchAnalytics = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/analytics');
            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            }
        } catch (err) {
            console.error('Error fetching analytics:', err);
        }
    }, []);

    // Fetch users
    const fetchUsers = useCallback(async () => {
        try {
            const params = new URLSearchParams({
                page: usersPage.toString(),
                limit: '20',
                ...(userFilter.role && { role: userFilter.role }),
                ...(userFilter.status && { status: userFilter.status }),
                ...(userFilter.search && { search: userFilter.search }),
            });

            const res = await fetch(`/api/admin/users?${params}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setUsersTotalPages(data.pagination.totalPages);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    }, [usersPage, userFilter]);

    // Fetch requests
    const fetchRequests = useCallback(async () => {
        try {
            const params = new URLSearchParams({
                page: requestsPage.toString(),
                limit: '20',
                ...(requestFilter.type && { type: requestFilter.type }),
                ...(requestFilter.status && { status: requestFilter.status }),
            });

            const res = await fetch(`/api/admin/requests?${params}`);
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests);
                setRequestsTotalPages(data.pagination.totalPages);
            }
        } catch (err) {
            console.error('Error fetching requests:', err);
        }
    }, [requestsPage, requestFilter]);

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);

        const loadData = async () => {
            setIsLoading(true);
            await fetchAnalytics();
            setIsLoading(false);
        };

        loadData();
    }, [fetchAnalytics]);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab, fetchUsers]);

    useEffect(() => {
        if (activeTab === 'requests') {
            fetchRequests();
        }
    }, [activeTab, fetchRequests]);

    // Update user
    const updateUser = async (userId: string, updates: Partial<User>) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, ...updates })
            });

            if (res.ok) {
                await fetchUsers();
                setShowModal(false);
            } else {
                const data = await res.json();
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to update user');
        }
    };

    // Update request
    const updateRequest = async (requestId: string, updates: any) => {
        try {
            const res = await fetch('/api/admin/requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: requestId, ...updates })
            });

            if (res.ok) {
                await fetchRequests();
                setShowModal(false);
            } else {
                const data = await res.json();
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to update request');
        }
    };

    const t = {
        ar: {
            title: 'لوحة الإدارة',
            overview: 'نظرة عامة',
            users: 'المستخدمين',
            places: 'الأماكن',
            cities: 'المدن',
            requests: 'الطلبات',
            statistics: 'الإحصائيات',
            analytics: 'التحليلات',
            activities: 'الحركات',
            settings: 'الإعدادات',
            totalUsers: 'إجمالي المستخدمين',
            totalPlaces: 'إجمالي الأماكن',
            totalRequests: 'إجمالي الطلبات',
            totalViews: 'إجمالي المشاهدات',
            activeUsers: 'المستخدمين النشطين',
            pendingRequests: 'الطلبات المعلقة',
            recentRequests: 'أحدث الطلبات',
            recentUsers: 'أحدث المستخدمين',
            topPlaces: 'الأكثر مشاهدة',
            topServices: 'الخدمات الأكثر طلباً',
            addNew: 'إضافة جديد',
            addPlace: 'إضافة مكان',
            addCity: 'إضافة مدينة',
            edit: 'تعديل',
            delete: 'حذف',
            save: 'حفظ',
            cancel: 'إلغاء',
            status: 'الحالة',
            actions: 'الإجراءات',
            pending: 'قيد الانتظار',
            inProgress: 'قيد المعالجة',
            completed: 'مكتمل',
            cancelled: 'ملغي',
            name: 'الاسم',
            nameAr: 'الاسم بالعربية',
            description: 'الوصف',
            descriptionAr: 'الوصف بالعربية',
            address: 'العنوان',
            category: 'التصنيف',
            email: 'البريد',
            role: 'الدور',
            active: 'نشط',
            inactive: 'غير نشط',
            featured: 'مميز',
            verified: 'موثق',
            blocked: 'محظور',
            logout: 'تسجيل الخروج',
            viewDetails: 'عرض التفاصيل',
            respond: 'الرد',
            userManagement: 'إدارة المستخدمين',
            placesManagement: 'إدارة الأماكن',
            citiesManagement: 'إدارة المدن',
            activitiesTracking: 'متابعة الحركات',
            all: 'الكل',
            admin: 'مدير',
            user: 'مستخدم',
            moderator: 'مشرف',
            search: 'بحث...',
            filter: 'فلترة',
            type: 'النوع',
            response: 'الرد',
            createdAt: 'تاريخ الإنشاء',
            quickActions: 'إجراءات سريعة',
            manageUsers: 'إدارة المستخدمين',
            manageRequests: 'إدارة الطلبات',
            managePlaces: 'إدارة الأماكن',
            manageCities: 'إدارة المدن',
            viewAnalytics: 'عرض الإحصائيات',
            viewStatistics: 'عرض الإحصائيات',
            block: 'حظر',
            unblock: 'إلغاء الحظر',
            verify: 'توثيق',
            changeRole: 'تغيير الدور',
            noData: 'لا توجد بيانات',
            loading: 'جاري التحميل...',
            error: 'حدث خطأ',
            previous: 'السابق',
            next: 'التالي',
            page: 'صفحة',
            of: 'من',
            latitude: 'خط العرض',
            longitude: 'خط الطول',
            image: 'الصورة',
            imageUrl: 'رابط الصورة',
            serviceUsage: 'استخدام الخدمات',
            dailyVisitors: 'الزوار اليوميين',
            audioGuide: 'الدليل الصوتي',
            tripPlan: 'تخطيط الرحلة',
            arGuide: 'الدليل المعزز',
            vrHistory: 'التاريخ الافتراضي',
            aiChat: 'محادثة الذكاء',
            bookings: 'الحجوزات',
            experiences: 'التجارب',
        },
        en: {
            title: 'Admin Dashboard',
            overview: 'Overview',
            users: 'Users',
            places: 'Places',
            cities: 'Cities',
            requests: 'Requests',
            statistics: 'Statistics',
            analytics: 'Analytics',
            activities: 'Activities',
            settings: 'Settings',
            totalUsers: 'Total Users',
            totalPlaces: 'Total Places',
            totalRequests: 'Total Requests',
            totalViews: 'Total Views',
            activeUsers: 'Active Users',
            pendingRequests: 'Pending Requests',
            recentRequests: 'Recent Requests',
            recentUsers: 'Recent Users',
            topPlaces: 'Most Viewed',
            topServices: 'Most Requested Services',
            addNew: 'Add New',
            addPlace: 'Add Place',
            addCity: 'Add City',
            edit: 'Edit',
            delete: 'Delete',
            save: 'Save',
            cancel: 'Cancel',
            status: 'Status',
            actions: 'Actions',
            pending: 'Pending',
            inProgress: 'In Progress',
            completed: 'Completed',
            cancelled: 'Cancelled',
            name: 'Name',
            nameAr: 'Name (Arabic)',
            description: 'Description',
            descriptionAr: 'Description (Arabic)',
            address: 'Address',
            category: 'Category',
            email: 'Email',
            role: 'Role',
            active: 'Active',
            inactive: 'Inactive',
            featured: 'Featured',
            verified: 'Verified',
            blocked: 'Blocked',
            logout: 'Logout',
            viewDetails: 'View Details',
            respond: 'Respond',
            userManagement: 'User Management',
            placesManagement: 'Places Management',
            citiesManagement: 'Cities Management',
            activitiesTracking: 'Activities Tracking',
            all: 'All',
            admin: 'Admin',
            user: 'User',
            moderator: 'Moderator',
            search: 'Search...',
            filter: 'Filter',
            type: 'Type',
            response: 'Response',
            createdAt: 'Created At',
            quickActions: 'Quick Actions',
            manageUsers: 'Manage Users',
            manageRequests: 'Manage Requests',
            managePlaces: 'Manage Places',
            manageCities: 'Manage Cities',
            viewAnalytics: 'View Analytics',
            viewStatistics: 'View Statistics',
            block: 'Block',
            unblock: 'Unblock',
            verify: 'Verify',
            changeRole: 'Change Role',
            noData: 'No data available',
            loading: 'Loading...',
            error: 'Error occurred',
            previous: 'Previous',
            next: 'Next',
            page: 'Page',
            of: 'of',
            latitude: 'Latitude',
            longitude: 'Longitude',
            image: 'Image',
            imageUrl: 'Image URL',
            serviceUsage: 'Service Usage',
            dailyVisitors: 'Daily Visitors',
            audioGuide: 'Audio Guide',
            tripPlan: 'Trip Planning',
            arGuide: 'AR Guide',
            vrHistory: 'VR History',
            aiChat: 'AI Chat',
            bookings: 'Bookings',
            experiences: 'Experiences',
        },
    };

    const labels = t[locale];
    const isRTL = locale === 'ar';

    const tabs = [
        { id: "overview", label: labels.overview, icon: "📊" },
        { id: "users", label: labels.users, icon: "👥" },
        { id: "statistics", label: labels.statistics, icon: "📈" },
        { id: "places", label: labels.places, icon: "📍" },
        { id: "cities", label: labels.cities, icon: "🏙️" },
        { id: "activities", label: labels.activities, icon: "📋" },
        { id: "settings", label: labels.settings, icon: "⚙️" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return '#f59e0b';
            case 'IN_PROGRESS': return '#3b82f6';
            case 'COMPLETED': return '#10b981';
            case 'CANCELLED': case 'REJECTED': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return labels.pending;
            case 'IN_PROGRESS': return labels.inProgress;
            case 'COMPLETED': return labels.completed;
            case 'CANCELLED': return labels.cancelled;
            default: return status;
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ADMIN': return labels.admin;
            case 'USER': return labels.user;
            case 'MODERATOR': return labels.moderator;
            default: return role;
        }
    };

    const openModal = (type: 'user' | 'request' | 'place' | 'city', item?: any) => {
        setModalType(type);
        setEditingItem(item || null);
        setShowModal(true);
    };

    const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: string; color?: string }) => (
        <div className={styles.statCard} style={color ? { borderColor: color } : {}}>
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statContent}>
                <span className={styles.statValue} style={color ? { color } : {}}>{value.toLocaleString()}</span>
                <span className={styles.statTitle}>{title}</span>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>{labels.loading}</p>
            </div>
        );
    }

    return (
        <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Error Toast */}
            {error && (
                <div className={styles.errorToast}>
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}

            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <span className={styles.logoGold}>{isRTL ? 'الرياض' : 'Riyadh'}</span>
                    {isRTL ? ' إدارة' : ' Admin'}
                </div>

                <nav className={styles.nav}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className={styles.navIcon}>{tab.icon}</span>
                            <span>{tab.label}</span>
                            {tab.id === 'requests' && analytics.overview.pendingRequests > 0 && (
                                <span className={styles.badge}>{analytics.overview.pendingRequests}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <button
                        className={styles.langButton}
                        onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
                    >
                        🌐 {locale === 'ar' ? 'English' : 'العربية'}
                    </button>
                    <button className={styles.logoutButton} onClick={() => window.location.href = '/api/auth/signout'}>
                        🚪 {labels.logout}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Header */}
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.pageTitle}>
                            {tabs.find((t) => t.id === activeTab)?.icon}{" "}
                            {tabs.find((t) => t.id === activeTab)?.label}
                        </h1>
                    </div>
                    <div className={styles.headerActions}>
                        {activeTab === 'users' && (
                            <button className={styles.primaryButton} onClick={() => openModal('user')}>
                                + {labels.addNew}
                            </button>
                        )}
                        <button className={styles.refreshButton} onClick={() => {
                            if (activeTab === 'overview') fetchAnalytics();
                            else if (activeTab === 'users') fetchUsers();
                            else if (activeTab === 'requests') fetchRequests();
                        }}>
                            🔄
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className={styles.content}>
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <>
                            {/* Stats Grid */}
                            <div className={styles.statsGrid}>
                                <StatCard title={labels.totalUsers} value={analytics.overview.totalUsers} icon="👥" />
                                <StatCard title={labels.totalPlaces} value={analytics.overview.totalPlaces} icon="📍" />
                                <StatCard title={labels.totalRequests} value={analytics.overview.totalRequests} icon="📝" />
                                <StatCard title={labels.totalViews} value={analytics.overview.totalViews} icon="👁️" />
                                <StatCard title={labels.activeUsers} value={analytics.overview.activeUsers} icon="✓" color="#10b981" />
                                <StatCard title={labels.pendingRequests} value={analytics.overview.pendingRequests} icon="⏳" color="#f59e0b" />
                            </div>

                            {/* Quick Actions */}
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>{labels.quickActions}</h2>
                                <div className={styles.actionsGrid}>
                                    <button className={styles.actionCard} onClick={() => setActiveTab('users')}>
                                        <span>👥</span>
                                        <span>{labels.manageUsers}</span>
                                    </button>
                                    <button className={styles.actionCard} onClick={() => setActiveTab('requests')}>
                                        <span>📝</span>
                                        <span>{labels.manageRequests}</span>
                                    </button>
                                    <button className={styles.actionCard} onClick={() => setActiveTab('analytics')}>
                                        <span>📈</span>
                                        <span>{labels.viewAnalytics}</span>
                                    </button>
                                    <button className={styles.actionCard} onClick={() => setActiveTab('activities')}>
                                        <span>📋</span>
                                        <span>{labels.activitiesTracking}</span>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.gridTwo}>
                                {/* Recent Users */}
                                <div className={styles.section}>
                                    <h2 className={styles.sectionTitle}>{labels.recentUsers}</h2>
                                    <div className={styles.activityList}>
                                        {analytics.recentUsers.length > 0 ? analytics.recentUsers.map((user: any) => (
                                            <div key={user.id} className={styles.activityItem}>
                                                <span className={styles.activityIcon}>👤</span>
                                                <span className={styles.activityText}>{user.name || user.email}</span>
                                                <span className={styles.roleBadge}>{getRoleLabel(user.role)}</span>
                                            </div>
                                        )) : (
                                            <p className={styles.noData}>{labels.noData}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Top Places */}
                                <div className={styles.section}>
                                    <h2 className={styles.sectionTitle}>{labels.topPlaces}</h2>
                                    <div className={styles.activityList}>
                                        {analytics.topPlaces.length > 0 ? analytics.topPlaces.map((place: any, index: number) => (
                                            <div key={place.id} className={styles.activityItem}>
                                                <span className={styles.rankBadge}>{index + 1}</span>
                                                <span className={styles.activityText}>{isRTL ? place.nameAr || place.name : place.name}</span>
                                                <span className={styles.viewCount}>{place.viewCount?.toLocaleString()} 👁️</span>
                                            </div>
                                        )) : (
                                            <p className={styles.noData}>{labels.noData}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Users Tab */}
                    {activeTab === "users" && (
                        <div className={styles.section}>
                            {/* Filters */}
                            <div className={styles.tableHeader}>
                                <input
                                    type="text"
                                    placeholder={labels.search}
                                    className={styles.searchInput}
                                    value={userFilter.search}
                                    onChange={(e) => setUserFilter({ ...userFilter, search: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                                />
                                <select
                                    className={styles.filterSelect}
                                    value={userFilter.role}
                                    onChange={(e) => { setUserFilter({ ...userFilter, role: e.target.value }); setUsersPage(1); }}
                                >
                                    <option value="">{labels.all} {labels.role}</option>
                                    <option value="ADMIN">{labels.admin}</option>
                                    <option value="MODERATOR">{labels.moderator}</option>
                                    <option value="USER">{labels.user}</option>
                                </select>
                                <select
                                    className={styles.filterSelect}
                                    value={userFilter.status}
                                    onChange={(e) => { setUserFilter({ ...userFilter, status: e.target.value }); setUsersPage(1); }}
                                >
                                    <option value="">{labels.all} {labels.status}</option>
                                    <option value="active">{labels.active}</option>
                                    <option value="inactive">{labels.inactive}</option>
                                    <option value="verified">{labels.verified}</option>
                                </select>
                            </div>

                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>{labels.name}</th>
                                        <th>{labels.email}</th>
                                        <th>{labels.role}</th>
                                        <th>{labels.status}</th>
                                        <th>{labels.createdAt}</th>
                                        <th>{labels.actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{isRTL ? user.nameAr || user.name : user.name}</td>
                                            <td>{user.email}</td>
                                            <td><span className={styles.roleBadge}>{getRoleLabel(user.role)}</span></td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.inactive}`}>
                                                    {user.isActive ? labels.active : labels.inactive}
                                                </span>
                                                {user.isVerified && <span className={styles.verifiedBadge}>✓</span>}
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button className={styles.editButton} onClick={() => openModal('user', user)}>✏️</button>
                                                    <button
                                                        className={styles.blockButton}
                                                        onClick={() => updateUser(user.id, { isActive: !user.isActive })}
                                                    >
                                                        {user.isActive ? '🚫' : '✓'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className={styles.noData}>{labels.noData}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {usersTotalPages > 1 && (
                                <div className={styles.pagination}>
                                    <button
                                        disabled={usersPage === 1}
                                        onClick={() => setUsersPage(usersPage - 1)}
                                    >
                                        {labels.previous}
                                    </button>
                                    <span>{labels.page} {usersPage} {labels.of} {usersTotalPages}</span>
                                    <button
                                        disabled={usersPage === usersTotalPages}
                                        onClick={() => setUsersPage(usersPage + 1)}
                                    >
                                        {labels.next}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Statistics Tab - Most Requested Services */}
                    {activeTab === "statistics" && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>📈 {labels.statistics}</h2>

                            {/* Stats Overview */}
                            <div className={styles.statsGrid}>
                                <StatCard title={labels.totalViews} value={analytics.overview.totalViews} icon="👁️" />
                                <StatCard title={labels.totalUsers} value={analytics.overview.totalUsers} icon="👥" />
                                <StatCard title={labels.totalPlaces} value={analytics.overview.totalPlaces} icon="📍" />
                                <StatCard title={labels.activeUsers} value={analytics.overview.activeUsers} icon="✓" color="#10b981" />
                            </div>

                            {/* Top Services Chart */}
                            <div className={styles.chartContainer} style={{ marginTop: '2rem' }}>
                                <h3>🔥 {labels.topServices}</h3>
                                <div className={styles.serviceGrid}>
                                    {[
                                        { service: isRTL ? labels.audioGuide : 'Audio Guide', count: 1234, percentage: 35, icon: '🎧', color: '#3b82f6' },
                                        { service: isRTL ? labels.tripPlan : 'Trip Planning', count: 987, percentage: 28, icon: '🗺️', color: '#10b981' },
                                        { service: isRTL ? labels.arGuide : 'AR Guide', count: 654, percentage: 19, icon: '📱', color: '#8b5cf6' },
                                        { service: isRTL ? labels.aiChat : 'AI Chat', count: 432, percentage: 12, icon: '🤖', color: '#f59e0b' },
                                        { service: isRTL ? labels.experiences : 'Experiences', count: 210, percentage: 6, icon: '✨', color: '#ec4899' },
                                    ].map((item) => (
                                        <div key={item.service} className={styles.serviceCard}>
                                            <div className={styles.serviceHeader}>
                                                <span className={styles.serviceIcon} style={{ background: `${item.color}20` }}>{item.icon}</span>
                                                <div>
                                                    <h4 className={styles.serviceName}>{item.service}</h4>
                                                    <p className={styles.serviceCount}>{item.count.toLocaleString()} {isRTL ? 'استخدام' : 'uses'}</p>
                                                </div>
                                            </div>
                                            <div className={styles.barContainer}>
                                                <div
                                                    className={styles.bar}
                                                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                                                />
                                            </div>
                                            <span className={styles.servicePercentage} style={{ color: item.color }}>{item.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Places */}
                            <div className={styles.gridTwo} style={{ marginTop: '2rem' }}>
                                <div className={styles.chartContainer}>
                                    <h3>📍 {labels.topPlaces}</h3>
                                    <div className={styles.activityList}>
                                        {analytics.topPlaces.length > 0 ? analytics.topPlaces.slice(0, 10).map((place: any, index: number) => (
                                            <div key={place.id} className={styles.activityItem}>
                                                <span className={styles.rankBadge} style={{
                                                    background: index < 3 ? 'linear-gradient(135deg, var(--gold-500), var(--gold-600))' : 'var(--gray-700)',
                                                    color: index < 3 ? 'var(--gray-900)' : 'white'
                                                }}>{index + 1}</span>
                                                <span className={styles.activityText}>{isRTL ? place.nameAr || place.name : place.name}</span>
                                                <span className={styles.viewCount}>{place.viewCount?.toLocaleString()} 👁️</span>
                                            </div>
                                        )) : (
                                            <p className={styles.noData}>{labels.noData}</p>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.chartContainer}>
                                    <h3>🔍 {isRTL ? 'أكثر عمليات البحث' : 'Top Searches'}</h3>
                                    <div className={styles.activityList}>
                                        {analytics.topSearches.length > 0 ? analytics.topSearches.slice(0, 10).map((search: any, index: number) => (
                                            <div key={search.query} className={styles.activityItem}>
                                                <span className={styles.rankBadge}>{index + 1}</span>
                                                <span className={styles.activityText}>{search.query}</span>
                                                <span className={styles.viewCount}>{search.count} 🔍</span>
                                            </div>
                                        )) : (
                                            <p className={styles.noData}>{labels.noData}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Activities Tab */}
                    {activeTab === "activities" && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>{labels.activitiesTracking}</h2>
                            <p className={styles.comingSoon}>🚧 قريباً - Coming Soon</p>
                        </div>
                    )}

                    {/* Places Tab */}
                    {activeTab === "places" && (
                        <div className={styles.section}>
                            <div className={styles.tableHeader}>
                                <h2 className={styles.sectionTitle}>📍 {labels.placesManagement}</h2>
                                <button className={styles.primaryButton} onClick={() => openModal('place')}>
                                    + {labels.addPlace}
                                </button>
                            </div>

                            <div className={styles.placesGrid}>
                                {analytics.topPlaces.length > 0 ? analytics.topPlaces.map((place: any) => (
                                    <div key={place.id} className={styles.placeCard}>
                                        <div className={styles.placeImage}>
                                            {place.image ? (
                                                <img src={place.image} alt={place.name} />
                                            ) : (
                                                <div className={styles.placeholderImage}>📍</div>
                                            )}
                                            {place.isFeatured && <span className={styles.featuredBadge}>⭐</span>}
                                        </div>
                                        <div className={styles.placeContent}>
                                            <h3>{isRTL ? place.nameAr || place.name : place.name}</h3>
                                            <p className={styles.placeCategory}>{place.category?.name || 'غير مصنف'}</p>
                                            <div className={styles.placeMeta}>
                                                <span>👁️ {place.viewCount?.toLocaleString() || 0}</span>
                                                <span>⭐ {place.rating || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className={styles.placeActions}>
                                            <button className={styles.editButton} onClick={() => openModal('place', place)}>✏️</button>
                                            <button className={styles.deleteButton}>🗑️</button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className={styles.emptyState}>
                                        <span>📍</span>
                                        <p>{labels.noData}</p>
                                        <button className={styles.primaryButton} onClick={() => openModal('place')}>
                                            + {labels.addPlace}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Cities Tab */}
                    {activeTab === "cities" && (
                        <div className={styles.section}>
                            <div className={styles.tableHeader}>
                                <h2 className={styles.sectionTitle}>🏙️ {labels.citiesManagement}</h2>
                                <button className={styles.primaryButton} onClick={() => openModal('city')}>
                                    + {labels.addCity}
                                </button>
                            </div>

                            <div className={styles.citiesGrid}>
                                {[
                                    { id: '1', name: 'Riyadh', nameAr: 'الرياض', placesCount: 150, image: '/images/cities/riyadh.jpg', isActive: true },
                                    { id: '2', name: 'Jeddah', nameAr: 'جدة', placesCount: 89, image: '/images/cities/jeddah.jpg', isActive: true },
                                    { id: '3', name: 'Mecca', nameAr: 'مكة المكرمة', placesCount: 45, image: '/images/cities/mecca.jpg', isActive: true },
                                    { id: '4', name: 'Medina', nameAr: 'المدينة المنورة', placesCount: 38, image: '/images/cities/medina.jpg', isActive: true },
                                    { id: '5', name: 'Dammam', nameAr: 'الدمام', placesCount: 32, image: '/images/cities/dammam.jpg', isActive: true },
                                    { id: '6', name: 'AlUla', nameAr: 'العلا', placesCount: 25, image: '/images/cities/alula.jpg', isActive: true },
                                ].map((city) => (
                                    <div key={city.id} className={styles.cityCard}>
                                        <div className={styles.cityImage}>
                                            {city.image ? (
                                                <img src={city.image} alt={city.name} />
                                            ) : (
                                                <div className={styles.placeholderImage}>🏙️</div>
                                            )}
                                        </div>
                                        <div className={styles.cityContent}>
                                            <h3>{isRTL ? city.nameAr : city.name}</h3>
                                            <p>{city.placesCount} {isRTL ? 'مكان' : 'places'}</p>
                                            <span className={`${styles.statusBadge} ${city.isActive ? styles.active : styles.inactive}`}>
                                                {city.isActive ? labels.active : labels.inactive}
                                            </span>
                                        </div>
                                        <div className={styles.cityActions}>
                                            <button className={styles.editButton} onClick={() => openModal('city', city)}>✏️</button>
                                            <button className={styles.deleteButton}>🗑️</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.addCityForm} style={{ marginTop: '2rem' }}>
                                <h3>➕ {labels.addCity}</h3>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>{labels.name} (English)</label>
                                        <input type="text" placeholder="City name in English" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{labels.nameAr}</label>
                                        <input type="text" placeholder="اسم المدينة بالعربية" dir="rtl" />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{labels.imageUrl}</label>
                                    <input type="url" placeholder="https://example.com/city-image.jpg" />
                                </div>
                                <button className={styles.primaryButton}>
                                    + {labels.addCity}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === "settings" && (
                        <div className={styles.settingsGrid}>
                            <div className={styles.settingsCard}>
                                <h3>🤖 إعدادات الذكاء الاصطناعي</h3>
                                <div className={styles.settingItem}>
                                    <label>مفتاح Gemini API</label>
                                    <input type="password" placeholder="أدخل المفتاح..." />
                                </div>
                                <button className={styles.saveButton}>{labels.save}</button>
                            </div>

                            <div className={styles.settingsCard}>
                                <h3>📧 الإشعارات</h3>
                                <div className={styles.settingToggle}>
                                    <label>إشعار عند طلب جديد</label>
                                    <input type="checkbox" defaultChecked />
                                </div>
                                <div className={styles.settingToggle}>
                                    <label>إشعار عند تسجيل مستخدم جديد</label>
                                    <input type="checkbox" defaultChecked />
                                </div>
                                <button className={styles.saveButton}>{labels.save}</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* User Edit Modal */}
            {showModal && modalType === 'user' && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingItem ? labels.edit : labels.addNew} {labels.users}</h2>
                            <button className={styles.closeButton} onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className={styles.modalBody}>
                            {editingItem && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label>{labels.name}</label>
                                        <input type="text" defaultValue={editingItem.name} id="userName" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{labels.email}</label>
                                        <input type="email" defaultValue={editingItem.email} id="userEmail" disabled />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{labels.role}</label>
                                        <select defaultValue={editingItem.role} id="userRole">
                                            <option value="USER">{labels.user}</option>
                                            <option value="MODERATOR">{labels.moderator}</option>
                                            <option value="ADMIN">{labels.admin}</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{labels.status}</label>
                                        <select defaultValue={editingItem.isActive ? 'active' : 'inactive'} id="userStatus">
                                            <option value="active">{labels.active}</option>
                                            <option value="inactive">{labels.inactive}</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.cancelButton} onClick={() => setShowModal(false)}>
                                {labels.cancel}
                            </button>
                            <button
                                className={styles.saveButton}
                                onClick={() => {
                                    if (editingItem) {
                                        const name = (document.getElementById('userName') as HTMLInputElement).value;
                                        const role = (document.getElementById('userRole') as HTMLSelectElement).value;
                                        const status = (document.getElementById('userStatus') as HTMLSelectElement).value;
                                        updateUser(editingItem.id, {
                                            name,
                                            role: role as any,
                                            isActive: status === 'active'
                                        });
                                    }
                                }}
                            >
                                {labels.save}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request View Modal */}
            {showModal && modalType === 'request' && editingItem && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{labels.viewDetails}</h2>
                            <button className={styles.closeButton} onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.requestDetails}>
                                <div className={styles.detailRow}>
                                    <strong>{labels.type}:</strong> <span>{editingItem.type}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>{labels.status}:</strong>
                                    <span style={{ color: getStatusColor(editingItem.status) }}>{getStatusLabel(editingItem.status)}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>العنوان:</strong> <span>{editingItem.title}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>المحتوى:</strong>
                                    <p>{editingItem.content}</p>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{labels.response}</label>
                                    <textarea
                                        id="requestResponse"
                                        defaultValue={editingItem.response || ''}
                                        placeholder="اكتب الرد هنا..."
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{labels.status}</label>
                                    <select id="requestStatus" defaultValue={editingItem.status}>
                                        <option value="PENDING">{labels.pending}</option>
                                        <option value="IN_PROGRESS">{labels.inProgress}</option>
                                        <option value="COMPLETED">{labels.completed}</option>
                                        <option value="CANCELLED">{labels.cancelled}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.cancelButton} onClick={() => setShowModal(false)}>
                                {labels.cancel}
                            </button>
                            <button
                                className={styles.saveButton}
                                onClick={() => {
                                    const response = (document.getElementById('requestResponse') as HTMLTextAreaElement).value;
                                    const status = (document.getElementById('requestStatus') as HTMLSelectElement).value;
                                    updateRequest(editingItem.id, { response, status });
                                }}
                            >
                                {labels.save}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
