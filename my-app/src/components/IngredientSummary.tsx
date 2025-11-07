import { CircleX } from "lucide-react";
import React from "react";

type Props = {
  ingredients: string[];
  onRemove: (ingredient: string) => void;
};

const IngredientSummary: React.FC<Props> = ({ ingredients, onRemove }) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Ingrédients sélectionnés :</h3>
      <div className="flex flex-col gap-2 max-h-40 overflow-auto">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-md border border-slate-100 dark:bg-zinc-800 dark:border-zinc-700"
          >
            <div className="text-sm">{ingredient}</div>
            <button
              onClick={() => onRemove(ingredient)}
              className="text-red-500 hover:text-red-700 cursor-pointer"
              aria-label={`Supprimer ${ingredient}`}
            >
              <CircleX size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientSummary;
