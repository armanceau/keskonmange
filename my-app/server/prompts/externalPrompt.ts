export type ExternalPromptParams = {
  dishes: string[];
  regime?: string;
  count?: number;
};

export function buildExternalPrompt({
  dishes,
  regime,
  count = 5,
}: ExternalPromptParams): string {
  const safeCount = Math.max(1, Math.min(10, count));

  return `
Tu es un assistant culinaire.

Voici une liste de plats deja proposes : ${dishes.join(", ")}
${regime ? `Regime : ${regime}.` : ""}

Propose ${safeCount} nouvelles idees de plats DIFFERENTES de la liste.
Format de sortie : une idee par ligne, sans numerotation.
Pas d'emojis. Pas d'introduction.
`.trim();
}
