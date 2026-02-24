import Link from 'next/link';
import Image from 'next/image';

const categories = [
    {
        id: 'history',
        name: 'Historical & Heritage',
        description: 'Discover the rich history of Saudi Arabia',
        image: 'https://picsum.photos/seed/history/800/600',
        count: 12
    },
    {
        id: 'modern',
        name: 'Modern Luxury',
        description: 'Experience world-class architecture and lifestyle',
        image: 'https://picsum.photos/seed/modern/800/600',
        count: 8
    },
    {
        id: 'shopping',
        name: 'Shopping',
        description: 'From traditional souks to luxury malls',
        image: 'https://picsum.photos/seed/shopping/800/600',
        count: 15
    },
    {
        id: 'dining',
        name: 'Dining & Cuisine',
        description: 'Taste authentic Saudi and international flavors',
        image: 'https://picsum.photos/seed/dining/800/600',
        count: 20
    },
    {
        id: 'entertainment',
        name: 'Entertainment',
        description: 'Events, festivals, and attractions',
        image: 'https://picsum.photos/seed/entertainment/800/600',
        count: 10
    },
    {
        id: 'nature',
        name: 'Nature & Parks',
        description: 'Green spaces and natural escapes in the city',
        image: 'https://picsum.photos/seed/nature/800/600',
        count: 6
    },
];

export default function Categories() {
    return (
        <main style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '3rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        Explore by <span style={{ color: 'var(--accent-gold)' }}>Category</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>
                        Find your perfect Riyadh experience
                    </p>
                </div>

                {/* Categories Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/places?category=${cat.id}`}
                            className="glass-panel"
                            style={{ borderRadius: '1.5rem', overflow: 'hidden', display: 'block', transition: 'transform 0.3s' }}
                        >
                            <div style={{ position: 'relative', height: '200px' }}>
                                <Image src={cat.image} alt={cat.name} fill className="object-cover" unoptimized />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{cat.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{cat.description}</p>
                                    <span style={{ color: 'var(--accent-gold)', fontSize: '0.875rem', fontWeight: 'bold' }}>
                                        {cat.count} places →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
