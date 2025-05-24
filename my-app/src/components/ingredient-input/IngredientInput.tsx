import { useState } from "react";
import styles from "./IngredientInput.module.css";

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
    <div className={styles["ingredient-input"]}>
      <div>
        Aliment
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Banane ..."
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button onClick={handleAdd}>+</button>
    </div>
  );
};

export default IngredientInput;
