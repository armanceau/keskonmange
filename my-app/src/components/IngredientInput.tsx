import { Plus } from "lucide-react";
import { useState } from "react";
import { ForkKnife } from "react-bootstrap-icons";

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
}

const IngredientInput = ({
  ingredients,
  setIngredients,
}: IngredientInputProps) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string>("");

  const validateInput = (value: string) => {
    if (/^\d+$/.test(value)) {
      setError("On cuisine pas des chiffres, ici. 🚫");
      return false;
    }

    if (value.length === 0) {
      setError("Un ingrédient invisible ? C’est de la magie noire ça. 🧙‍♂️");
      return false;
    }

    if (value.length > 25) {
      setError(
        "Oulah cowboy ! C’est un ingrédient, pas une autobiographie. 🤠"
      );
      return false;
    }

    if (value.includes(".")) {
      setError("Pas besoin de ponctuation, on cuisine, on rédige pas. 👍");
      return false;
    }

    setError("");
    return true;
  };

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      if (validateInput(trimmed)) {
        setIngredients([...ingredients, trimmed]);
        setInput("");
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="border p-3 bg-slate-100 rounded-md dark:bg-zinc-900">
        <ForkKnife className="text-orange-500" />
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Banane ..."
        className="flex-1 px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-800 transition-colors"
      />
      <button
        onClick={handleAdd}
        disabled={input.length === 0}
        className="inline-flex items-center justify-center rounded-full p-3 bg-slate-800 text-white disabled:opacity-50 cursor-pointer hover:bg-linear-to-r hover:from-orange-500 hover:to-red-500 transition-colors disabled:cursor-not-allowed"
      >
        <Plus size={16} />
      </button>
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
};

export default IngredientInput;
