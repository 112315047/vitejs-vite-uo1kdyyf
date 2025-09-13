export default function RecipeList({ recipes, onViewDetails, showMissing }) {
  if (!recipes || recipes.length === 0) {
    return <p className="mt-4 text-gray-300">No recipes to show.</p>;
  }

  return (
    <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <div
          key={recipe.idMeal}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
        >
          {/* Recipe Image */}
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-48 object-cover"
          />

          {/* Content */}
          <div className="p-4 text-gray-900">
            <h3 className="text-lg font-semibold">{recipe.strMeal}</h3>

            {/* Show cuisine if available */}
            {recipe.strArea && (
              <p className="text-sm text-gray-600">🌍 {recipe.strArea}</p>
            )}

            {/* Cooking time (mocked) */}
            {recipe.mockTime && (
              <p className="text-sm text-gray-600">⏱ ~{recipe.mockTime} mins</p>
            )}

            {/* Show missing ingredients if enabled */}
            {showMissing && recipe.missing && recipe.missing.length > 0 && (
              <p className="mt-2 text-sm text-red-600">
                Missing: {recipe.missing.join(", ")}
              </p>
            )}

            {/* View details button */}
            <button
              onClick={() => onViewDetails(recipe)}
              className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              View Recipe
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
