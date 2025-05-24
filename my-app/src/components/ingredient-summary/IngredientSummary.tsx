import React from "react";
import styles from "./IngredientSummary.module.css";

type Props = {
  ingredients: string[];
  onRemove: (ingredient: string) => void;
};

const IngredientSummary: React.FC<Props> = ({ ingredients, onRemove }) => {
  return (
    <div className={styles["section-recap-ingredient"]}>
      <h3>Ingrédients sélectionnés :</h3>
      <hr />
      <div className={styles["list-tag"]}>
        {ingredients.map((ingredient, index) => (
          <div key={index} className={styles["tag"]}>
            {ingredient}
            <button
              onClick={() => onRemove(ingredient)}
              style={{
                color: "red",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientSummary;
