import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle, Circle, ExternalLink, FilePenLine, Inbox, LogOut, Mail, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
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
    { id: "messages", label: "Inbox", icon: <Inbox size={20} /> },
    { id: "portfolio", label: "Edit portfolio", icon: <FilePenLine size={20} /> },
    ...(role === "super_admin"
      ? [{ id: "super-admin", label: "Site settings & access", icon: <ShieldCheck size={20} /> }]
      : []),
  ];
  const activeTab = tabs.find((tab) => tab.id === activeView);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-5 sm:px-6 sm:py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Portfolio dashboard</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{activeTab?.label}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-cyan-200"
            >
              <ExternalLink size={17} /> View live site
            </a>
            <span className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-400">
              {role === "super_admin" ? "Super admin" : "Admin"}
            </span>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-red-400/60 hover:text-red-300 disabled:opacity-50"
            >
              <LogOut size={18} /> {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </header>

        <nav className="flex gap-2 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40 p-2" aria-label="Admin sections">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              aria-current={activeView === id ? "page" : undefined}
              onClick={() => setActiveView(id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors sm:px-4 ${
                activeView === id
                  ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-200"
                  : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <span className="shrink-0">{icon}</span>
              <span className="whitespace-nowrap font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {error && <p role="alert" className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
        {activeView === "portfolio" && <PortfolioContentEditor role={role} />}
        {activeView === "super-admin" && role === "super_admin" && <SuperAdminPanel />}
        {activeView === "messages" && (
          <section className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {["all", "unread", "read"].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`rounded-xl border p-4 text-left transition ${
                    filter === key ? "border-cyan-500/60 bg-cyan-500/10" : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                  }`}
                >
                  <span className="block text-xs font-medium uppercase tracking-wider text-slate-500">{key === "all" ? "Total messages" : key}</span>
                  <span className="mt-1 block text-2xl font-semibold tabular-nums">{counts[key]}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{counts[filter]} {filter === "all" ? "messages" : `${filter} messages`}</p>
              <button
                type="button"
                onClick={() => void fetchMessages()}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
            {loading ? (
              <p className="py-10 text-center text-slate-400">Loading messages...</p>
            ) : visibleMessages.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-800 p-10 text-center text-slate-400">No messages found</p>
            ) : (
              <div className="space-y-4">
                {visibleMessages.map((message) => (
                  <article key={message.id} className={`space-y-4 rounded-xl border p-4 sm:p-5 ${
                    message.read ? "border-slate-800 bg-slate-900/40" : "border-cyan-900/70 bg-slate-900/80"
                  }`}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold">{message.name}</h2>
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
