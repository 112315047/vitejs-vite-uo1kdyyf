import Autocomplete from "./Autocomplete";

export default function SearchBar({ ingredients, setIngredients, onSearch, inputClassName }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      {/* Replaced input with Autocomplete */}
      <Autocomplete
        ingredients={ingredients}
        setIngredients={setIngredients}
      />

      <button
        onClick={onSearch}
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-r-xl hover:bg-purple-700 transition"
      >
        Search
      </button>
    </div>
  );
}
