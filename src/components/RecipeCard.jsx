export default function RecipeCard({ recipe, onViewDetails, showMissing }) {
  return (
    <div className="bg-white text-black rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition duration-200">
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{recipe.strMeal}</h3>
        {showMissing && recipe.missing && (
          <p className="text-sm text-red-500 mb-2">
            Missing: {recipe.missing.join(", ")}
          </p>
        )}
        <button
          onClick={onViewDetails}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
