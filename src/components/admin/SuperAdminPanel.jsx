import { useCallback, useEffect, useState } from "react";
import { Settings, Users } from "lucide-react";
import { supabase } from "../../lib/supabase";
import PortfolioContentEditor from "./PortfolioContentEditor";

const fieldClass =
  "rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none focus:border-cyan-500";

const SuperAdminPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [activeTab, setActiveTab] = useState("additional-content");
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadAdmins = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from("portfolio_admin")
      .select("id,user_id,email,role,created_at")
      .order("created_at");
    if (loadError) throw loadError;
    return data || [];
  }, []);

  useEffect(() => {
    let active = true;
    loadAdmins()
      .then((data) => {
        if (active) setAdmins(data);
      })
      .catch((loadError) => {
        console.error("Unable to load administrator accounts.", loadError);
        if (active) setError(`Could not load administrator accounts: ${loadError.message}`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadAdmins]);

  const refreshAdmins = async () => {
    setLoading(true);
    setError("");
    try {
      setAdmins(await loadAdmins());
    } catch (loadError) {
      console.error("Unable to refresh administrator accounts.", loadError);
      setError(`Could not load administrator accounts: ${loadError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("Could not identify the acting super admin.", userError);
      setError(`Could not verify your account: ${userError?.message || "No signed-in user."}`);
      return;
    }
    const { error: addError } = await supabase.from("portfolio_admin").insert({
      user_id: userId.trim(),
      email: email.trim(),
      role,
      created_by: userData.user.id,
    });
    if (addError) {
      console.error("Could not add portfolio administrator.", addError);
      setError(`Could not add administrator: ${addError.message}`);
      return;
    }
    setUserId("");
    setEmail("");
    setRole("admin");
    setShowAddAdmin(false);
    setNotice("Administrator added.");
    await refreshAdmins();
  };

  const changeAdmin = async (id, changes) => {
    setError("");
    setNotice("");
    const { error: updateError } = await supabase
      .from("portfolio_admin")
      .update(changes)
      .eq("id", id);
    if (updateError) {
      console.error("Could not update administrator.", updateError);
      setError(`Could not update administrator: ${updateError.message}`);
      return;
    }
    setNotice("Administrator updated.");
    await refreshAdmins();
  };

  const removeAdmin = async (admin) => {
    if (!window.confirm(`Remove ${admin.email} from portfolio administrators?`)) return;
    setError("");
    setNotice("");
    const { error: deleteError } = await supabase
      .from("portfolio_admin")
      .delete()
      .eq("id", admin.id);
    if (deleteError) {
      console.error("Could not remove administrator.", deleteError);
      setError(`Could not remove administrator: ${deleteError.message}`);
      return;
    }
    setNotice("Administrator removed.");
    await refreshAdmins();
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Site settings &amp; access</h2>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{notice}</p>}

      <nav className="flex gap-2 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40 p-2" aria-label="Site settings and access">
        {[
          { id: "additional-content", label: "Other site content", icon: <Settings size={18} /> },
          { id: "admins", label: "Admin accounts", icon: <Users size={18} /> },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            aria-current={activeTab === id ? "page" : undefined}
            onClick={() => setActiveTab(id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
              activeTab === id
                ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-200"
                : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <span className="shrink-0">{icon}</span>
            <span className="whitespace-nowrap font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {activeTab === "additional-content" ? (
        <PortfolioContentEditor scope="additional" />
      ) : loading ? (
        <p className="py-8 text-center text-slate-400">Loading administrator accounts...</p>
      ) : (
        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Admin accounts</h3>
            <p className="mt-1 text-sm text-slate-400">
              Admins can edit portfolio content. Super admins can also manage site access.
            </p>
          </div>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowAddAdmin((visible) => !visible)}
              className="rounded-lg border border-cyan-500/50 px-4 py-2.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/10"
            >
              {showAddAdmin ? "Cancel" : "Add administrator"}
            </button>
            {showAddAdmin && (
              <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                <p className="text-sm text-slate-400">
                  Create the user in Supabase Authentication first, then enter their user ID and email.
                </p>
                <form onSubmit={addAdmin} className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm text-slate-300">
                    Auth user ID
                    <input
                      className={`${fieldClass} mt-1 w-full`}
                      value={userId}
                      onChange={(event) => setUserId(event.target.value)}
                      placeholder="Paste the ID from Supabase Auth"
                      required
                    />
                  </label>
                  <label className="text-sm text-slate-300">
                    Account email
                    <input
                      className={`${fieldClass} mt-1 w-full`}
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      required
                    />
                  </label>
                  <label className="text-sm text-slate-300">
                    Access level
                    <select
                      className={`${fieldClass} mt-1 w-full`}
                      value={role}
                      onChange={(event) => setRole(event.target.value)}
                    >
                      <option value="admin">Admin — edit portfolio</option>
                      <option value="super_admin">Super admin — manage access</option>
                    </select>
                  </label>
                  <div className="flex items-end">
                    <button className="w-full rounded-lg bg-cyan-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400" type="submit">
                      Add administrator
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {admins.map((admin) => (
              <article key={admin.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-slate-700">
                <p className="break-all font-medium text-slate-200">{admin.email}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-xs text-slate-400">
                    Access level
                    <select
                      className={`${fieldClass} ml-2`}
                      value={admin.role}
                      aria-label={`Access level for ${admin.email}`}
                      onChange={(event) => changeAdmin(admin.id, { role: event.target.value })}
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super admin</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeAdmin(admin)}
                    className="text-sm text-red-300 transition hover:text-red-200"
                  >
                    Remove access
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
};

export default SuperAdminPanel;
