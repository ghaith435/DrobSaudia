'use client';

import Link from 'next/link';

export default function OfflinePage() {
    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, var(--bg-deep) 0%, #0f0f1a 100%)',
        }}>
            <div style={{
                textAlign: 'center',
                maxWidth: '500px',
            }}>
                {/* Offline Icon */}
                <div style={{
                    fontSize: '6rem',
                    marginBottom: '2rem',
                    animation: 'pulse 2s ease-in-out infinite',
                }}>
                    📡
                </div>

                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-gold) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
                    You&apos;re Offline
                </h1>

                <p style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '2rem',
                }}>
                    It looks like you&apos;ve lost your internet connection.
                    Don&apos;t worry - some features are still available offline!
                </p>

                {/* Offline Features */}
                <div style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    textAlign: 'left',
                }}>
                    <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        color: 'var(--accent-gold)',
                    }}>
                        Available Offline:
                    </h3>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                    }}>
                        {[
                            '📍 Saved places and favorites',
                            '🗺️ Downloaded tour guides',
                            '📝 Draft reviews (will sync later)',
                            '🏆 Your badges and progress',
                        ].map((item, index) => (
                            <li key={index} style={{
                                padding: '0.5rem 0',
                                color: 'var(--text-secondary)',
                                fontSize: '0.95rem',
                            }}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem 1.75rem',
                            backgroundColor: 'var(--accent-gold)',
                            color: 'black',
                            fontWeight: 700,
                            borderRadius: '9999px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        🔄 Try Again
                    </button>

                    <Link
                        href="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem 1.75rem',
                            backgroundColor: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: 600,
                            borderRadius: '9999px',
                            border: '1px solid var(--glass-border)',
                            textDecoration: 'none',
                            fontSize: '1rem',
                        }}
                    >
                        🏠 Go Home
                    </Link>
                </div>

                {/* Connection Status */}
                <div style={{
                    marginTop: '3rem',
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '0.5rem',
                }}>
                    <p style={{
                        fontSize: '0.875rem',
                        color: '#ef4444',
                        margin: 0,
                    }}>
                        🔴 No internet connection detected
                    </p>
                </div>
            </div>

            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.95); }
                }
            `}</style>
        </main>
    );
}
