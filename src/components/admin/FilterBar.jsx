const FilterButton = ({ filter, setFilter, value, label }) => (
    <button
      onClick={() => setFilter(value)}
      aria-pressed={filter === value}
      className={`rounded border px-4 py-2 font-mono text-xs uppercase tracking-wide transition ${
        filter === value
          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
          : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
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
