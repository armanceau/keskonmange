import { useState } from "react";
import FilterSection from "./components/FilterSection";
import IngredientSummary from "./components/IngredientSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DarkModeToggle from "./lib/darkMode";
import { Carrot } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { Combobox } from "./components/ui/combobox";
import regimes from "./data/regimes.json";
import personne from "./data/personne.json";

type ParsedRecipe = {
  title: string;
  time: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
};

const parseRecipe = (text: string): ParsedRecipe => {
  const titleMatch = text.match(/Titre de la recette\s*:\s*(.+)/);
  const timeMatch = text.match(/Temps de préparation\s*:\s*(.+)/);

  const ingredientsMatch = text.match(
    /Ingrédients\s*:\s*([\s\S]*?)Étapes de la préparation\s*:/
  );
  const stepsMatch = text.match(
    /Étapes de la préparation\s*:\s*([\s\S]*?)Astuces\s*:/
  );
  const tipsMatch = text.match(/Astuces\s*:\s*([\s\S]*)/);

  return {
    title: titleMatch?.[1]?.trim() || "",
    time: timeMatch?.[1]?.trim() || "",
    ingredients:
      ingredientsMatch?.[1]
        ?.trim()
        .split("\n")
        .filter(Boolean)
        .map((i) => i.replace(/^[-–•*]\s*/, "")) || [],
    steps:
      stepsMatch?.[1]
        ?.trim()
        .split("\n")
        .filter(Boolean)
        .map((s) => s.replace(/^\d+\.\s*/, "")) || [],
    tips:
      tipsMatch?.[1]
        ?.trim()
        .split("\n")
        .filter(Boolean)
        .map((t) => t.replace(/^[-–•*]\s*/, "")) || [],
  };
};

