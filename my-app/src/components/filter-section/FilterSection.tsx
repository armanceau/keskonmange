import React from "react";
import IngredientInput from "../ingredient-input/IngredientInput";
import styles from "./FilterSection.module.css";

type FilterSectionProps = {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
};

const FilterSection: React.FC<FilterSectionProps> = ({
  ingredients,
  setIngredients,
}) => {
  return (
    <div className={styles["filter-section"]}>
      <IngredientInput
        ingredients={ingredients}
        setIngredients={setIngredients}
      />
    </div>
  );
};

export default FilterSection;
