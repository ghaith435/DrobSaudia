'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import styles from './maps.module.css';

// Dynamically import the map component (requires window)
const InteractiveMap = dynamic(
    () => import('@/components/maps/InteractiveMap'),
    {
        ssr: false,
        loading: () => (
            <div className={styles.mapLoading}>
                <div className={styles.spinner}></div>
                <p>جاري تحميل الخريطة...</p>
            </div>
        )
    }
);

interface Place {
    id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    category: string;
    categoryAr: string;
    latitude: number;
    longitude: number;
    rating: number;
    image?: string;
}

interface RouteInfo {
    distance: number; // km
    duration: number; // minutes
    instructions: string[];
}

export default function MapsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [searchQuery, setSearchQuery] = useState('');
    const [places, setPlaces] = useState<Place[]>([]);
    const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [showDirections, setShowDirections] = useState(false);
    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [showSidebar, setShowSidebar] = useState(true);

    // Sample places data (replace with API call)
    const samplePlaces: Place[] = [
        {
            id: '1',
            name: 'Kingdom Centre',
            nameAr: 'برج المملكة',
            description: 'Iconic skyscraper with observation deck',
            descriptionAr: 'برج أيقوني مع منصة مراقبة',
            category: 'landmarks',
            categoryAr: 'معالم',
            latitude: 24.7111,
            longitude: 46.6746,
            rating: 4.7,
        },
        {
            id: '2',
            name: 'Diriyah',
            nameAr: 'الدرعية التاريخية',
            description: 'UNESCO World Heritage Site',
            descriptionAr: 'موقع تراث عالمي لليونسكو',
            category: 'heritage',
            categoryAr: 'تراث',
            latitude: 24.7342,
            longitude: 46.5747,
            rating: 4.9,
        },
        {
            id: '3',
            name: 'National Museum',
            nameAr: 'المتحف الوطني',
            description: 'Saudi Arabia\'s premier museum',
            descriptionAr: 'المتحف الأول في المملكة',
            category: 'museums',
            categoryAr: 'متاحف',
            latitude: 24.6479,
            longitude: 46.7106,
            rating: 4.6,
        },
        {
            id: '4',
            name: 'Al Faisaliah Tower',
            nameAr: 'برج الفيصلية',
            description: 'Famous golden ball tower',
            descriptionAr: 'برج الكرة الذهبية الشهير',
            category: 'landmarks',
            categoryAr: 'معالم',
            latitude: 24.6904,
            longitude: 46.6853,
            rating: 4.5,
        },
        {
            id: '5',
            name: 'Boulevard Riyadh',
            nameAr: 'بوليفارد الرياض',
            description: 'Entertainment district',
            descriptionAr: 'منطقة ترفيهية متكاملة',
            category: 'entertainment',
            categoryAr: 'ترفيه',
            latitude: 24.7680,
            longitude: 46.6361,
            rating: 4.8,
        },
        {
            id: '6',
            name: 'Masmak Fortress',
            nameAr: 'قصر المصمك',
            description: 'Historic clay fortress',
            descriptionAr: 'قلعة طينية تاريخية',
            category: 'heritage',
            categoryAr: 'تراث',
            latitude: 24.6311,
            longitude: 46.7134,
            rating: 4.4,
        },
        {
            id: '7',
            name: 'Edge of the World',
            nameAr: 'حافة العالم',
            description: 'Dramatic cliff views',
            descriptionAr: 'إطلالات خلابة على المنحدرات',
            category: 'nature',
            categoryAr: 'طبيعة',
            latitude: 24.8289,
            longitude: 46.1694,
            rating: 4.9,
        },
        {
            id: '8',
            name: 'Riyadh Zoo',
            nameAr: 'حديقة الحيوان',
            description: 'Family-friendly zoo',
            descriptionAr: 'حديقة حيوان عائلية',
            category: 'entertainment',
            categoryAr: 'ترفيه',
            latitude: 24.6258,
            longitude: 46.7125,
            rating: 4.2,
        },
    ];

    const categories = [
        { id: 'all', name: 'All', nameAr: 'الكل', icon: '🗺️' },
        { id: 'landmarks', name: 'Landmarks', nameAr: 'معالم', icon: '🏛️' },
        { id: 'heritage', name: 'Heritage', nameAr: 'تراث', icon: '🕌' },
        { id: 'museums', name: 'Museums', nameAr: 'متاحف', icon: '🏛️' },
        { id: 'entertainment', name: 'Entertainment', nameAr: 'ترفيه', icon: '🎪' },
        { id: 'nature', name: 'Nature', nameAr: 'طبيعة', icon: '🌳' },
    ];

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);
        setPlaces(samplePlaces);
        setFilteredPlaces(samplePlaces);
    }, []);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.log('Location error:', error);
                    // Default to Riyadh center
                    setUserLocation([24.7136, 46.6753]);
                }
            );
        }
    }, []);

    // Filter places
    useEffect(() => {
        let filtered = places;

        if (activeCategory !== 'all') {
            filtered = filtered.filter(p => p.category === activeCategory);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.nameAr.includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.descriptionAr.includes(query)
            );
        }

        setFilteredPlaces(filtered);
    }, [places, activeCategory, searchQuery]);

    // Calculate route using OSRM (free routing service)
    const calculateRoute = useCallback(async (destination: Place) => {
        if (!userLocation) return;

        setIsLoadingRoute(true);
        setShowDirections(true);

        try {
            // OSRM Demo Server (for production, use your own server)
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson&steps=true`
            );

            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];

                // Extract coordinates
                const coords = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
                setRouteCoordinates(coords);

                // Extract route info
                const distance = (route.distance / 1000).toFixed(1);
                const duration = Math.round(route.duration / 60);

                // Extract turn-by-turn instructions
                const instructions = route.legs[0].steps.map((step: any) => {
                    return step.maneuver.instruction || step.name;
                }).filter((i: string) => i);

                setRouteInfo({
                    distance: parseFloat(distance),
                    duration,
                    instructions,
                });
            }
        } catch (error) {
            console.error('Error calculating route:', error);
        } finally {
            setIsLoadingRoute(false);
        }
    }, [userLocation]);

    const clearRoute = () => {
        setShowDirections(false);
        setRouteInfo(null);
        setRouteCoordinates([]);
        setSelectedPlace(null);
    };

    const t = {
        ar: {
            title: 'الخرائط والمسارات',
            subtitle: 'استكشف الرياض واحصل على اتجاهات مباشرة',
            search: 'ابحث عن مكان...',
            directions: 'الاتجاهات',
            distance: 'المسافة',
            duration: 'الوقت',
            km: 'كم',
            min: 'دقيقة',
            getDirections: 'احصل على الاتجاهات',
            clearRoute: 'مسح المسار',
            noPlaces: 'لا توجد أماكن',
            loading: 'جاري حساب المسار...',
            yourLocation: 'موقعك الحالي',
            toggleSidebar: 'إخفاء القائمة',
            showSidebar: 'إظهار القائمة',
            turnByTurn: 'التوجيهات خطوة بخطوة',
            viewDetails: 'عرض التفاصيل',
            back: 'رجوع',
        },
        en: {
            title: 'Maps & Routes',
            subtitle: 'Explore Riyadh and get live directions',
            search: 'Search for a place...',
            directions: 'Directions',
            distance: 'Distance',
            duration: 'Duration',
            km: 'km',
            min: 'min',
            getDirections: 'Get Directions',
            clearRoute: 'Clear Route',
            noPlaces: 'No places found',
            loading: 'Calculating route...',
            yourLocation: 'Your Location',
            toggleSidebar: 'Hide Sidebar',
            showSidebar: 'Show Sidebar',
            turnByTurn: 'Turn-by-turn Directions',
            viewDetails: 'View Details',
            back: 'Back',
        },
    };

    const labels = t[locale];
    const isRTL = locale === 'ar';

    // Prepare markers for map
    const mapMarkers: Array<{
        id: string;
        position: [number, number];
        title: string;
        description: string;
        category: string;
        icon: 'default' | 'destination' | 'current' | 'waypoint';
    }> = filteredPlaces.map(place => ({
        id: place.id,
        position: [place.latitude, place.longitude] as [number, number],
        title: isRTL ? place.nameAr : place.name,
        description: isRTL ? place.descriptionAr : place.description,
        category: isRTL ? place.categoryAr : place.category,
        icon: selectedPlace?.id === place.id ? 'destination' : 'default',
    }));

    // Add user location marker
    if (userLocation) {
        mapMarkers.unshift({
            id: 'user-location',
            position: userLocation,
            title: labels.yourLocation,
            description: '',
            category: '',
            icon: 'current',
        });
    }

    return (
        <main className={styles.main} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link href="/" className={styles.backBtn}>
                        ← {labels.back}
                    </Link>
                    <div className={styles.headerInfo}>
                        <h1>{labels.title}</h1>
                        <p>{labels.subtitle}</p>
                    </div>
                    <button
                        className={styles.langToggle}
                        onClick={() => {
                            const newLocale = locale === 'ar' ? 'en' : 'ar';
                            setLocale(newLocale);
                            localStorage.setItem('locale', newLocale);
                        }}
                    >
                        🌐 {locale === 'ar' ? 'EN' : 'ع'}
                    </button>
                </div>
            </header>

            <div className={styles.container}>
                {/* Sidebar */}
                <aside className={`${styles.sidebar} ${!showSidebar ? styles.hidden : ''}`}>
                    {/* Search */}
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder={labels.search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    {/* Categories */}
                    <div className={styles.categories}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                <span>{cat.icon}</span>
                                <span>{isRTL ? cat.nameAr : cat.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Places List */}
                    <div className={styles.placesList}>
                        {filteredPlaces.length === 0 ? (
                            <div className={styles.emptyState}>
                                <span>📍</span>
                                <p>{labels.noPlaces}</p>
                            </div>
                        ) : (
                            filteredPlaces.map(place => (
                                <div
                                    key={place.id}
                                    className={`${styles.placeCard} ${selectedPlace?.id === place.id ? styles.selected : ''}`}
                                    onClick={() => setSelectedPlace(place)}
                                >
                                    <div className={styles.placeInfo}>
                                        <h3>{isRTL ? place.nameAr : place.name}</h3>
                                        <p>{isRTL ? place.descriptionAr : place.description}</p>
                                        <div className={styles.placeMeta}>
                                            <span className={styles.placeCategory}>
                                                {isRTL ? place.categoryAr : place.category}
                                            </span>
                                            <span className={styles.placeRating}>⭐ {place.rating}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.directionsBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPlace(place);
                                            calculateRoute(place);
                                        }}
                                    >
                                        🧭
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                {/* Toggle Sidebar Button */}
                <button
                    className={styles.toggleSidebar}
                    onClick={() => setShowSidebar(!showSidebar)}
                >
                    {showSidebar ? '◀' : '▶'}
                </button>

                {/* Map Area */}
                <div className={styles.mapArea}>
                    <InteractiveMap
                        center={userLocation || [24.7136, 46.6753]}
                        zoom={12}
                        markers={mapMarkers}
                        route={routeCoordinates.length > 0 ? { coordinates: routeCoordinates } : undefined}
                        onMarkerClick={(marker) => {
                            const place = places.find(p => p.id === marker.id);
                            if (place) setSelectedPlace(place);
                        }}
                        showUserLocation={true}
                        height="100%"
                        fitBounds={filteredPlaces.length > 1 && !routeCoordinates.length}
                    />

                    {/* Directions Panel */}
                    {showDirections && (
                        <div className={styles.directionsPanel}>
                            <div className={styles.directionsPanelHeader}>
                                <h3>{labels.directions}</h3>
                                <button onClick={clearRoute} className={styles.closeBtn}>✕</button>
                            </div>

                            {isLoadingRoute ? (
                                <div className={styles.loadingRoute}>
                                    <div className={styles.spinner}></div>
                                    <p>{labels.loading}</p>
                                </div>
                            ) : routeInfo ? (
                                <>
                                    <div className={styles.routeStats}>
                                        <div className={styles.routeStat}>
                                            <span className={styles.routeStatIcon}>📏</span>
                                            <div>
                                                <span className={styles.routeStatValue}>{routeInfo.distance}</span>
                                                <span className={styles.routeStatLabel}>{labels.km}</span>
                                            </div>
                                        </div>
                                        <div className={styles.routeStat}>
                                            <span className={styles.routeStatIcon}>⏱️</span>
                                            <div>
                                                <span className={styles.routeStatValue}>{routeInfo.duration}</span>
                                                <span className={styles.routeStatLabel}>{labels.min}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.turnByTurn}>
                                        <h4>{labels.turnByTurn}</h4>
                                        <ul>
                                            {routeInfo.instructions.slice(0, 10).map((instruction, i) => (
                                                <li key={i}>
                                                    <span className={styles.stepNumber}>{i + 1}</span>
                                                    <span>{instruction}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    )}

                    {/* Selected Place Info */}
                    {selectedPlace && !showDirections && (
                        <div className={styles.selectedPlaceCard}>
                            <h3>{isRTL ? selectedPlace.nameAr : selectedPlace.name}</h3>
                            <p>{isRTL ? selectedPlace.descriptionAr : selectedPlace.description}</p>
                            <div className={styles.selectedPlaceActions}>
                                <button
                                    className={styles.primaryBtn}
                                    onClick={() => calculateRoute(selectedPlace)}
                                >
                                    🧭 {labels.getDirections}
                                </button>
                                <Link
                                    href={`/place/${selectedPlace.id}`}
                                    className={styles.secondaryBtn}
                                >
                                    {labels.viewDetails}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
