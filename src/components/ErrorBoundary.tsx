"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', minHeight: '300px', padding: '2rem',
                    background: 'rgba(15, 23, 42, 0.6)', borderRadius: '1rem',
                    border: '1px solid rgba(255,255,255,0.08)', margin: '2rem', textAlign: 'center'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h2 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                        حدث خطأ غير متوقع
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem', maxWidth: '400px' }}>
                        {this.state.error?.message || 'نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.'}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        style={{
                            background: '#d9b063', color: '#000', border: 'none',
                            padding: '0.75rem 2rem', borderRadius: '9999px',
                            fontWeight: 700, cursor: 'pointer', fontSize: '1rem'
                        }}
                    >
                        حاول مرة أخرى
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
