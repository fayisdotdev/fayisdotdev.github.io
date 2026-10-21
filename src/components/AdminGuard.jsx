import { cloneElement, useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, LogIn, LogOut, Mail } from "lucide-react";
import { supabase } from "../lib/supabase";
import Background from "./layout/Background";

const ADMIN_IDLE_TIMEOUT_MS = 15 * 60 * 1000;

const AdminGuard = ({ children }) => {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const resolveRole = async (nextSession) => {
      if (!nextSession) {
        setRole(null);
        setCheckingSession(false);
        return;
      }
      setCheckingSession(true);
      const { data, error: roleError } = await supabase.rpc("portfolio_current_role");
      if (!active) return;
      if (roleError) {
        console.error("Unable to look up the signed-in user's portfolio role.", roleError);
        setError("Unable to verify your administrator role. Confirm the database migrations are installed.");
        setRole(null);
      } else {
        setRole(data);
      }
      setCheckingSession(false);
    };
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      if (event === "TOKEN_REFRESHED") {
        setSession(nextSession);
        return;
      }
      setSession(nextSession);
      setCheckingSession(true);
      window.setTimeout(() => {
        if (active) void resolveRole(nextSession);
      }, 0);
      if (!nextSession) {
        setEmail("");
        setPassword("");
        setError("");
      }
    });

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;

      setSession(data.session);
      if (sessionError) {
        setError("Unable to check your sign-in session. Please reload and try again.");
        setCheckingSession(false);
      } else {
        void resolveRole(data.session);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = role === "admin" || role === "super_admin";

  useEffect(() => {
    if (!isAdmin) return undefined;

    let lastActivityAt = Date.now();
    let timeoutId;

    const signOutIfIdle = () => {
      const idleTime = Date.now() - lastActivityAt;
      if (idleTime >= ADMIN_IDLE_TIMEOUT_MS) {
        void supabase.auth.signOut({ scope: "local" });
        return;
      }

      timeoutId = window.setTimeout(
        signOutIfIdle,
        ADMIN_IDLE_TIMEOUT_MS - idleTime,
      );
    };

    const resetIdleTimer = () => {
      lastActivityAt = Date.now();
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(signOutIfIdle, ADMIN_IDLE_TIMEOUT_MS);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") signOutIfIdle();
    };

    const activityEvents = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetIdleTimer, { passive: true });
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    resetIdleTimer();

    return () => {
      window.clearTimeout(timeoutId);
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetIdleTimer);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAdmin]);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setPassword("");
        setError(
          signInError.message === "Invalid login credentials"
            ? "Incorrect email or password. Please try again."
            : signInError.message,
        );
      } else {
        setEmail("");
        setPassword("");
      }
    } catch (signInFailure) {
      setPassword("");
      console.error("Administrator sign-in request failed.", signInFailure);
      setError("Unable to sign in. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0a0b0e] font-mono text-sm text-slate-300">
        Checking sign-in session...
      </div>
    );
  }

  if (isAdmin) return cloneElement(children, { role });

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0a0b0e] p-6 text-slate-100">
      <Background />
      <section className="relative z-10 w-full max-w-md border border-slate-800/80 bg-slate-950/90 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
          <KeyRound size={24} />
        </div>
        <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">Portfolio // Access control</p>
        <h1 className="mb-2 font-mono text-2xl font-bold">Admin sign in</h1>
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
              className="flex w-full items-center justify-center gap-2 border border-slate-700 px-4 py-3 font-mono text-sm font-semibold text-slate-200 transition-colors hover:border-emerald-500 hover:text-emerald-300"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSignIn}
            className="space-y-5"
          >
            <label className="block text-sm text-slate-300">
              Email
              <span className="mt-2 flex items-center gap-3 border border-slate-700/80 bg-slate-950/80 px-3 focus-within:border-emerald-500">
                <Mail size={18} className="shrink-0 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="min-w-0 flex-1 bg-transparent py-3 text-slate-100 outline-none"
                />
              </span>
            </label>

            <label className="block text-sm text-slate-300">
              Password
              <span className="mt-2 flex items-center gap-3 border border-slate-700/80 bg-slate-950/80 px-3 focus-within:border-emerald-500">
                <KeyRound size={18} className="shrink-0 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="min-w-0 flex-1 bg-transparent py-3 text-slate-100 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="shrink-0 py-2 text-slate-400 hover:text-emerald-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-emerald-500 px-4 py-3 font-mono text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
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