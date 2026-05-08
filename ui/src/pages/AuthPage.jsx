import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const TABS = [
  { id: "login", label: "Sign in" },
  { id: "signup", label: "Create account" },
];

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tab, setTab] = useState("login");
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isSignup = tab === "signup";

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 8;
  const confirmValid = !isSignup || (confirm.length > 0 && confirm === password);

  const formValid = emailValid && passwordValid && (!isSignup || confirmValid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true, confirm: true });
    if (!formValid) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    try {
      setSubmitting(true);

      if (isSignup) {
        await api.auth.signup(email, password);
        toast.success("Account created. Please sign in.");
        setTab("login");
        setPassword("");
        setConfirm("");
        return;
      }

      const auth = await api.auth.login(email, password);
      login(auth.token);
      toast.success("Signed in");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 -z-10 map-grid-overlay opacity-50" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] -z-10" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] -z-10" />

      <button
        data-testid="auth-back-btn"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 hover:text-white hover:border-zinc-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="w-full max-w-md fade-up">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 grid place-items-center">
            <Zap className="w-5 h-5 text-emerald-400" strokeWidth={2.6} />
          </span>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {isSignup ? "Power up your journey" : "Welcome back to Voltly"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {isSignup
              ? "Create your free account to save stations, track sessions and unlock real-time alerts."
              : "Sign in to find chargers, save favorites and pick up where you left off."}
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[#0a0a0c]/90 backdrop-blur-xl p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
          <div
            data-testid="auth-tabs"
            className="relative flex p-1 rounded-2xl bg-zinc-900/80 border border-zinc-800 mb-7"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                data-testid={`auth-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`relative z-10 flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors
                  ${tab === t.id ? "text-black" : "text-zinc-400 hover:text-white"}`}
              >
                {t.label}
              </button>
            ))}
            <span
              className="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-xl bg-emerald-400 transition-transform duration-300"
              style={{ transform: `translateX(${tab === "login" ? "0%" : "100%"})` }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="auth-form">
            <Field
              testId="email-field"
              label="Email"
              icon={<Mail className="w-4 h-4 text-zinc-500" />}
              error={touched.email && !emailValid ? "Please enter a valid email" : null}
              valid={touched.email && emailValid}
            >
              <input
                data-testid="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="you@voltly.com"
                className="w-full bg-transparent outline-none text-sm placeholder:text-zinc-600"
              />
            </Field>

            <Field
              testId="password-field"
              label="Password"
              icon={<Lock className="w-4 h-4 text-zinc-500" />}
              error={touched.password && !passwordValid ? "Must be at least 8 characters" : null}
              valid={touched.password && passwordValid}
              suffix={
                <button
                  type="button"
                  data-testid="password-toggle"
                  onClick={() => setShowPwd((v) => !v)}
                  className="text-zinc-500 hover:text-zinc-300 transition"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            >
              <input
                data-testid="password-input"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                placeholder="At least 8 characters"
                className="w-full bg-transparent outline-none text-sm placeholder:text-zinc-600"
              />
            </Field>

            {isSignup && (
              <Field
                testId="confirm-field"
                label="Confirm password"
                icon={<Lock className="w-4 h-4 text-zinc-500" />}
                error={touched.confirm && !confirmValid ? "Passwords do not match" : null}
                valid={touched.confirm && confirmValid}
              >
                <input
                  data-testid="confirm-input"
                  type={showPwd ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                  placeholder="Re-enter your password"
                  className="w-full bg-transparent outline-none text-sm placeholder:text-zinc-600"
                />
              </Field>
            )}

            {!isSignup && (
              <div className="flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2 text-zinc-400 cursor-pointer">
                  <input
                    data-testid="remember-me"
                    type="checkbox"
                    className="accent-emerald-500"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  data-testid="forgot-password"
                  className="text-emerald-400 link-underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              data-testid="auth-submit-btn"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition shadow-[0_8px_24px_rgba(16,185,129,0.25)]"
            >
              {submitting ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
            </button>

            <div className="flex items-center gap-3 py-1">
              <span className="flex-1 h-px bg-zinc-800" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                or
              </span>
              <span className="flex-1 h-px bg-zinc-800" />
            </div>

            <button
              type="button"
              data-testid="auth-google-btn"
              onClick={() => toast("Google sign-in is UI-only in this demo")}
              className="w-full inline-flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-white text-sm font-semibold transition"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          {isSignup ? "Already have an account?" : "New to Voltly?"}{" "}
          <button
            data-testid="auth-toggle-tab"
            onClick={() => setTab(isSignup ? "login" : "signup")}
            className="text-emerald-400 font-semibold link-underline"
          >
            {isSignup ? "Sign in" : "Create one free"}
          </button>
        </p>
      </div>
    </div>
  );
}

const Field = ({ testId, label, icon, suffix, error, valid, children }) => (
  <div data-testid={testId}>
    <label className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
      {label}
    </label>
    <div
      className={`mt-1.5 flex items-center gap-2 px-3.5 py-3 rounded-2xl bg-zinc-950 border transition
        ${error
          ? "border-red-500/50 ring-1 ring-red-500/20"
          : valid
          ? "border-emerald-500/40"
          : "border-zinc-800 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30"}`}
    >
      {icon}
      <div className="flex-1 min-w-0">{children}</div>
      {valid && !error && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
      {error && <AlertCircle className="w-4 h-4 text-red-400" />}
      {suffix}
    </div>
    {error && (
      <p data-testid={`${testId}-error`} className="mt-1.5 text-xs text-red-400">
        {error}
      </p>
    )}
  </div>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.4-5.8 7.5-11.3 7.5-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 5.1 29.3 3 24 3 16.3 3 9.7 7.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 45c5.3 0 10-1.9 13.7-5.1l-6.3-5.4c-2 1.4-4.5 2.5-7.4 2.5-5.5 0-10-3.5-11.6-8.4l-6.6 5.1C9.5 40.7 16.2 45 24 45z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.4c4.5-4.2 7.4-10.2 7.4-17 0-1.2-.1-2.3-.4-3.5z"
    />
  </svg>
);