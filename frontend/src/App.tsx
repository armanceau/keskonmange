import { useState } from 'react';
import TagSelector from './components/TagSelector';
import IngredientInput from './components/IngredientInput';
import './App.css'

const App = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);

  const handleSelect = (updatedIngredients: string[]) => {
    setIngredients(updatedIngredients);
  };

  const handleRemove = (ingredient: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient));
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
    </>
  );
};

export default App;
