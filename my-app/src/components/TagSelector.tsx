import { useState, useEffect } from 'react';
import '../assets/style.css'
import commonIngredients from '../data/ingredients.json'

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

  return (
    <div className="flex gap-05 flex-wrap content-center">
      {Object.keys(commonIngredients).map((ingredient) => (
        <button
          key={ingredient}
          className={selectedIngredients.includes(ingredient) ? 'tag-selected' : '' + 'custom-button'}
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