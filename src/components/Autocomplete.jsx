import { useState, useEffect } from "react";

export default function Autocomplete({ ingredients, setIngredients }) {
  const [allIngredients, setAllIngredients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
      .then((res) => res.json())
      .then((data) =>
        setAllIngredients(data.meals.map((m) => m.strIngredient.toLowerCase()))
      );
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setIngredients(val);

    const lastWord = val.split(",").pop().trim().toLowerCase();
    if (lastWord.length > 1) {
      setSuggestions(
        allIngredients.filter((ing) => ing.startsWith(lastWord)).slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }
  };

  const addSuggestion = (s) => {
    const parts = ingredients.split(",");
    parts[parts.length - 1] = " " + s;
    setIngredients(parts.join(","));
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={ingredients}
        onChange={handleChange}
        placeholder="Enter ingredients"
        className="w-full px-4 py-3 rounded-md text-black"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white text-black w-full mt-1 rounded-md shadow-lg">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => addSuggestion(s)}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
