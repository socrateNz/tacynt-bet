export const FAVORITE_TYPES = ['TEAM', 'COMPETITION', 'MATCH'] as const;
export type FavoriteType = (typeof FAVORITE_TYPES)[number];
