export type SitePromptParams = {
  ingredients: string[];
  regime?: string;
  personne?: string;
  tempsPreparation?: number;
  platChaud?: boolean;
};

export function buildSitePrompt({
  ingredients,
  regime,
  personne,
  tempsPreparation,
  platChaud,
}: SitePromptParams): string {
  return `Tu es un chef cuisinier français expert. 

    En te basant uniquement sur les ingrédients suivants : ${ingredients.join(
      ", ",
    )},${regime ? ` en respectant un régime ${regime},` : ""}${
      personne ? ` pour ${personne},` : ""
    }${tempsPreparation ? ` en ${tempsPreparation} minutes maximum.` : ""} ${
      platChaud ? ` Le plat doit être chaud.` : " Le plat doit être froid."
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
}
