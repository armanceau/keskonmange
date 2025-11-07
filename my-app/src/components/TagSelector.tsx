import { useState, useEffect } from "react";
import commonIngredients from "../data/ingredients.json";

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
      updatedIngredients = selectedIngredients.filter(
        (ing) => ing !== ingredient
      );
    } else {
      updatedIngredients = [...selectedIngredients, ingredient];
    }
    setSelectedIngredients(updatedIngredients);
    onSelect(updatedIngredients);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(commonIngredients).map((ingredient) => {
        const isSelected = selectedIngredients.includes(ingredient);
        return (
          <button
            key={ingredient}
            onClick={() => handleClick(ingredient)}
            title={ingredient}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer
              ${
                isSelected
                  ? "bg-linear-to-r from-orange-500 to-red-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }
              flex items-center gap-2
            `}
          >
            <span>
              {commonIngredients[ingredient as keyof typeof commonIngredients]}
            </span>
            <span className="capitalize text-xs">{ingredient}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TagSelector;
