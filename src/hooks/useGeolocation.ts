"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export interface GeofenceZone {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    radius: number; // meters
    isActive: boolean;
}

export interface UserLocation {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
    heading?: number;
    speed?: number;
}

export interface GeofenceEvent {
    type: 'enter' | 'exit' | 'dwell';
    zone: GeofenceZone;
    timestamp: number;
    userLocation: UserLocation;
}

interface UseGeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    watchPosition?: boolean;
    geofenceRadius?: number; // default 50 meters
}

interface UseGeolocationReturn {
    location: UserLocation | null;
    error: string | null;
    isLoading: boolean;
    isWatching: boolean;
    activeZone: GeofenceZone | null;
    geofenceEvents: GeofenceEvent[];
    startTracking: () => void;
    stopTracking: () => void;
    calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
    checkGeofences: (zones: GeofenceZone[]) => GeofenceZone | null;
    getDirections: (destination: { lat: number; lng: number }) => void;
}

// Haversine formula to calculate distance between two points
function calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

export function useGeolocation(
    options: UseGeolocationOptions = {}
): UseGeolocationReturn {
    const {
        enableHighAccuracy = true,
        timeout = 10000,
        maximumAge = 0,
        watchPosition = false,
        geofenceRadius = 50,
    } = options;

    const [location, setLocation] = useState<UserLocation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isWatching, setIsWatching] = useState(false);
    const [activeZone, setActiveZone] = useState<GeofenceZone | null>(null);
    const [geofenceEvents, setGeofenceEvents] = useState<GeofenceEvent[]>([]);

    const watchIdRef = useRef<number | null>(null);
    const previousZonesRef = useRef<Set<string>>(new Set());

    const handleSuccess = useCallback(
        (position: GeolocationPosition) => {
            const newLocation: UserLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp,
                heading: position.coords.heading ?? undefined,
                speed: position.coords.speed ?? undefined,
            };
            setLocation(newLocation);
            setError(null);
            setIsLoading(false);
        },
        []
    );

    const handleError = useCallback((err: GeolocationPositionError) => {
        let errorMessage = "خطأ في تحديد الموقع";
        switch (err.code) {
            case err.PERMISSION_DENIED:
                errorMessage = "تم رفض إذن تحديد الموقع. الرجاء السماح بالوصول للموقع.";
                break;
            case err.POSITION_UNAVAILABLE:
                errorMessage = "معلومات الموقع غير متاحة";
                break;
            case err.TIMEOUT:
                errorMessage = "انتهت مهلة طلب الموقع";
                break;
        }
        setError(errorMessage);
        setIsLoading(false);
    }, []);

    const startTracking = useCallback(() => {
        if (!navigator.geolocation) {
            setError("المتصفح لا يدعم تحديد الموقع الجغرافي");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setIsWatching(true);

        const geoOptions: PositionOptions = {
            enableHighAccuracy,
            timeout,
            maximumAge,
        };

        if (watchPosition) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                handleSuccess,
                handleError,
                geoOptions
            );
        } else {
            navigator.geolocation.getCurrentPosition(
                handleSuccess,
                handleError,
                geoOptions
            );
            setIsWatching(false);
        }
    }, [enableHighAccuracy, timeout, maximumAge, watchPosition, handleSuccess, handleError]);

    const stopTracking = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsWatching(false);
    }, []);

    const checkGeofences = useCallback(
        (zones: GeofenceZone[]): GeofenceZone | null => {
            if (!location) return null;

            const currentZones = new Set<string>();
            let foundZone: GeofenceZone | null = null;

            for (const zone of zones) {
                if (!zone.isActive) continue;

                const distance = calculateHaversineDistance(
                    location.latitude,
                    location.longitude,
                    zone.latitude,
                    zone.longitude
                );

                const effectiveRadius = zone.radius || geofenceRadius;

                if (distance <= effectiveRadius) {
                    currentZones.add(zone.id);

                    // Check for enter event
                    if (!previousZonesRef.current.has(zone.id)) {
                        const event: GeofenceEvent = {
                            type: 'enter',
                            zone,
                            timestamp: Date.now(),
                            userLocation: location,
                        };
                        setGeofenceEvents(prev => [...prev, event]);
                        setActiveZone(zone);
                        foundZone = zone;
                    }
                } else {
                    // Check for exit event
                    if (previousZonesRef.current.has(zone.id)) {
                        const event: GeofenceEvent = {
                            type: 'exit',
                            zone,
                            timestamp: Date.now(),
                            userLocation: location,
                        };
                        setGeofenceEvents(prev => [...prev, event]);

                        if (activeZone?.id === zone.id) {
                            setActiveZone(null);
                        }
                    }
                }
            }

            previousZonesRef.current = currentZones;
            return foundZone;
        },
        [location, geofenceRadius, activeZone]
    );

    const getDirections = useCallback(
        (destination: { lat: number; lng: number }) => {
            if (!location) {
                console.error("User location not available");
                return;
            }

            const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
            window.open(url, "_blank");
        },
        [location]
    );

    // Auto-start tracking on mount if watchPosition is true
    useEffect(() => {
        if (watchPosition) {
            startTracking();
        } else {
            // Just get current position once
            startTracking();
        }

        return () => {
            stopTracking();
        };
    }, [watchPosition, startTracking, stopTracking]);

    return {
        location,
        error,
        isLoading,
        isWatching,
        activeZone,
        geofenceEvents,
        startTracking,
        stopTracking,
        calculateDistance: calculateHaversineDistance,
        checkGeofences,
        getDirections,
    };
}

// Utility function to create geofence zones from places
export function createGeofenceZones(
    places: Array<{
        id: string;
        name: string;
        latitude?: number;
        longitude?: number;
        location?: { lat: number; lng: number };
    }>,
    radius: number = 50
): GeofenceZone[] {
    return places.map((place) => ({
        id: place.id,
        name: place.name,
        latitude: place.latitude ?? place.location?.lat ?? 0,
        longitude: place.longitude ?? place.location?.lng ?? 0,
        radius,
        isActive: true,
    }));
}

// Format distance for display
export function formatDistance(meters: number, locale: 'en' | 'ar' = 'en'): string {
    if (meters < 1000) {
        return locale === 'ar'
            ? `${Math.round(meters)} متر`
            : `${Math.round(meters)}m`;
    }
    const km = meters / 1000;
    return locale === 'ar'
        ? `${km.toFixed(1)} كم`
        : `${km.toFixed(1)}km`;
}

export default useGeolocation;
