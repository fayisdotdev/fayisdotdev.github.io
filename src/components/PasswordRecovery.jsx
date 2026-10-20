import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { PORTFOLIO_SITE_URL, supabase } from "../lib/supabase";

const isPasswordRequestUrl = () => window.location.hash.slice(1) === "admin-forgott";
const isRecoveryCallbackUrl = () =>
  new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";

const PasswordRecovery = () => {
  const navigate = useNavigate();
  const [isRecovery, setIsRecovery] = useState(isRecoveryCallbackUrl);
  const [isRequestingRecovery, setIsRequestingRecovery] = useState(isPasswordRequestUrl);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setError("");
        setIsRecovery(true);
      }
    });
    const handleHashChange = () => setIsRequestingRecovery(isPasswordRequestUrl());
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleRequest = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setEmailSent(false);
    try {
      const { error: requestError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${PORTFOLIO_SITE_URL}/`,
      });
      if (requestError) {
        console.error("Unable to send the password recovery email.", requestError);
        setError(`Could not send recovery email: ${requestError.message}`);
      } else {
        setEmailSent(true);
      }
    } catch (requestFailure) {
      console.error("Password recovery request failed.", requestFailure);
      setError("Unable to send the recovery email. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        console.error("Unable to update the administrator password.", updateError);
        setError(`Could not update password: ${updateError.message}`);
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setIsRecovery(false);
      await navigate("/admin", { replace: true });
    } catch (updateFailure) {
      console.error("Password update request failed.", updateFailure);
      setError("Unable to update your password. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isRecovery && !isRequestingRecovery) return null;

  return (
    <main className="fixed inset-0 z-[100] grid place-items-center bg-slate-950 p-5 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
        <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-cyan-500/10 text-cyan-300">
          {isRecovery ? <KeyRound size={22} /> : <Mail size={22} />}
        </div>
        {isRecovery ? (
          <>
            <h1 className="text-2xl font-bold">Set a new password</h1>
            <p className="mt-2 text-sm text-slate-400">Choose a new password for your admin account.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block text-sm text-slate-300">
                New password
                <span className="mt-1 flex items-center rounded-lg border border-slate-700 bg-slate-950 focus-within:border-cyan-500">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="new-password"
                    autoComplete="new-password"
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-slate-100 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide new password" : "Show new password"}
                    aria-pressed={showPassword}
                    className="px-3 py-2 text-slate-400 hover:text-cyan-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>
              <label className="block text-sm text-slate-300">
                Confirm new password
                <span className="mt-1 flex items-center rounded-lg border border-slate-700 bg-slate-950 focus-within:border-cyan-500">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm-new-password"
                    autoComplete="new-password"
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-slate-100 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                    aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                    aria-pressed={showConfirmPassword}
                    className="px-3 py-2 text-slate-400 hover:text-cyan-300"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>
              {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
              >
                {submitting ? "Updating password..." : "Update password"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Reset admin password</h1>
            <p className="mt-2 text-sm text-slate-400">
              Enter your administrator email and we’ll send a secure recovery link.
            </p>
            <form onSubmit={handleRequest} className="mt-6 space-y-4">
              <label className="block text-sm text-slate-300">
                Email
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none focus:border-cyan-500"
                />
              </label>
              {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
              {emailSent && (
                <p role="status" className="text-sm text-emerald-300">
                  If that address belongs to an account, a recovery link has been sent.
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send recovery link"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRequestingRecovery(false);
                  setError("");
                  void navigate("/admin");
                }}
                className="flex w-full items-center justify-center gap-2 py-2 text-sm text-slate-400 transition-colors hover:text-cyan-300"
              >
                <ArrowLeft size={16} />
                Back to admin sign in
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
};

export default PasswordRecovery;
