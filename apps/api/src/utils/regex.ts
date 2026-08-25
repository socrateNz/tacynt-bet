/** Echappe les caracteres speciaux avant d'injecter une chaine utilisateur dans un RegExp Mongo (anti-ReDoS / injection). */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
