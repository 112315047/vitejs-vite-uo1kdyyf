export default function Filters({ cuisine, setCuisine, diet, setDiet, time, setTime }) {
  return (
    <div className="flex flex-wrap gap-4 mt-4 justify-center">
      {/* Cuisine */}
      <select
        value={cuisine}
        onChange={(e) => setCuisine(e.target.value)}
        className="px-3 py-2 rounded-md text-black"
      >
        <option value="">All Cuisines</option>
        <option value="Indian">Indian</option>
        <option value="Italian">Italian</option>
        <option value="Mexican">Mexican</option>
      </select>

      {/* Cooking Time */}
      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="px-3 py-2 rounded-md text-black"
      >
        <option value="">Any Time</option>
        <option value="15">Under 15 mins</option>
        <option value="30">Under 30 mins</option>
      </select>

      {/* Diet */}
      <select
        value={diet}
        onChange={(e) => setDiet(e.target.value)}
        className="px-3 py-2 rounded-md text-black"
      >
        <option value="">Any Diet</option>
        <option value="Vegetarian">Vegetarian</option>
        <option value="Vegan">Vegan</option>
        <option value="Keto">Keto</option>
      </select>
    </div>
  );
}
