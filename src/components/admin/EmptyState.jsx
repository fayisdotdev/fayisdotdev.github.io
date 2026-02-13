import { Inbox } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="text-center py-20 text-slate-400">
      <Inbox size={40} className="mx-auto mb-4 opacity-50" />
      <p className="text-lg">No messages found</p>
      <p className="text-sm mt-1">New contacts will appear here</p>
    </div>
  );
};

export default EmptyState;
