'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression, LatLngBoundsExpression } from 'leaflet';

// Dynamically import Leaflet components (they require window object)
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);
const Polyline = dynamic(
    () => import('react-leaflet').then((mod) => mod.Polyline),
    { ssr: false }
);


export interface MapMarker {
    id: string;
    position: [number, number];
    title: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    icon?: 'default' | 'destination' | 'current' | 'waypoint';
    category?: string;
}

export interface Route {
    coordinates: [number, number][];
    color?: string;
    weight?: number;
}

interface InteractiveMapProps {
    center?: [number, number];
    zoom?: number;
    markers?: MapMarker[];
    route?: Route;
    onMarkerClick?: (marker: MapMarker) => void;
    onMapClick?: (lat: number, lng: number) => void;
    showUserLocation?: boolean;
    height?: string;
    className?: string;
    fitBounds?: boolean;
}

// Custom marker icons
const createIcon = (type: string) => {
    if (typeof window === 'undefined') return null;

    const L = require('leaflet');

    const iconConfigs: Record<string, { color: string; emoji: string }> = {
        default: { color: '#d9b063', emoji: '📍' },
        destination: { color: '#10b981', emoji: '🎯' },
        current: { color: '#3b82f6', emoji: '📌' },
        waypoint: { color: '#8b5cf6', emoji: '🔵' },
    };

    const config = iconConfigs[type] || iconConfigs.default;

    return L.divIcon({
        html: `<div style="
      background: ${config.color};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 3px solid white;
    ">${config.emoji}</div>`,
        className: 'custom-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
    });
};

// Component to fit bounds to markers
function FitBoundsComponent({ markers }: { markers: MapMarker[] }) {
    const map = require('react-leaflet').useMap();

    useEffect(() => {
        if (markers.length > 0 && typeof window !== 'undefined') {
            const L = require('leaflet');
            const bounds = L.latLngBounds(markers.map(m => m.position));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [markers, map]);

    return null;
}

// Component to handle user location
function UserLocationMarker({ onLocationFound }: { onLocationFound?: (lat: number, lng: number) => void }) {
    const map = require('react-leaflet').useMap();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        map.locate({ setView: false });

        map.on('locationfound', (e: any) => {
            if (onLocationFound) {
                onLocationFound(e.latlng.lat, e.latlng.lng);
            }
        });
    }, [map, onLocationFound]);

    return null;
}

export default function InteractiveMap({
    center = [24.7136, 46.6753], // Riyadh default
    zoom = 12,
    markers = [],
    route,
    onMarkerClick,
    onMapClick,
    showUserLocation = false,
    height = '500px',
    className = '',
    fitBounds = false,
}: InteractiveMapProps) {



    return (
        <div className={className} style={{ height, width: '100%' }}>
            <MapContainer
                center={center as LatLngExpression}
                zoom={zoom}
                style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
                scrollWheelZoom={true}
            >
                {/* OpenStreetMap Tile Layer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Alternative: Dark theme tile layer */}
                {/* 
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        */}

                {/* Markers */}
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={marker.position as LatLngExpression}
                        icon={createIcon(marker.icon || 'default')}
                        eventHandlers={{
                            click: () => onMarkerClick?.(marker),
                        }}
                    >
                        <Popup>
                            <div style={{
                                minWidth: '150px',
                                textAlign: 'center',
                                fontFamily: 'inherit',
                            }}>
                                <strong style={{ fontSize: '14px', color: '#1a1a1a' }}>
                                    {marker.title}
                                </strong>
                                {marker.description && (
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#666',
                                        margin: '8px 0 0',
                                        lineHeight: '1.4',
                                    }}>
                                        {marker.description}
                                    </p>
                                )}
                                {marker.category && (
                                    <span style={{
                                        display: 'inline-block',
                                        background: '#d9b063',
                                        color: '#000',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '10px',
                                        marginTop: '8px',
                                        fontWeight: '600',
                                    }}>
                                        {marker.category}
                                    </span>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Route Line */}
                {route && route.coordinates.length > 1 && (
                    <Polyline
                        positions={route.coordinates as LatLngExpression[]}
                        color={route.color || '#d9b063'}
                        weight={route.weight || 4}
                        opacity={0.8}
                    />
                )}

                {/* Fit bounds to markers */}
                {fitBounds && markers.length > 1 && (
                    <FitBoundsComponent markers={markers} />
                )}

                {/* User location tracking */}
                {showUserLocation && (
                    <UserLocationMarker />
                )}
            </MapContainer>
        </div>
    );
}
