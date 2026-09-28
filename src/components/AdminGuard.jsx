import { useEffect, useState } from "react";
import { KeyRound, LogIn, LogOut, Mail } from "lucide-react";
import { supabase } from "../lib/supabase";

const AdminGuard = ({ children }) => {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
        setCheckingSession(false);
      }
    });

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;

      setSession(data.session);
      setCheckingSession(false);

      if (sessionError) {
        setError("Unable to check your sign-in session. Please reload and try again.");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = session?.user?.app_metadata?.role === "admin";

  const handleSignIn = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    }

    setSubmitting(false);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 grid place-items-center">
        Checking sign-in session...
      </div>
    );
  }

  if (isAdmin) return children;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 grid place-items-center p-6">
      <section className="w-full max-w-md border border-slate-700/70 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">
          <KeyRound size={24} />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Admin sign in</h1>
        <p className="mb-7 text-sm text-slate-400">
          Sign in with your authorized administrator account.
        </p>

        {session && !isAdmin ? (
          <div>
            <p role="alert" className="mb-5 text-sm text-amber-300">
              This account does not have administrator access. Sign out and use
              an authorized account.
            </p>
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="flex w-full items-center justify-center gap-2 border border-slate-700 px-4 py-3 font-semibold text-slate-200 transition-colors hover:border-cyan-500 hover:text-cyan-300"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-5">
            <label className="block text-sm text-slate-300">
              Email
              <span className="mt-2 flex items-center gap-3 border border-slate-700 bg-slate-950/70 px-3 focus-within:border-cyan-500">
                <Mail size={18} className="shrink-0 text-slate-500" />
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="min-w-0 flex-1 bg-transparent py-3 text-slate-100 outline-none"
                />
              </span>
            </label>

            <label className="block text-sm text-slate-300">
              Password
              <span className="mt-2 flex items-center gap-3 border border-slate-700 bg-slate-950/70 px-3 focus-within:border-cyan-500">
                <KeyRound size={18} className="shrink-0 text-slate-500" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="min-w-0 flex-1 bg-transparent py-3 text-slate-100 outline-none"
                />
              </span>
            </label>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={18} />
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        {error && session && (
          <p role="alert" className="mt-5 text-sm text-red-400">
            {error}
          </p>
        )}
      </section>
    </main>
  );
};

export default AdminGuard;