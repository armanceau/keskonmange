import { useState } from 'react';
import TagSelector from './components/TagSelector';
import IngredientInput from './components/IngredientInput';
import './assets/style.css'

const App = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<string>('');

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
        body: JSON.stringify({
          ingredients: ingredients,
        }),
      });
  
      const data = await res.json();
      console.log('Réponse de Mistral:', data.result);
      setRecipe(data.result);
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
    <div 
      key={index} 
      className='list-tag'
    >
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
        className='custom-button'
        style={{ marginTop: '20px' }}
        disabled={ingredients.length === 0 || loading}
      >
        {loading ? 'Chargement...' : 'Générer la recette 🍽️'}
      </button>

      {recipe && (
          <div style={{ marginTop: '20px' }}>
            <h2>Recette proposée :</h2>
            <p>{recipe}</p>
          </div>
        )}
    </>
  );
};

export default App;
