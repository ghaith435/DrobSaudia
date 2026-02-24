'use client';

import { useState } from 'react';
import Image from 'next/image';
import { places, Place } from '@/data/places';

export default function ComparePage() {
    const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);

    const togglePlace = (place: Place) => {
        if (selectedPlaces.find(p => p.id === place.id)) {
            setSelectedPlaces(selectedPlaces.filter(p => p.id !== place.id));
        } else if (selectedPlaces.length < 3) {
            setSelectedPlaces([...selectedPlaces, place]);
        }
    };

    return (
        <main style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '3rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        Compare <span style={{ color: 'var(--accent-gold)' }}>Places</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>
                        Select up to 3 places to compare side by side
                    </p>
                </div>

                {/* Selection */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Select places to compare ({selectedPlaces.length}/3):</h3>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {places.map((place) => (
                            <button
                                key={place.id}
                                onClick={() => togglePlace(place)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '9999px',
                                    border: selectedPlaces.find(p => p.id === place.id) ? '2px solid var(--accent-gold)' : '1px solid var(--glass-border)',
                                    backgroundColor: selectedPlaces.find(p => p.id === place.id) ? 'var(--accent-gold)' : 'transparent',
                                    color: selectedPlaces.find(p => p.id === place.id) ? 'black' : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {place.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comparison Table */}
                {selectedPlaces.length > 0 && (
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>Feature</th>
                                    {selectedPlaces.map(place => (
                                        <th key={place.id} style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--glass-border)', minWidth: '200px' }}>
                                            <div style={{ position: 'relative', height: '100px', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                                <Image src={place.image} alt={place.name} fill className="object-cover" unoptimized />
                                            </div>
                                            <span style={{ fontWeight: 'bold' }}>{place.name}</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>Category</td>
                                    {selectedPlaces.map(place => (
                                        <td key={place.id} style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                                            <span style={{ backgroundColor: 'var(--accent-gold)', color: 'black', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                {place.category}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>Rating</td>
                                    {selectedPlaces.map(place => (
                                        <td key={place.id} style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--glass-border)', fontWeight: 'bold', fontSize: '1.25rem' }}>
                                            ⭐ {place.rating}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>Price Range</td>
                                    {selectedPlaces.map(place => (
                                        <td key={place.id} style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--glass-border)', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                                            {place.price}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>Location</td>
                                    {selectedPlaces.map(place => (
                                        <td key={place.id} style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--glass-border)', fontSize: '0.875rem' }}>
                                            📍 {place.location.address}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Description</td>
                                    {selectedPlaces.map(place => (
                                        <td key={place.id} style={{ textAlign: 'center', padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            {place.description.substring(0, 100)}...
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedPlaces.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                        <p style={{ fontSize: '1.25rem' }}>👆 Select places above to start comparing</p>
                    </div>
                )}
            </div>
        </main>
    );
}
