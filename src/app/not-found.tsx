'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--bg-deep) 0%, #0f0f1a 50%, #1a0f15 100%)',
        }}>
            {/* Animated Background Elements */}
            <div style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}>
                {/* Floating circles */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(217, 176, 99, 0.1) 0%, transparent 70%)',
                    animation: 'float 8s ease-in-out infinite',
                    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '15%',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(217, 176, 99, 0.08) 0%, transparent 70%)',
                    animation: 'float 6s ease-in-out infinite reverse',
                    transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
                }} />
            </div>

            {/* Content */}
            <div style={{
                textAlign: 'center',
                position: 'relative',
                zIndex: 10,
                maxWidth: '600px',
            }}>
                {/* 404 Number with Gold Gradient */}
                <h1 style={{
                    fontSize: 'clamp(8rem, 25vw, 15rem)',
                    fontWeight: 800,
                    lineHeight: 1,
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, var(--accent-gold) 0%, #f4e4bc 50%, var(--accent-gold-dim) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 100px rgba(217, 176, 99, 0.3)',
                    transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                    transition: 'transform 0.1s ease-out',
                }}>
                    404
                </h1>

                {/* Lost in the Desert */}
                <div style={{
                    marginBottom: '2rem',
                }}>
                    <h2 style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        fontWeight: 700,
                        marginBottom: '1rem',
                        color: 'var(--text-primary)',
                    }}>
                        🏜️ Lost in the Desert
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        maxWidth: '450px',
                        margin: '0 auto',
                    }}>
                        The page you&apos;re looking for has wandered off into the Arabian dunes.
                        Let us guide you back to discover Riyadh&apos;s treasures.
                    </p>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    justifyContent: 'center',
                    marginTop: '2.5rem',
                }}>
                    <Link
                        href="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '1rem 2rem',
                            backgroundColor: 'var(--accent-gold)',
                            color: 'black',
                            fontWeight: 700,
                            borderRadius: '9999px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 20px rgba(217, 176, 99, 0.3)',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(217, 176, 99, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(217, 176, 99, 0.3)';
                        }}
                    >
                        🏠 Return Home
                    </Link>

                    <Link
                        href="/places"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '1rem 2rem',
                            backgroundColor: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: 600,
                            borderRadius: '9999px',
                            textDecoration: 'none',
                            border: '1px solid var(--glass-border)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-gold)';
                            e.currentTarget.style.color = 'var(--accent-gold)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                    >
                        📍 Explore Places
                    </Link>
                </div>

                {/* Quick Links */}
                <div style={{
                    marginTop: '4rem',
                    padding: '2rem',
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '1.5rem',
                }}>
                    <p style={{
                        color: 'var(--text-secondary)',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                    }}>
                        Popular Destinations
                    </p>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        justifyContent: 'center',
                    }}>
                        {[
                            { name: 'Tours', href: '/tours', icon: '🗺️' },
                            { name: 'Events', href: '/events', icon: '🎪' },
                            { name: 'Rewards', href: '/rewards', icon: '🏆' },
                            { name: 'Planner', href: '/planner', icon: '🤖' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    padding: '0.5rem 1rem',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    textDecoration: 'none',
                                    borderRadius: '0.5rem',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.color = 'var(--accent-gold)';
                                    e.currentTarget.style.background = 'rgba(217, 176, 99, 0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {link.icon} {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* CSS Keyframes */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-30px); }
                }
            `}</style>
        </main>
    );
}
