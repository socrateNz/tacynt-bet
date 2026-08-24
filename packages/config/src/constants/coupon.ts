/** Suivi du resultat reel d'un coupon (une fois les matchs joues). */
export const COUPON_STATUSES = ['PENDING', 'WON', 'LOST', 'VOID'] as const;
export type CouponStatus = (typeof COUPON_STATUSES)[number];
