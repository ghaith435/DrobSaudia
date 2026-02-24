import Image from "next/image";
import Link from "next/link";
import { places, Place } from '@/data/places';
import { notFound } from 'next/navigation';
import AudioGuide from '@/components/AudioGuide';
import { CITIES_DATA } from '@/data/cities';

export default async function PlaceDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let place = places.find(p => p.id === id);

    // If not found in general places, check city-specific places
    if (!place) {
        for (const city of CITIES_DATA) {
            const cityPlace = city.places.find(p => p.id === id);
            if (cityPlace) {
                // Adapt CityPlace to Place interface
                place = {
                    id: cityPlace.id,
                    name: cityPlace.name,
                    nameAr: cityPlace.nameAr,
                    category: cityPlace.category as any,
                    description: cityPlace.description,
                    image: cityPlace.image,
                    rating: cityPlace.rating,
                    // Default values for fields missing in CityPlace
                    location: { lat: 0, lng: 0, address: city.name },
                    price: 'Free',
                    reviewCount: 0,
                    gallery: [cityPlace.image],
                    features: ['Tourist Attraction'],
                    descriptionAr: cityPlace.descriptionAr
                };
                break;
            }
        }
    }

    if (!place) {
        notFound();
    }

    const similarPlaces = places.filter(p => p.category === place?.category && p.id !== place?.id).slice(0, 2);

    return (
        <main style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '3rem' }}>
            {/* Hero Image */}
            <div style={{ position: 'relative', height: '50vh', width: '100%' }}>
                <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover"
                    unoptimized
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-deep), transparent)' }} />
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ marginTop: '-100px', position: 'relative', zIndex: 10 }}>
                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: 'var(--accent-gold)', color: 'black', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                            {place.category}
                        </span>
                        <span className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                            ⭐ {place.rating}
                        </span>
                        <span className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                            {place.price}
                        </span>
                        {place.reviewCount && (
                            <span className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                                💬 {place.reviewCount} reviews
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{place.name}</h1>

                    {/* Arabic Name */}
                    {place.nameAr && (
                        <p style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1rem', fontFamily: 'var(--font-arabic, inherit)' }}>
                            {place.nameAr}
                        </p>
                    )}

                    {/* Location */}
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📍 {place.location.address}
                    </p>

                    {/* Two Column Layout */}
                    <div style={{ display: 'grid', gap: '2rem', marginBottom: '2rem' }} className="placeDetailsGrid">
                        {/* Left Column - Main Content */}
                        <div>
                            {/* Description */}
                            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    📖 About
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{place.description}</p>
                            </div>

                            {/* Features */}
                            {place.features && place.features.length > 0 && (
                                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        ✨ Features
                                    </h2>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                        {place.features.map((feature, idx) => (
                                            <span
                                                key={idx}
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(207, 181, 59, 0.2), rgba(207, 181, 59, 0.1))',
                                                    border: '1px solid rgba(207, 181, 59, 0.3)',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.875rem',
                                                    color: 'var(--accent-gold)'
                                                }}
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Opening Hours & Contact */}
                            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ℹ️ Information
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {place.openingHours && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '1.5rem' }}>🕐</span>
                                            <div>
                                                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Opening Hours</p>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{place.openingHours}</p>
                                            </div>
                                        </div>
                                    )}
                                    {place.phone && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '1.5rem' }}>📞</span>
                                            <div>
                                                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Phone</p>
                                                <a href={`tel:${place.phone}`} style={{ color: 'var(--accent-gold)', fontSize: '0.9rem' }}>{place.phone}</a>
                                            </div>
                                        </div>
                                    )}
                                    {place.website && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '1.5rem' }}>🌐</span>
                                            <div>
                                                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Website</p>
                                                <a href={place.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', fontSize: '0.9rem' }}>{place.website}</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Audio Guide & Actions */}
                        <div>
                            {/* AI Audio Guide */}
                            <div style={{ marginBottom: '2rem' }}>
                                <AudioGuide placeId={place.id} placeName={place.name} />
                            </div>

                            {/* Actions */}
                            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Actions</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <button
                                        style={{
                                            backgroundColor: 'var(--accent-gold)',
                                            color: 'black',
                                            padding: '1rem',
                                            borderRadius: '0.75rem',
                                            fontWeight: 'bold',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'transform 0.2s, box-shadow 0.2s'
                                        }}
                                    >
                                        🗺️ Get Directions
                                    </button>
                                    <button
                                        className="glass-panel"
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '0.75rem',
                                            fontWeight: 'bold',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            cursor: 'pointer',
                                            color: 'var(--text-primary)',
                                            background: 'rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        ❤️ Save to Wishlist
                                    </button>
                                    <Link
                                        href={`/compare?ids=${place.id}`}
                                        className="glass-panel"
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '0.75rem',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        ⚖️ Compare
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Places */}
                    {similarPlaces.length > 0 && (
                        <div style={{ marginTop: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                🏛️ Similar Places
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {similarPlaces.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/place/${p.id}`}
                                        className="glass-panel"
                                        style={{
                                            borderRadius: '1rem',
                                            overflow: 'hidden',
                                            display: 'block',
                                            transition: 'transform 0.3s, box-shadow 0.3s'
                                        }}
                                    >
                                        <div style={{ position: 'relative', height: '150px' }}>
                                            <Image src={p.image} alt={p.name} fill className="object-cover" unoptimized />
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '0.5rem',
                                                right: '0.5rem',
                                                backgroundColor: 'rgba(0,0,0,0.7)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                            }}>
                                                ⭐ {p.rating}
                                            </div>
                                        </div>
                                        <div style={{ padding: '1rem' }}>
                                            <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{p.name}</h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{p.location.address}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

