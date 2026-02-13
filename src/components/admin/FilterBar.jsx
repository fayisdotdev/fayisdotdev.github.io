const FiltersBar = ({ filter, setFilter }) => {
  const Btn = ({ value, label }) => (
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

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      <Btn value="all" label="All" />
      <Btn value="unread" label="Unread" />
      <Btn value="read" label="Read" />
    </div>
  );
};

export default FiltersBar;
