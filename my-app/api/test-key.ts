import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Clé API non trouvée 🕵️‍♂️" });
  }
  const { ingredients, regime, personne } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: "Aucun ingrédient fourni." });
  }

  const prompt = `
    Tu es un chef cuisinier français expert. 

    En te basant uniquement sur les ingrédients suivants : ${ingredients.join(
      ", "
    )},${regime ? ` en respectant un régime ${regime},` : ""}${
    personne ? ` pour ${personne},` : ""
  }

    propose-moi une recette simple et rapide, adaptée aux étudiants, réalisable en moins de 25 minutes, sans utiliser de four. 

    La recette doit être claire, fluide, sans fautes de grammaire, d'orthographe ou de syntaxe, avec un style naturel et agréable à lire.

    Écris ta réponse dans un français irréprochable.

    N’utilise que les ingrédients donnés, sans en ajouter d’autres sauf des épices et de l'huile.

    TU peux séparer les almients en plusieurs préparations si ceux-là ne se marrient pas correctement.

    Respecte rigoureusement le format suivant, sans rien ajouter ni modifier l'ordre :

    Titre de la recette : [Titre ici]
    Temps de préparation : [Temps ici, maximum 20 minutes]
    Ingrédients :
    - [Ingrédient 1 avec quantité approximative]
    - [Ingrédient 2]
    ...
    Étapes de la préparation :
    1. [Étape 1 claire et concise]
    2. [Étape 2]
    ...
    Astuces :
    - [Astuce 1 utile]
    - [Astuce 2]

    Ne saute aucune section, même si elle est vide.

    Voici un exemple pour le style et la structure :

    Titre de la recette : Salade rapide aux tomates  
    Temps de préparation : 10 minutes  
    Ingrédients :  
    - 3 tomates moyennes  
    - 1 cuillère à soupe d'huile d'olive  
    Étapes de la préparation :  
    1. Lavez et coupez les tomates en dés.  
    2. Mélangez-les avec l'huile d'olive.  
    Astuces :  
    - Vous pouvez ajouter un peu de sel et de poivre pour relever le goût.

    Sois rigoureux sur la qualité de la langue, et évite toute faute.

    Ne saute aucune section, même si tu dois les laisser vides. N'ajoute aucun texte en dehors de ce format.
    `.trim();

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant culinaire amical et précis.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const raw = await response.text();
    console.log("Réponse brute de Mistral:", raw);

    let data;
    try {
      data = JSON.parse(raw);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return res.status(500).json({ error: "Réponse Mistral non JSON", raw });
    }

    res.status(200).json({ result: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la requête à Mistral." });
  }
}
