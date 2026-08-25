/** Mongoose infere `T | null` pour les champs optionnels ; nos DTOs partages veulent `T | undefined`. */
export function orUndefined<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}
