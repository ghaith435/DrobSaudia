/**
 * Permissions System for Riyadh Guide
 * Defines roles and their permissions
 */

export type Role = 'USER' | 'ADMIN' | 'MODERATOR' | 'PARTNER' | 'PLACE_OWNER';

export type Permission =
    | 'browse_places'
    | 'view_details'
    | 'view_events'
    | 'use_map'
    | 'add_review'
    | 'add_favorite'
    | 'create_trip'
    | 'use_audio_guide'
    | 'use_planner'
    | 'view_rewards'
    | 'redeem_rewards'
    | 'submit_request'
    | 'view_own_requests'
    | 'view_all_requests'
    | 'manage_requests'
    | 'manage_reviews'
    | 'manage_places'
    | 'manage_users'
    | 'manage_settings'
    | 'view_analytics'
    | 'manage_promotions'
    | 'manage_own_place'
    | 'reply_to_reviews';

// Role permissions mapping
const rolePermissions: Record<Role, Permission[]> = {
    USER: [
        'browse_places',
        'view_details',
        'view_events',
        'use_map',
        'add_review',
        'add_favorite',
        'create_trip',
        'use_audio_guide',
        'use_planner',
        'view_rewards',
        'redeem_rewards',
        'submit_request',
        'view_own_requests',
    ],
    MODERATOR: [
        'browse_places',
        'view_details',
        'view_events',
        'use_map',
        'add_review',
        'add_favorite',
        'create_trip',
        'use_audio_guide',
        'use_planner',
        'view_rewards',
        'redeem_rewards',
        'submit_request',
        'view_own_requests',
        'view_all_requests',
        'manage_requests',
        'manage_reviews',
        'manage_places',
    ],
    ADMIN: [
        'browse_places',
        'view_details',
        'view_events',
        'use_map',
        'add_review',
        'add_favorite',
        'create_trip',
        'use_audio_guide',
        'use_planner',
        'view_rewards',
        'redeem_rewards',
        'submit_request',
        'view_own_requests',
        'view_all_requests',
        'manage_requests',
        'manage_reviews',
        'manage_places',
        'manage_users',
        'manage_settings',
        'view_analytics',
        'manage_promotions',
    ],
    PARTNER: [
        'browse_places',
        'view_details',
        'view_events',
        'use_map',
        'add_review',
        'add_favorite',
        'create_trip',
        'use_audio_guide',
        'use_planner',
        'view_rewards',
        'redeem_rewards',
        'submit_request',
        'view_own_requests',
        'manage_promotions',
    ],
    PLACE_OWNER: [
        'browse_places',
        'view_details',
        'view_events',
        'use_map',
        'add_review',
        'add_favorite',
        'create_trip',
        'use_audio_guide',
        'use_planner',
        'view_rewards',
        'redeem_rewards',
        'submit_request',
        'view_own_requests',
        'manage_own_place',
        'reply_to_reviews',
    ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role | undefined, permission: Permission): boolean {
    if (!role) return false;
    return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: Role | undefined, permissions: Permission[]): boolean {
    if (!role) return false;
    return permissions.some(p => hasPermission(role, p));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: Role | undefined, permissions: Permission[]): boolean {
    if (!role) return false;
    return permissions.every(p => hasPermission(role, p));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
    return rolePermissions[role] || [];
}

/**
 * Check if role can access admin dashboard
 */
export function canAccessAdmin(role: Role | undefined): boolean {
    return role === 'ADMIN' || role === 'MODERATOR';
}

/**
 * Check if role can access partner dashboard
 */
export function canAccessPartner(role: Role | undefined): boolean {
    return role === 'PARTNER' || role === 'ADMIN';
}

/**
 * Services that require authentication
 */
export const protectedServices = [
    '/dashboard',
    '/planner',
    '/favorites',
    '/rewards',
    '/requests',
    '/trips',
] as const;

/**
 * Check if a path requires authentication
 */
export function requiresAuth(path: string): boolean {
    return protectedServices.some(service => path.startsWith(service));
}

/**
 * Public services accessible without login
 */
export const publicServices = [
    '/',
    '/places',
    '/events',
    '/tours',
    '/compare',
    '/auth',
] as const;

/**
 * Check if a path is public
 */
export function isPublicPath(path: string): boolean {
    return publicServices.some(service => path.startsWith(service) || path === service);
}