const App = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<ParsedRecipe | null>(null);
  const [filters, setFilters] = useState({ regime: "", personne: "" });

  const handleSelect = (updatedIngredients: string[]) => {
    setIngredients(updatedIngredients);
  };

  const handleRemove = (ingredient: string) => {
    setIngredients(ingredients.filter((ing) => ing !== ingredient));
  };

  const callMistral = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);

    try {
      // if (window.location.hostname === "localhost") {
      //   const fakeRecipe = `
      //   Titre de la recette : Salade étudiante express
      //   Temps de préparation : 10 minutes
      //   Ingrédients :
      //   - 1 tomate
      //   - 1 boîte de thon
      //   - 1 poignée de pâtes froides
      //   - Huile d'olive
      //   - Sel, poivre
      //   Étapes de la préparation :
      //   1. Égoutter le thon.
      //   2. Couper la tomate en dés.
      //   3. Mélanger les pâtes, le thon et la tomate dans un bol.
      //   4. Ajouter un filet d'huile d'olive, du sel et du poivre.
      //   Astuces :
      //   - Ajoute du maïs ou du fromage râpé si dispo.
      //   - Tu peux utiliser du riz à la place des pâtes.
      // `;
      //   const parsed = parseRecipe(fakeRecipe);
      //   setRecipe(parsed);
      //   return;
      // }
      const res = await fetch("/api/test-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients,
          regime: filters.regime,
          personne: filters.personne,
        }),
      });

      const data = await res.json();
      const parsed = parseRecipe(data.result);
      setRecipe(parsed);
    } catch (error) {
      console.error("Erreur côté front:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Navigation moderne */}
        <nav className="border-b bg-white/80 backdrop-blur-md dark:bg-black/80 dark:border-gray-800 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-linear-to-r from-orange-400 to-red-500 text-white font-bold">
                  🍕
                </AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-semibold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-100 bg-clip-text text-transparent">
                KeskonMange
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <DarkModeToggle />
              <Badge variant="outline" className="hidden sm:flex">
                Beta
              </Badge>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-4">
              Que cuisiner aujourd'hui ?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Sélectionnez vos ingrédients et obtenez des recettes
              personnalisées instantanément
            </p>
          </div>

          {/* Section principale */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Sélection d'ingrédients */}
            <Card className="shadow-sm border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 dark:text-white">
                  <span className="h-5 w-5 bg-linear-to-r from-green-500 to-emerald-500 rounded-full"></span>
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1">
                  <Combobox
                    options={[
                      { label: "Tous les régimes", value: "" },
                      ...Object.entries(regimes).map(([key, value]) => ({
                        label: key,
                        value: value,
                      })),
                    ]}
                    value={filters.regime}
                    onChange={(value) =>
                      setFilters({ ...filters, regime: value })
                    }
                    placeholder="Régime alimentaire"
                  />
                  <Combobox
                    options={[
                      { label: "Nombre de personnes", value: "" },
                      ...Object.entries(personne).map(([key, value]) => ({
                        label: value,
                        value: key,
                      })),
                    ]}
                    value={filters.personne}
                    onChange={(value) =>
                      setFilters({ ...filters, personne: value })
                    }
                    placeholder="Nombre de personnes"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 dark:text-white">
                  <span className="h-5 w-5 bg-linear-to-r from-green-500 to-emerald-500 rounded-full"></span>
                  Ingrédients disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterSection
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                  onSelect={handleSelect}
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 backdrop-blur-sm">
              <CardContent className="p-6">
                <IngredientSummary
                  ingredients={ingredients}
                  onRemove={handleRemove}
                />

                <Separator className="my-6" />

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <Button
                    className="w-full sm:w-auto bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                    size="lg"
                    onClick={callMistral}
                    disabled={ingredients.length === 0 || loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">✨</span>
                        Générer la recette
                      </>
                    )}
                  </Button>

                  {ingredients.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="secondary"
                          className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
                        >
                          <p>{ingredients.length}</p>
                          <Carrot className="inline-block ml-2" size={16} />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {ingredients.length} ingrédient
                          {ingredients.length > 1 ? "s" : ""} sélectionné
                          {ingredients.length > 1 ? "s" : ""}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Résultats de la recette */}
            {recipe && (
              <Card className="shadow-sm border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 backdrop-blur-sm">
                <CardHeader className="bg-linear-to-r from-orange-50 to-red-50 dark:from-gray-950/50 dark:to-gray-900/50 border-b dark:border-zinc-800 rounded-t-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      🍴 {recipe.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-white/80 text-gray-700"
                      >
                        ⏱️ {recipe.time}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Ingrédients */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 bg-linear-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            🥗
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Ingrédients
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {recipe.ingredients.map((ing, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30"
                          >
                            <div className="w-2 h-2 bg-linear-to-r from-green-500 to-emerald-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">
                              {ing}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Préparation */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 bg-linear-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            🔥
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Préparation
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {recipe.steps.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex gap-4 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30"
                          >
                            <Badge
                              variant="default"
                              className="min-w-8 h-8 bg-linear-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold"
                            >
                              {idx + 1}
                            </Badge>
                            <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Astuces */}
                  {recipe.tips.length > 0 && (
                    <>
                      <Separator className="my-8" />
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-8 w-8 bg-linear-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              💡
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Astuces du chef
                          </h3>
                        </div>
                        <div className="grid gap-3">
                          {recipe.tips.map((tip, idx) => (
                            <div
                              key={idx}
                              className="flex gap-3 p-4 rounded-lg bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/30"
                            >
                              <span className="text-yellow-600 dark:text-yellow-400 text-lg shrink-0">
                                ✨
                              </span>
                              <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {tip}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer moderne */}
        <footer className="flex">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                  Fait avec ❤️ par{" "}
                  <a
                    href="https://www.linkedin.com/in/arthur-manceau/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                  >
                    Arthur Manceau
                  </a>{" "}
                  {""}
                  🐵
                </p>
                <Separator orientation="vertical" className="h-4" />
                <a
                  href="https://github.com/armanceau/keskonmange"
                  rel="noopener nofollow noreferrer"
                  target="_blank"
                  className="inline-flex items-center justify-center h-9 px-3 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default App;
