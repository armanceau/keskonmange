import { useState } from 'react';
import TagSelector from './components/TagSelector';
import IngredientInput from './components/IngredientInput';
import './assets/style.css';

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

  const ingredientsMatch = text.match(/Ingrédients\s*:\s*([\s\S]*?)Étapes de la préparation\s*:/);
  const stepsMatch = text.match(/Étapes de la préparation\s*:\s*([\s\S]*?)Astuces\s*:/);
  const tipsMatch = text.match(/Astuces\s*:\s*([\s\S]*)/);

  return {
    title: titleMatch?.[1]?.trim() || '',
    time: timeMatch?.[1]?.trim() || '',
    ingredients: ingredientsMatch?.[1]?.trim().split('\n').filter(Boolean).map(i => i.replace(/^[-–•*]\s*/, '')) || [],
    steps: stepsMatch?.[1]?.trim().split('\n').filter(Boolean).map(s => s.replace(/^\d+\.\s*/, '')) || [],
    tips: tipsMatch?.[1]?.trim().split('\n').filter(Boolean).map(t => t.replace(/^[-–•*]\s*/, '')) || [],
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
    setIngredients(ingredients.filter(ing => ing !== ingredient));
  };

  const callMistral = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });

      const data = await res.json();
      const parsed = parseRecipe(data.result);
      setRecipe(parsed);
    } catch (error) {
      console.error('Erreur côté front:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>KeskonMange ? 🍕</h1>

      <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
      <br />
      <TagSelector ingredients={ingredients} onSelect={handleSelect} />
      <hr />

      <h3>Ingrédients sélectionnés :</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {ingredients.map((ingredient, index) => (
          <div key={index} className='list-tag'>
            {ingredient}
            <button
              onClick={() => handleRemove(ingredient)}
              style={{
                color: 'red',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={callMistral}
        style={{ marginTop: '20px' }}
        disabled={ingredients.length === 0 || loading}
      >
        {loading ? 'Chargement...' : 'Générer la recette 🍽️'}
      </button>

      {recipe && (
        <div className='div-result'>
          <h2>{recipe.title}</h2>
          <p><strong>Temps de préparation :</strong> {recipe.time}</p>

          <h3>Ingrédients :</h3>
          <ul>
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>

          <h3>Préparation :</h3>
          <ol>
            {recipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>

          <h3>Astuces :</h3>
          <ul>
            {recipe.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default App;