const FilterButton = ({ filter, setFilter, value, label }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-4 py-2 rounded-lg text-sm transition ${
        filter === value
          ? "bg-emerald-500 text-black"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
    >
      {label}
    </button>
  );

const FiltersBar = ({ filter, setFilter }) => {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      <FilterButton filter={filter} setFilter={setFilter} value="all" label="All" />
      <FilterButton filter={filter} setFilter={setFilter} value="unread" label="Unread" />
      <FilterButton filter={filter} setFilter={setFilter} value="read" label="Read" />
    </div>
  );
};

export default FiltersBar;
