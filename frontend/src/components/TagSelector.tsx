import { useState, useEffect } from 'react';

interface TagSelectorProps {
  ingredients: string[];
  onSelect: (updatedIngredients: string[]) => void;
}

const TagSelector = ({ ingredients, onSelect }: TagSelectorProps) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIngredients(ingredients);
  }, [ingredients]);

  const handleClick = (ingredient: string) => {
    let updatedIngredients;
    if (selectedIngredients.includes(ingredient)) {
      updatedIngredients = selectedIngredients.filter((ing) => ing !== ingredient);
    } else {
      updatedIngredients = [...selectedIngredients, ingredient];
    }
    setSelectedIngredients(updatedIngredients);
    onSelect(updatedIngredients);
  };

  const commonIngredients: { [key: string]: string } = {
    'pâtes': '🍝',
    'fromage': '🧀',
    'tomates': '🍅',
    'œufs': '🥚',
    'riz': '🍚',
    'lait' : '🐮',
    'oignons' : '🧅'
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {Object.keys(commonIngredients).map((ingredient) => (
        <button
          key={ingredient}
          className={`px-3 py-1 rounded-full border ${
            selectedIngredients.includes(ingredient)
              ? 'bg-green-300'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => handleClick(ingredient)}
          title={ingredient}
        >
          {commonIngredients[ingredient as keyof typeof commonIngredients]}
        </button>
      ))}
    </div>
  );
};

export default TagSelector;
