"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./OmniSearch.module.css";

interface SearchResult {
    id: string;
    type: "place" | "tour" | "event" | "experience";
    title: string;
    titleAr?: string;
    description: string;
    image?: string;
    rating?: number;
    category?: string;
    url: string;
}

export default function OmniSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"all" | "place" | "tour" | "event" | "experience">("all");
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Keyboard shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const performSearch = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${activeTab}`);
            const data = await response.json();
            if (data.success) {
                setResults(data.data || []);
            }
        } catch {
            console.error("Search error");
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => performSearch(query), 300);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [query, performSearch]);

    const typeIcons: Record<string, string> = {
        place: "📍", tour: "🎧", event: "🎉", experience: "✨"
    };

    const typeLabels: Record<string, string> = {
        all: "الكل", place: "أماكن", tour: "جولات", event: "فعاليات", experience: "تجارب"
    };

    const tabs = ["all", "place", "tour", "event", "experience"] as const;

    return (
        <div className={styles.searchContainer} ref={searchRef}>
            <div className={styles.searchInputWrapper}>
                <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.searchInput}
                    placeholder="ابحث عن أماكن، جولات، فعاليات..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                    onFocus={() => setIsOpen(true)}
                    id="omnisearch-input"
                />
                <kbd className={styles.shortcut}>⌘K</kbd>
            </div>

            {isOpen && (query.length > 0 || results.length > 0) && (
                <div className={styles.dropdown}>
                    {/* Tabs */}
                    <div className={styles.tabs}>
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {typeLabels[tab]}
                            </button>
                        ))}
                    </div>

                    {/* Results */}
                    <div className={styles.results}>
                        {isLoading ? (
                            <div className={styles.loading}>
                                <div className={styles.spinner} />
                                <span>جارٍ البحث...</span>
                            </div>
                        ) : results.length === 0 ? (
                            <div className={styles.empty}>
                                <span>🔍</span>
                                <p>لا توجد نتائج لـ &quot;{query}&quot;</p>
                            </div>
                        ) : (
                            results.map((result) => (
                                <Link
                                    key={`${result.type}-${result.id}`}
                                    href={result.url}
                                    className={styles.resultItem}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className={styles.resultIcon}>
                                        {result.image ? (
                                            <img src={result.image} alt="" className={styles.resultImage} />
                                        ) : (
                                            <span>{typeIcons[result.type]}</span>
                                        )}
                                    </div>
                                    <div className={styles.resultContent}>
                                        <div className={styles.resultTitle}>{result.titleAr || result.title}</div>
                                        <div className={styles.resultMeta}>
                                            <span className={styles.resultType}>{typeIcons[result.type]} {typeLabels[result.type]}</span>
                                            {result.rating && <span className={styles.resultRating}>⭐ {result.rating}</span>}
                                            {result.category && <span className={styles.resultCategory}>{result.category}</span>}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
