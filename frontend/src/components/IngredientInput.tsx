import { useState } from 'react';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
}

const IngredientInput = ({ ingredients, setIngredients }: IngredientInputProps) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInput('');
    }
  };

  return (
    <div>
      <h2>Ingrédients</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ajoute un ingrédient"
      />
      <button onClick={handleAdd}>Ajouter</button>
    </div>
  );
};

export default IngredientInput;
