import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse){
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Clé API non trouvée 🕵️‍♂️" });
  }

  res.status(200).json({ key: apiKey });
}