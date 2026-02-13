import React, { useState } from "react";
import { useMessages } from "../hooks/useMessages";
import StatusCard from "../components/admin/StatusCard";
import FilterBar from "../components/admin/FilterBar";
import MessageCard from "../components/admin/MessageCard";
import EmptyState from "../components/admin/EmptyState";

const AdminPanel = () => {
  const [filter, setFilter] = useState("all");
  const { messages, loading, error, loadMessages, toggleRead, deleteMsg } =
    useMessages();

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.read;
    if (filter === "read") return msg.read;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Contact Messages
            </span>
          </h1>
          <p className="text-slate-400">
            Manage your portfolio contact form submissions
          </p>
        </div>

        <StatusCard messages={messages} />
        <FilterBar filter={filter} setFilter={setFilter} />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-12 text-slate-400">
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <MessageCard
                key={msg.id}
                message={msg}
                onToggle={toggleRead}
                onDelete={deleteMsg}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
