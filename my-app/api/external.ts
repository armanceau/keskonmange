import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callMistral } from "../server/mistral";
import { buildExternalPrompt } from "../server/prompts/externalPrompt";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  const allowedOrigins = new Set([
    "http://localhost:3000",
    "https://axelle-a-table.vercel.app",
  ]);

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key" });
  }

  const dishes = toStringArray(req.body?.dishes);
  if (dishes.length === 0) {
    return res.status(400).json({ error: "Missing dishes" });
  }

  const prompt = buildExternalPrompt({
    dishes,
    regime: asOptionalString(req.body?.regime),
    count: asOptionalNumber(req.body?.count),
  });

  try {
    const result = await callMistral(apiKey, [
      { role: "system", content: "Tu es un assistant culinaire." },
      { role: "user", content: prompt },
    ]);

    return res.status(200).json({ result });
  } catch (error) {
    console.error("Mistral error:", error);
    return res.status(502).json({ error: "Upstream API error" });
  }
}
