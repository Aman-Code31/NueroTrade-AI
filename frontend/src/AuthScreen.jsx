import React, { useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const firebaseErrorToMessage = (err) => {
  const code = err?.code || "";
  if (code.includes("email-already-in-use")) return "An account with this email already exists. Try logging in instead.";
  if (code.includes("wrong-password") || code.includes("invalid-credential")) return "Incorrect email or password.";
  if (code.includes("user-not-found")) return "No account found with this email.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("popup-closed-by-user")) return "Google sign-in was cancelled.";
  return "Authentication failed. Please try again.";
};

const AuthScreen = ({ onBack }) => {
  const { signUpWithEmail, signInWithEmail, signInWithGoogle } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isRegistering) await signUpWithEmail(form.email, form.password);
      else await signInWithEmail(form.email, form.password);
    } catch (err) {
      setError(firebaseErrorToMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(firebaseErrorToMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-body flex flex-col items-center justify-center px-6">
      <button onClick={onBack} className="absolute top-6 left-6 text-sm font-semibold uppercase tracking-wide hover:text-cobalt">
        ← Back
      </button>

      <div className="font-display font-extrabold text-3xl uppercase mb-8">
        Neuro<span className="text-cobalt">Trade</span>
      </div>

      <div className="w-full max-w-md bg-panel border-[3px] border-ink shadow-hard p-8">
        <h2 className="font-display font-bold uppercase text-2xl mb-6">
          {isRegistering ? "Join the Floor" : "Enter the Floor"}
        </h2>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-3 bg-white border-[3px] border-ink font-semibold py-3 mb-4 hover:bg-gold transition-colors disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.9 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6.1 29.5 4 24 4c-7.5 0-14 4.1-17.7 10.7z" />
            <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.4l-6.3-5.3C29.4 35.3 26.8 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.6 5.1C9.9 39.6 16.4 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-3.1 5.3-5.9 6.9l6.3 5.3C39.5 37 44 31 44 24c0-1.3-.1-2.7-.4-3.5z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-[2px] bg-ink flex-1" />
          <span className="text-xs font-mono text-inksoft">OR</span>
          <div className="h-[2px] bg-ink flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5">Email</label>
            <input
              type="email"
              required
              className="w-full border-[3px] border-ink px-4 py-2.5 focus:outline-none focus:bg-[#FFF6DE]"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full border-[3px] border-ink px-4 py-2.5 focus:outline-none focus:bg-[#FFF6DE]"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && <p className="text-crimson text-sm font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full font-bold text-sm uppercase tracking-wide bg-cobalt text-white border-[3px] border-ink shadow-hard-sm py-3 mt-2 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50"
          >
            {submitting ? "Please wait…" : isRegistering ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => { setIsRegistering(!isRegistering); setError(""); }}
            className="ml-2 text-cobalt underline font-semibold"
          >
            {isRegistering ? "Log in here" : "Sign up here"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
