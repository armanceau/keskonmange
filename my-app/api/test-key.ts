import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.VITE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Clé API non trouvée 🕵️‍♂️" });
  }

  // const response = await fetch("https://api.mistral.ai/v1/generate", {
  //   method: "POST",
  //   headers: {
  //     "Authorization": `Bearer ${apiKey}`,
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({ prompt: "Recette de pâtes", ... })
  // });

  // const data = await response.json();
  // res.status(200).json(data);
}