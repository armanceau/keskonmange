import { useState } from 'react';
import TagSelector from './components/TagSelector';
import IngredientInput from './components/IngredientInput';
import './App.css'

const App = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = (updatedIngredients: string[]) => {
    setIngredients(updatedIngredients);
  };

  const handleRemove = (ingredient: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient));
  };

  const callMistral = async () => {
    if (ingredients.length === 0) return;
  
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
  
    setLoading(true);
    try {
      const res = await fetch('/api/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredients,
          prompt: prompt,
        }),
      });
  
      const data = await res.json();
      console.log('Réponse de Mistral:', data.result);
      alert(data.result);
    } catch (error) {
      console.error('Erreur côté front:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
      
      <TagSelector ingredients={ingredients} onSelect={handleSelect} />
      
      <h3>Ingrédients sélectionnés :</h3>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient} <button 
          onClick={() => handleRemove(ingredient)} 
          style={{ marginLeft: '8px', color: 'red' }}>
          ✖
        </button></li>
        ))}
      </ul>

      <button
        onClick={callMistral}
        style={{ marginTop: '20px' }}
        disabled={ingredients.length === 0 || loading}
      >
        {loading ? 'Chargement...' : 'Générer la recette 🍽️'}
      </button>
    </>
  );
};

export default App;
