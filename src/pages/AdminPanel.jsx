import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle, Circle, LogOut, Mail, RefreshCw, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import PortfolioContentEditor from "../components/admin/PortfolioContentEditor";
import SuperAdminPanel from "../components/admin/SuperAdminPanel";

const AdminPanel = ({ role }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("messages");
  const [signingOut, setSigningOut] = useState(false);

  const loadMessages = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (loadError) throw loadError;
    return data || [];
  }, []);

  useEffect(() => {
    let active = true;
    loadMessages()
      .then((data) => {
        if (active) setMessages(data);
      })
      .catch((loadError) => {
        console.error("Unable to load contact messages.", loadError);
        if (active) setError(`Failed to load messages: ${loadError.message}`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadMessages]);

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      setMessages(await loadMessages());
    } catch (loadError) {
      console.error("Unable to refresh contact messages.", loadError);
      setError(`Failed to load messages: ${loadError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const counts = useMemo(() => ({
    all: messages.length,
    unread: messages.filter((message) => !message.read).length,
    read: messages.filter((message) => message.read).length,
  }), [messages]);
  const visibleMessages = messages.filter((message) =>
    filter === "all" || (filter === "read" ? message.read : !message.read),
  );

  const toggleRead = async (message) => {
    const { error: updateError } = await supabase
      .from("contacts")
      .update({ read: !message.read })
      .eq("id", message.id);
    if (updateError) {
      console.error("Unable to update message status.", updateError);
      setError(`Could not update message: ${updateError.message}`);
      return;
    }
    setMessages((current) => current.map((item) =>
      item.id === message.id ? { ...item, read: !message.read } : item,
    ));
  };

  const deleteMessage = async (message) => {
    if (!window.confirm("Delete this message?")) return;
    const { error: deleteError } = await supabase.from("contacts").delete().eq("id", message.id);
    if (deleteError) {
      console.error("Unable to delete contact message.", deleteError);
      setError(`Could not delete message: ${deleteError.message}`);
      return;
    }
    setMessages((current) => current.filter((item) => item.id !== message.id));
  };

  const signOut = async () => {
    setSigningOut(true);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.error("Unable to sign out.", signOutError);
      setError(`Failed to sign out: ${signOutError.message}`);
      setSigningOut(false);
    }
  };

  const tabs = [
    ["messages", "Messages"],
    ["portfolio", "Portfolio"],
    ...(role === "super_admin" ? [["super-admin", "Super admin"]] : []),
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">
              {activeView === "messages" ? "Contact Messages" : activeView === "portfolio" ? "Portfolio Content" : "Super admin"}
            </h1>
            <p className="mt-2 text-slate-400">
              {role === "super_admin" ? "Signed in as super_admin" : "Signed in as admin"}
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="flex items-center gap-2 border border-slate-700 px-4 py-2 text-slate-300 hover:border-red-400/60 hover:text-red-300 disabled:opacity-50"
          >
            <LogOut size={18} /> {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </header>

        <nav className="flex gap-2 border-b border-slate-800" role="tablist" aria-label="Admin sections">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeView === id}
              onClick={() => setActiveView(id)}
              className={`border-b-2 px-4 py-3 text-sm font-medium ${
                activeView === id
                  ? "border-cyan-400 text-cyan-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {error && <p role="alert" className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
        {activeView === "portfolio" && <PortfolioContentEditor role={role} />}
        {activeView === "super-admin" && role === "super_admin" && <SuperAdminPanel />}
        {activeView === "messages" && (
          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {["all", "unread", "read"].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`border p-4 text-left ${
                    filter === key ? "border-cyan-500 bg-cyan-500/10" : "border-slate-700 bg-slate-800/40"
                  }`}
                >
                  <span className="block text-sm capitalize text-slate-400">{key === "all" ? "Total Messages" : key}</span>
                  <span className="mt-1 block text-2xl font-bold">{counts[key]}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => void fetchMessages()}
              disabled={loading}
              className="flex items-center gap-2 border border-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            {loading ? (
              <p className="py-10 text-center text-slate-400">Loading messages...</p>
            ) : visibleMessages.length === 0 ? (
              <p className="border border-slate-800 p-8 text-center text-slate-400">No messages found</p>
            ) : (
              <div className="space-y-4">
                {visibleMessages.map((message) => (
                  <article key={message.id} className="space-y-4 border border-slate-700/70 bg-slate-800/40 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold">{message.name}</h2>
                        <p className="mt-1 text-sm text-slate-400">
                          {message.email} {message.phone && ` · ${message.phone}`}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void toggleRead(message)}
                          title={message.read ? "Mark as unread" : "Mark as read"}
                          className="rounded-lg bg-slate-700/60 p-2 text-slate-300 hover:text-emerald-300"
                        >
                          {message.read ? <Circle size={20} /> : <CheckCircle size={20} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteMessage(message)}
                          title="Delete message"
                          className="rounded-lg bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap rounded-lg border border-slate-700/50 bg-slate-950/50 p-4 text-slate-300">{message.message}</p>
                    {message.email && (
                      <a
                        href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: Your message from ${message.name}`)}`}
                        className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
                      >
                        <Mail size={16} /> Reply via Email
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default AdminPanel;
