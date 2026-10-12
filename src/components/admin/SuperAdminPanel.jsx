import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const fieldClass =
  "border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500";

const SuperAdminPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [history, setHistory] = useState([]);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const [adminResult, historyResult] = await Promise.all([
      supabase.from("portfolio_admin").select("id,user_id,email,role,created_at").order("created_at"),
      supabase
        .from("portfolio_change_history")
        .select("id,table_name,row_id,column_name,old_value,new_value,operation,changed_by,changed_by_email,changed_at")
        .order("changed_at", { ascending: false })
        .limit(100),
    ]);
    if (adminResult.error) throw adminResult.error;
    if (historyResult.error) throw historyResult.error;
    return {
      admins: adminResult.data || [],
      history: historyResult.data || [],
    };
  }, []);

  useEffect(() => {
    let active = true;
    load()
      .then(({ admins: nextAdmins, history: nextHistory }) => {
        if (!active) return;
        setAdmins(nextAdmins);
        setHistory(nextHistory);
      })
      .catch((loadError) => {
        console.error("Unable to load super-admin data.", loadError);
        if (active) setError(`Could not load super-admin data: ${loadError.message}`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [load]);

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const { admins: nextAdmins, history: nextHistory } = await load();
      setAdmins(nextAdmins);
      setHistory(nextHistory);
    } catch (loadError) {
      console.error("Unable to refresh super-admin data.", loadError);
      setError(`Could not load super-admin data: ${loadError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Could not identify the acting super admin.", userError);
      setError(`Could not verify your account: ${userError.message}`);
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
    setNotice("Administrator added.");
    await refresh();
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
    await refresh();
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
    await refresh();
  };

  const revert = async (change) => {
    if (!window.confirm(`Revert ${change.table_name}.${change.column_name} to its previous value?`)) return;
    setError("");
    setNotice("");
    const { error: revertError } = await supabase.rpc("portfolio_revert_change", {
      p_change_id: change.id,
    });
    if (revertError) {
      console.error("Could not revert portfolio change.", revertError);
      setError(`Could not revert change: ${revertError.message}`);
      return;
    }
    setNotice("Change reverted. The reversion is also recorded in history.");
    await refresh();
  };

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Super admin</h2>
        <p className="mt-1 text-sm text-slate-400">
          Administrator roles and field-level change history are enforced by Supabase RLS.
        </p>
      </div>
      {error && <p role="alert" className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{notice}</p>}
      {loading ? (
        <p className="py-8 text-center text-slate-400">Loading administrator data...</p>
      ) : (
        <>
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-100">Manage administrators</h3>
            <p className="text-sm text-slate-400">
              Create the user in Supabase Auth first, then enter its Auth user UUID here.
            </p>
            <form onSubmit={addAdmin} className="grid gap-3 md:grid-cols-[1fr_1fr_170px_auto]">
              <input className={fieldClass} value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="Auth user UUID" required />
              <input className={fieldClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" required />
              <select className={fieldClass} value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="admin">admin</option>
                <option value="super_admin">super_admin</option>
              </select>
              <button className="bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400" type="submit">Add admin</button>
            </form>
            <div className="space-y-3">
              {admins.map((admin) => (
                <article key={admin.id} className="grid gap-3 border border-slate-700/70 bg-slate-900/50 p-4 md:grid-cols-[1fr_1fr_170px_auto] md:items-center">
                  <span className="break-all text-sm text-slate-300">{admin.email}</span>
                  <span className="break-all text-xs text-slate-500">{admin.user_id}</span>
                  <select
                    className={fieldClass}
                    value={admin.role}
                    onChange={(event) => changeAdmin(admin.id, { role: event.target.value })}
                  >
                    <option value="admin">admin</option>
                    <option value="super_admin">super_admin</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeAdmin(admin)}
                    className="text-left text-sm text-red-300 hover:text-red-200"
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-100">Field change history</h3>
            {history.length === 0 ? (
              <p className="border border-slate-800 p-4 text-sm text-slate-400">No changes recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {history.map((change) => (
                  <article key={change.id} className="space-y-2 border border-slate-700/70 bg-slate-900/50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium text-slate-200">
                        {change.table_name}.{change.column_name} · {change.operation}
                      </p>
                      <button
                        type="button"
                        onClick={() => revert(change)}
                        className="border border-amber-500/40 px-3 py-1 text-sm text-amber-300 hover:bg-amber-500/10"
                      >
                        Revert this change
                      </button>
                    </div>
                    <p className="break-all text-xs text-slate-400">
                      {JSON.stringify(change.old_value)} → {JSON.stringify(change.new_value)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {change.changed_by_email || "Unknown user"}
                      {change.changed_by ? ` · ${change.changed_by}` : ""}
                      {" · "}{new Date(change.changed_at).toLocaleString()}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
};

export default SuperAdminPanel;
