const Card = ({ label, value }) => (
  <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-5">
    <p className="font-mono text-xs uppercase tracking-wider text-slate-500">{label}</p>
    <p className="mt-1 font-mono text-3xl font-bold text-emerald-300">{value}</p>
  </div>
);

const StatsCards = ({ messages }) => {
  const total = messages.length;
  const unread = messages.filter((m) => !m.read).length;
  const read = total - unread;

  return (
    <div className="grid sm:grid-cols-3 gap-4 mb-6">
      <Card label="Total Messages" value={total} />
      <Card label="Unread" value={unread} />
      <Card label="Read" value={read} />
    </div>
  );
};

export default StatsCards;
