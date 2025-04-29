import { useState } from 'react';

const IngredientInput = () => {
  const [input, setInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInput('');
    }
  };

  const handleRemove = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
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

      <ul>
        {ingredients.map((ing, index) => (
          <li key={index}>
            {ing} <button onClick={() => handleRemove(index)}>✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IngredientInput;
