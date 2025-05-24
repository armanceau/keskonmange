import { useState } from "react";
import TagSelector from "./components/TagSelector";
import IngredientInput from "./components/ingredient-input/IngredientInput";
import "./assets/style.css";
import ButtonCopyPaste from "./components/ButtonCopyPaste";
import FilterSection from "./components/filter-section/FilterSection";
import IngredientSummary from "./components/ingredient-summary/IngredientSummary";

type ParsedRecipe = {
  title: string;
  time: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
};

const parseRecipe = (text: string): ParsedRecipe => {
  const titleMatch = text.match(/Titre de la recette\s*:\s*(.+)/);
  const timeMatch = text.match(/Temps de préparation\s*:\s*(.+)/);

  const ingredientsMatch = text.match(
    /Ingrédients\s*:\s*([\s\S]*?)Étapes de la préparation\s*:/
  );
  const stepsMatch = text.match(
    /Étapes de la préparation\s*:\s*([\s\S]*?)Astuces\s*:/
  );
  const tipsMatch = text.match(/Astuces\s*:\s*([\s\S]*)/);

  return {
    title: titleMatch?.[1]?.trim() || "",
    time: timeMatch?.[1]?.trim() || "",
    ingredients:
      ingredientsMatch?.[1]
        ?.trim()
        .split("\n")
        .filter(Boolean)
        .map((i) => i.replace(/^[-–•*]\s*/, "")) || [],
    steps:
      stepsMatch?.[1]
        ?.trim()
        .split("\n")
        .filter(Boolean)
        .map((s) => s.replace(/^\d+\.\s*/, "")) || [],
    tips:
      tipsMatch?.[1]
        ?.trim()
        .split("\n")
        .filter(Boolean)
        .map((t) => t.replace(/^[-–•*]\s*/, "")) || [],
  };
};

const App = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<ParsedRecipe | null>(null);

  const handleSelect = (updatedIngredients: string[]) => {
    setIngredients(updatedIngredients);
  };

  const handleRemove = (ingredient: string) => {
    setIngredients(ingredients.filter((ing) => ing !== ingredient));
  };

  const callMistral = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);

    try {
      if (window.location.hostname === "localhost") {
        const fakeRecipe = `
        Titre de la recette : Salade étudiante express
        Temps de préparation : 10 minutes
        Ingrédients :
        - 1 tomate
        - 1 boîte de thon
        - 1 poignée de pâtes froides
        - Huile d'olive
        - Sel, poivre
        Étapes de la préparation :
        1. Égoutter le thon.
        2. Couper la tomate en dés.
        3. Mélanger les pâtes, le thon et la tomate dans un bol.
        4. Ajouter un filet d'huile d'olive, du sel et du poivre.
        Astuces :
        - Ajoute du maïs ou du fromage râpé si dispo.
        - Tu peux utiliser du riz à la place des pâtes.
      `;
        const parsed = parseRecipe(fakeRecipe);
        setRecipe(parsed);
        return;
      }
      const res = await fetch("/api/test-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });

      const data = await res.json();
      const parsed = parseRecipe(data.result);
      setRecipe(parsed);
    } catch (error) {
      console.error("Erreur côté front:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <h1>KeskonMange ? 🍕</h1>
      </header>

      <main>
        <FilterSection
          ingredients={ingredients}
          setIngredients={setIngredients}
        />
        <section className="main-content">
          <div className="main-content-left">
            <IngredientSummary
              ingredients={ingredients}
              onRemove={handleRemove}
            />

            <button
              onClick={callMistral}
              style={{ marginTop: "20px" }}
              disabled={ingredients.length === 0 || loading}
              className="button-generate"
            >
              {loading ? "Chargement..." : "Générer la recette 🍽️"}
            </button>
          </div>

          {recipe && (
            <div className="div-result">
              <ButtonCopyPaste />

              <h2>🍴 {recipe.title}</h2>
              <p>
                <strong>⌛ Temps de préparation :</strong> {recipe.time}
              </p>

              <h3>🥗 Ingrédients :</h3>
              <ul>
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>

              <h3>🛠️ Préparation :</h3>
              <ol>
                {recipe.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>

              <h3>💡 Astuces :</h3>
              <ul>
                {recipe.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
        {/* Composant recette */}
        {/* Tableau récapitulatif */}
      </main>

      <footer>armanceau github ...</footer>

      <IngredientInput
        ingredients={ingredients}
        setIngredients={setIngredients}
      />
      <br />
      <TagSelector ingredients={ingredients} onSelect={handleSelect} />
      <hr />
    </>
  );
};

export default App;
