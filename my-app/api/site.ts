import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callMistral } from "../server/mistral";
import { buildSitePrompt } from "../server/prompts/sitePrompt";

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const asOptionalString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;

const asOptionalNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const asOptionalBoolean = (value: unknown): boolean | undefined =>
  typeof value === "boolean" ? value : undefined;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key" });
  }

  const ingredients = toStringArray(req.body?.ingredients);
  if (ingredients.length === 0) {
    return res.status(400).json({ error: "Missing ingredients" });
  }

  const prompt = buildSitePrompt({
    ingredients,
    regime: asOptionalString(req.body?.regime),
    personne: asOptionalString(req.body?.personne),
    tempsPreparation: asOptionalNumber(req.body?.tempsPreparation),
    platChaud: asOptionalBoolean(req.body?.platChaud),
  });

  try {
    const result = await callMistral(apiKey, [
      { role: "system", content: "Tu es un assistant culinaire amical et précis." },
      { role: "user", content: prompt },
    ]);

    return res.status(200).json({ result });
  } catch (error) {
    console.error("Mistral error:", error);
    return res.status(502).json({ error: "Upstream API error" });
  }
}
