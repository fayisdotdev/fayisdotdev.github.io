const StatsCards = ({ messages }) => {
  const total = messages.length;
  const unread = messages.filter((m) => !m.read).length;
  const read = total - unread;

  const Card = ({ label, value }) => (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );

  return (
    <div className="grid sm:grid-cols-3 gap-4 mb-6">
      <Card label="Total Messages" value={total} />
      <Card label="Unread" value={unread} />
      <Card label="Read" value={read} />
    </div>
  );
};

export default StatsCards;
