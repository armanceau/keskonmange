import React, { useState } from "react";
import IngredientInput from "../ingredient-input/IngredientInput";
import styles from "./FilterSection.module.css";
import { ChevronUp, ChevronDown } from "react-bootstrap-icons";
import TagSelector from "../tag-selector/TagSelector";

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
    <div className={styles["filter-section"]}>
      <div className={styles["filter-section-visible"]}>
        <IngredientInput
          ingredients={ingredients}
          setIngredients={setIngredients}
        />

        <button onClick={toggleExtra} className={styles["toggle-button"]}>
          <span className={styles["toggle-button-content"]}>
            Tags {showExtra ? <ChevronUp /> : <ChevronDown />}
          </span>
        </button>
      </div>

      {showExtra && (
        <div className={styles["extra-section"]}>
          <TagSelector ingredients={ingredients} onSelect={onSelect} />
        </div>
      )}
    </div>
  );
};

export default FilterSection;
