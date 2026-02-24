'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProviderBase } from 'posthog-js/react';
import { useEffect } from 'react';

// Initialize PostHog
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        persistence: 'localStorage',

        // Respect user privacy
        respect_dnt: true,
        opt_out_capturing_by_default: false,

        // Session recording (optional)
        enable_recording_console_log: false,

        // Feature flags
        bootstrap: {},

        loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') {
                // Don't track in dev by default
                // posthog.opt_out_capturing();
            }
        },
    });
}

// PostHog provider component
export function PostHogProvider({ children }: { children: React.ReactNode }) {
    return (
        <PHProviderBase client= { posthog } >
        { children }
        </PHProviderBase>
  );
}

// Custom event tracking helpers
export const analytics = {
    // User events
    identify: (userId: string, properties?: Record<string, unknown>) => {
        posthog.identify(userId, properties);
    },

    // Page views
    pageView: (pageName: string, properties?: Record<string, unknown>) => {
        posthog.capture('$pageview', { pageName, ...properties });
    },

    // Place events
    placeViewed: (placeId: string, placeName: string) => {
        posthog.capture('place_viewed', { placeId, placeName });
    },

    placeSearched: (query: string, resultsCount: number) => {
        posthog.capture('place_searched', { query, resultsCount });
    },

    // Tour events
    tourStarted: (tourId: string, tourName: string) => {
        posthog.capture('tour_started', { tourId, tourName });
    },

    tourCompleted: (tourId: string, tourName: string, durationMinutes: number) => {
        posthog.capture('tour_completed', { tourId, tourName, durationMinutes });
    },

    // Review events
    reviewSubmitted: (placeId: string, rating: number) => {
        posthog.capture('review_submitted', { placeId, rating });
    },

    // Booking events
    bookingStarted: (experienceId: string) => {
        posthog.capture('booking_started', { experienceId });
    },

    bookingCompleted: (bookingId: string, amount: number) => {
        posthog.capture('booking_completed', { bookingId, amount, currency: 'SAR' });
    },

    // Reward events
    xpEarned: (action: string, amount: number) => {
        posthog.capture('xp_earned', { action, amount });
    },

    badgeEarned: (badgeId: string, badgeName: string) => {
        posthog.capture('badge_earned', { badgeId, badgeName });
    },

    rewardRedeemed: (rewardId: string, pointsCost: number) => {
        posthog.capture('reward_redeemed', { rewardId, pointsCost });
    },

    // AI events
    chatMessage: (type: string, messageLength: number) => {
        posthog.capture('ai_chat_message', { type, messageLength });
    },

    voiceCommand: (command: string) => {
        posthog.capture('voice_command', { command });
    },

    // AR events
    arSessionStarted: () => {
        posthog.capture('ar_session_started');
    },

    arPlaceRecognized: (placeId: string) => {
        posthog.capture('ar_place_recognized', { placeId });
    },

    // Share events
    contentShared: (contentType: string, platform: string) => {
        posthog.capture('content_shared', { contentType, platform });
    },

    // Generic event
    track: (event: string, properties?: Record<string, unknown>) => {
        posthog.capture(event, properties);
    },
};

export { posthog };
