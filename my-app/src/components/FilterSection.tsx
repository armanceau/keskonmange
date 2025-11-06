import React, { useState } from "react";
import IngredientInput from "./IngredientInput";
import { ChevronUp, ChevronDown } from "react-bootstrap-icons";
import TagSelector from "./TagSelector";

type FilterSectionProps = {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  onSelect: (updatedIngredients: string[]) => void;
};

const FilterSection: React.FC<FilterSectionProps> = ({
  ingredients,
  setIngredients,
  onSelect,
}) => {
  const [showExtra, setShowExtra] = useState(false);

  const toggleExtra = () => {
    setShowExtra((prev) => !prev);
  };

  return (
    <div className="space-y-3 mt-2">
      <div className="space-y-4">
        <IngredientInput
          ingredients={ingredients}
          setIngredients={setIngredients}
        />

        <button
          onClick={toggleExtra}
          className="flex items-center justify-between w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-linear-to-r from-green-500 to-emerald-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sélection rapide d'ingrédients
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <span className="text-xs">
              {showExtra ? "Masquer" : "Afficher"}
            </span>
            {showExtra ? (
              <ChevronUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
          </div>
        </button>
      </div>

      {showExtra && (
        <div className="animate-in slide-in-from-top-2 duration-100">
          <div className="p-4 rounded-lg border bg-white dark:bg-black">
            <TagSelector ingredients={ingredients} onSelect={onSelect} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
