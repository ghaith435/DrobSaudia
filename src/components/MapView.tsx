"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./map.module.css";

interface Place {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    category?: string;
    rating?: number;
    image?: string;
}

interface MapViewProps {
    places: Place[];
    center?: { lat: number; lng: number };
    zoom?: number;
    selectedPlaceId?: string;
    onPlaceSelect?: (place: Place) => void;
    showControls?: boolean;
    height?: string;
}

export default function MapView({
    places,
    center = { lat: 24.7136, lng: 46.6753 }, // Riyadh center
    zoom = 11,
    selectedPlaceId,
    onPlaceSelect,
    showControls = true,
    height = "400px",
}: MapViewProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load Google Maps API
    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            setError("Google Maps API key is not configured");
            return;
        }

        if (typeof google !== "undefined" && google.maps) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsLoaded(true);
        script.onerror = () => setError("Failed to load Google Maps");

        document.head.appendChild(script);

        return () => {
            // Cleanup
            const existingScript = document.querySelector(
                `script[src*="maps.googleapis.com"]`
            );
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    // Initialize map
    useEffect(() => {
        if (!isLoaded || !mapRef.current || map) return;

        const newMap = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
                { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
                {
                    featureType: "administrative.country",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#4b6878" }],
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#304a7d" }],
                },
                {
                    featureType: "road",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#255763" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{ color: "#2c6675" }],
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#0e1626" }],
                },
                {
                    featureType: "poi",
                    stylers: [{ visibility: "off" }],
                },
            ],
            disableDefaultUI: !showControls,
            zoomControl: showControls,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: showControls,
        });

        setMap(newMap);
    }, [isLoaded, center, zoom, showControls, map]);

    // Add markers
    useEffect(() => {
        if (!map || !places.length) return;

        // Clear existing markers
        markers.forEach((marker) => marker.setMap(null));

        const categoryColors: Record<string, string> = {
            History: "#cfb53b",
            Modern: "#3b82f6",
            Shopping: "#ec4899",
            Dining: "#f97316",
            Entertainment: "#8b5cf6",
            Nature: "#22c55e",
        };

        const newMarkers = places.map((place) => {
            const color = categoryColors[place.category || ""] || "#cfb53b";

            const marker = new google.maps.Marker({
                position: { lat: place.latitude, lng: place.longitude },
                map,
                title: place.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: color,
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                    scale: selectedPlaceId === place.id ? 12 : 8,
                },
                animation:
                    selectedPlaceId === place.id
                        ? google.maps.Animation.BOUNCE
                        : undefined,
            });

            // Info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="
                        background: #0f172a;
                        color: #f8fafc;
                        padding: 12px;
                        border-radius: 8px;
                        min-width: 180px;
                    ">
                        ${place.image
                        ? `<img src="${place.image}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" />`
                        : ""
                    }
                        <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">
                            ${place.name}
                        </h3>
                        ${place.category
                        ? `<span style="font-size: 12px; color: ${color};">
                                    ${place.category}
                                </span>`
                        : ""
                    }
                        ${place.rating
                        ? `<span style="float: right; font-size: 12px;">
                                    ⭐ ${place.rating}
                                </span>`
                        : ""
                    }
                    </div>
                `,
            });

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
                onPlaceSelect?.(place);
            });

            return marker;
        });

        setMarkers(newMarkers);

        // Fit bounds to show all markers
        if (newMarkers.length > 1) {
            const bounds = new google.maps.LatLngBounds();
            newMarkers.forEach((marker) => {
                const pos = marker.getPosition();
                if (pos) bounds.extend(pos);
            });
            map.fitBounds(bounds, 50);
        }
    }, [map, places, selectedPlaceId, onPlaceSelect]);

    // Center on selected place
    useEffect(() => {
        if (!map || !selectedPlaceId) return;

        const selectedPlace = places.find((p) => p.id === selectedPlaceId);
        if (selectedPlace) {
            map.panTo({
                lat: selectedPlace.latitude,
                lng: selectedPlace.longitude,
            });
            map.setZoom(15);
        }
    }, [map, selectedPlaceId, places]);

    if (error) {
        return (
            <div className={styles.error} style={{ height }}>
                <span>🗺️</span>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles.container} style={{ height }}>
            {!isLoaded && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading map...</p>
                </div>
            )}
            <div ref={mapRef} className={styles.map} />

            {/* Legend */}
            {showControls && (
                <div className={styles.legend}>
                    <div className={styles.legendItem}>
                        <span style={{ background: "#cfb53b" }}></span> History
                    </div>
                    <div className={styles.legendItem}>
                        <span style={{ background: "#3b82f6" }}></span> Modern
                    </div>
                    <div className={styles.legendItem}>
                        <span style={{ background: "#22c55e" }}></span> Nature
                    </div>
                    <div className={styles.legendItem}>
                        <span style={{ background: "#ec4899" }}></span> Shopping
                    </div>
                </div>
            )}
        </div>
    );
}
