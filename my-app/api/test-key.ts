import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Clé API non trouvée 🕵️‍♂️" });
  }

  const { ingredients } = req.body; 

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: "Aucun ingrédient fourni." });
  }

  const prompt = `
    Tu es un chef cuisinier expert. En te basant sur ces ingrédients : ${ingredients.join(
      ", "
    )},
    propose-moi une recette adaptée aux étudiants :
    - Titre de la recette
    - Temps de préparation
    - Liste complète des ingrédients (avec quantités approximatives)
    - Étapes détaillées de la préparation
    - Astuces et variantes possibles
  `.trim();

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
            role: 'system',
            content: 'Tu es un assistant culinaire amical et précis.',
          },
          {
            role: 'user',
            content: prompt,
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