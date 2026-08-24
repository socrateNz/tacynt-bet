export const USER_ROLES = ['USER', 'ADMIN', 'SUPER_ADMIN'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_PLANS = ['FREE', 'PREMIUM'] as const;
export type UserPlan = (typeof USER_PLANS)[number];
