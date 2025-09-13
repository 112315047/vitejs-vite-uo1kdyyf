import { useState } from "react";
import SearchBar from "./components/SearchBar";
import RecipeList from "./components/RecipeList";
import RecipeModal from "./components/RecipeModal";

export default function App() {
  const [ingredients, setIngredients] = useState("");

  const [exactRecipes, setExactRecipes] = useState([]);
  const [partialRecipes, setPartialRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Filters
  const [cuisine, setCuisine] = useState("");
  const [diet, setDiet] = useState("");
  const [time, setTime] = useState("");

  // Fetch recipes for multiple ingredients
  const fetchRecipes = async () => {
    if (!ingredients.trim()) {
      setError("Please enter at least one ingredient.");
      return;
    }

    setLoading(true);
    setError("");
    setExactRecipes([]);
    setPartialRecipes([]);

    try {
      const ingredientList = ingredients
        .split(",")
        .map((ing) => ing.trim().toLowerCase())
        .filter((ing) => ing);

      // Fetch recipes for each ingredient
      const allResults = await Promise.all(
        ingredientList.map(async (ingredient) => {
          const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
          );
          const data = await res.json();
          return data.meals || [];
        })
      );

      // Merge + deduplicate
      const merged = allResults.flat();
      const uniqueRecipes = Array.from(
        new Map(merged.map((meal) => [meal.idMeal, meal])).values()
      );

      // Fetch details for each recipe
      const detailedRecipes = await Promise.all(
        uniqueRecipes.map(async (recipe) => {
          const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`
          );
          const data = await res.json();
          return data.meals[0];
        })
      );

      // Apply cuisine filter
      let filteredRecipes = detailedRecipes;
      if (cuisine) {
        filteredRecipes = filteredRecipes.filter(
          (r) => r.strArea.toLowerCase() === cuisine.toLowerCase()
        );
      }

      // Apply diet filter
      if (diet) {
        filteredRecipes = filteredRecipes.filter((r) => {
          const ingredients = Array.from({ length: 20 }, (_, i) =>
            r[`strIngredient${i + 1}`]
              ? r[`strIngredient${i + 1}`].toLowerCase()
              : null
          ).filter(Boolean);

          if (diet === "Vegetarian") {
            return !ingredients.some((ing) =>
              ["chicken", "beef", "pork", "fish", "lamb", "shrimp"].includes(ing)
            );
          }
          if (diet === "Vegan") {
            return !ingredients.some((ing) =>
              ["chicken", "beef", "pork", "fish", "lamb", "shrimp", "egg", "cheese", "milk", "butter"].includes(ing)
            );
          }
          if (diet === "Keto") {
            return !ingredients.some((ing) =>
              ["rice", "bread", "pasta", "potato", "noodle"].includes(ing)
            );
          }
          return true;
        });
      }

      // Apply cooking time filter (mock times)
      const mockTimes = ["15", "30", "60"];
      filteredRecipes = filteredRecipes.map((r) => ({
        ...r,
        mockTime: mockTimes[Math.floor(Math.random() * mockTimes.length)],
      }));

      if (time) {
        filteredRecipes = filteredRecipes.filter(
          (r) => parseInt(r.mockTime) <= parseInt(time)
        );
      }

      // Classify recipes into exact/partial
      let exact = [];
      let partial = [];

      filteredRecipes.forEach((recipe) => {
        const recipeIngredients = [];
        for (let i = 1; i <= 20; i++) {
          const ing = recipe[`strIngredient${i}`];
          if (ing && ing.trim()) {
            recipeIngredients.push(ing.toLowerCase());
          }
        }

        const missing = recipeIngredients.filter(
          (ing) => !ingredientList.includes(ing)
        );

        if (missing.length === 0) {
          exact.push(recipe);
        } else {
          partial.push({ ...recipe, missing });
        }
      });

      // Sort partial matches by fewest missing
      partial.sort((a, b) => a.missing.length - b.missing.length);

      setExactRecipes(exact);
      setPartialRecipes(partial);

      if (exact.length === 0 && partial.length === 0) {
        setError("No recipes found for the given filters.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/kitchen.jpg')",
        backgroundSize: "cover",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-white">
        <div className="w-full max-w-5xl">
          <h1 className="mb-6 text-center text-4xl font-bold">🍳 Recipe Maker</h1>

          {/* Search Input */}
          <SearchBar
            ingredients={ingredients}
            setIngredients={setIngredients}
            onSearch={fetchRecipes}
            inputClassName="text-gray-900 placeholder-gray-500"
          />

          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Cuisine */}
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="px-4 py-3 rounded-lg text-gray-900"
            >
              <option value="">🌍 All Cuisines</option>
              <option value="Indian">Indian</option>
              <option value="Italian">Italian</option>
              <option value="Mexican">Mexican</option>
              <option value="American">American</option>
              <option value="Chinese">Chinese</option>
            </select>

            {/* Diet */}
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="px-4 py-3 rounded-lg text-gray-900"
            >
              <option value="">🥗 All Diets</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Keto">Keto</option>
            </select>

            {/* Cooking Time */}
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="px-4 py-3 rounded-lg text-gray-900"
            >
              <option value="">⏱ Any Time</option>
              <option value="15">Under 15 mins</option>
              <option value="30">Under 30 mins</option>
              <option value="60">Under 60 mins</option>
            </select>
          </div>

          {loading && <p className="mt-4 text-blue-300">Loading recipes...</p>}
          {error && <p className="mt-4 text-red-400">{error}</p>}

          {/* Results */}
          {exactRecipes.length > 0 && (
            <>
              <h2 className="mt-6 text-2xl font-semibold">
                ✅ Recipes you can cook now:
              </h2>
              <RecipeList
                recipes={exactRecipes}
                onViewDetails={setSelectedRecipe}
              />
            </>
          )}

          {partialRecipes.length > 0 && (
            <>
              <h2 className="mt-6 text-2xl font-semibold">
                ⚡ Almost there (missing ingredients):
              </h2>
              <RecipeList
                recipes={partialRecipes}
                onViewDetails={setSelectedRecipe}
                showMissing
              />
            </>
          )}

          {selectedRecipe && (
            <RecipeModal
              recipe={selectedRecipe}
              onClose={() => setSelectedRecipe(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
