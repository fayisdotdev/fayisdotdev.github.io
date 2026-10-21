import { Inbox } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="border border-dashed border-slate-800 py-20 text-center text-slate-400">
      <Inbox size={40} className="mx-auto mb-4 text-emerald-500/50" />
      <p className="font-mono text-lg">No messages found</p>
      <p className="mt-1 text-sm">New contacts will appear here</p>
    </div>
  );
};

export default EmptyState;
