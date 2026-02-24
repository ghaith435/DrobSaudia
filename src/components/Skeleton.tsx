"use client";

import styles from "./Skeleton.module.css";

interface SkeletonProps {
    width?: string;
    height?: string;
    borderRadius?: string;
    className?: string;
}

export function Skeleton({ width = "100%", height = "1rem", borderRadius = "0.5rem", className }: SkeletonProps) {
    return (
        <div
            className={`${styles.skeleton} ${className || ""}`}
            style={{ width, height, borderRadius }}
        />
    );
}

export function PlaceCardSkeleton() {
    return (
        <div className={styles.cardSkeleton}>
            <Skeleton height="200px" borderRadius="1rem 1rem 0 0" />
            <div className={styles.cardBody}>
                <Skeleton height="1.2rem" width="70%" />
                <Skeleton height="0.9rem" width="40%" />
                <Skeleton height="0.8rem" width="100%" />
                <Skeleton height="0.8rem" width="80%" />
                <div className={styles.cardFooter}>
                    <Skeleton height="2rem" width="80px" borderRadius="9999px" />
                    <Skeleton height="1rem" width="60px" />
                </div>
            </div>
        </div>
    );
}

export function TourCardSkeleton() {
    return (
        <div className={styles.cardSkeleton}>
            <Skeleton height="180px" borderRadius="1rem 1rem 0 0" />
            <div className={styles.cardBody}>
                <Skeleton height="1.2rem" width="80%" />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Skeleton height="1.5rem" width="60px" borderRadius="9999px" />
                    <Skeleton height="1.5rem" width="70px" borderRadius="9999px" />
                    <Skeleton height="1.5rem" width="50px" borderRadius="9999px" />
                </div>
                <Skeleton height="0.8rem" width="100%" />
                <Skeleton height="0.8rem" width="60%" />
            </div>
        </div>
    );
}

export function EventCardSkeleton() {
    return (
        <div className={styles.eventSkeleton}>
            <Skeleton height="140px" width="140px" borderRadius="1rem" />
            <div className={styles.cardBody} style={{ flex: 1 }}>
                <Skeleton height="0.7rem" width="100px" borderRadius="9999px" />
                <Skeleton height="1.2rem" width="80%" />
                <Skeleton height="0.8rem" width="60%" />
                <Skeleton height="0.8rem" width="40%" />
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className={styles.profileSkeleton}>
            <Skeleton width="80px" height="80px" borderRadius="50%" />
            <Skeleton height="1.5rem" width="200px" />
            <Skeleton height="1rem" width="150px" />
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <Skeleton height="3rem" width="100px" borderRadius="0.75rem" />
                <Skeleton height="3rem" width="100px" borderRadius="0.75rem" />
                <Skeleton height="3rem" width="100px" borderRadius="0.75rem" />
            </div>
        </div>
    );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className={styles.gridSkeleton}>
            {Array.from({ length: count }).map((_, i) => (
                <PlaceCardSkeleton key={i} />
            ))}
        </div>
    );
}
