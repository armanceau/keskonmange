import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.VITE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Clé API non trouvée 🕵️‍♂️" });
  }

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages: [
          {
            role: 'user',
            content: 'Quel est le meilleur fromage français ?',
          },
        ],
      }),
    });

    const raw = await response.text();
    console.log('Réponse brute de Mistral:', raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      return res.status(500).json({ error: 'Réponse Mistral non JSON', raw });
    }

    res.status(200).json({ result: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la requête à Mistral.' });
  }
}