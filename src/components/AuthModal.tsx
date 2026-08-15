import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Mail, Lock, User, ArrowRight, X } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: "login" | "register";
  onClose: () => void;
  onLoginSuccess: (name: string, email: string, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = "login",
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">(
    initialMode,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "forgot") {
      alert(`Password reset link sent to ${email}`);

      setMode("login");

      return;
    }

    setLoading(true);
    setError("");

    try {
      // =====================================================
      // REGISTER
      // =====================================================

      if (mode === "register") {
        const registerResponse = await fetch(
          `${API_BASE_URL}/api/v1/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              full_name: name,
              email: email,
              password: password,
            }),
          },
        );

        if (!registerResponse.ok) {
          const errorText = await registerResponse.text();

          let message = `Registration failed (${registerResponse.status})`;

          try {
            const errorData = JSON.parse(errorText);

            if (errorData.detail) {
              message =
                typeof errorData.detail === "string"
                  ? errorData.detail
                  : JSON.stringify(errorData.detail);
            }
          } catch {
            if (errorText) {
              message += `: ${errorText}`;
            }
          }

          throw new Error(message);
        }
      }

      // =====================================================
      // LOGIN
      //
      // IMPORTANT:
      // FastAPI OAuth2PasswordRequestForm expects:
      //
      // username=<email>
      // password=<password>
      //
      // It does NOT expect JSON.
      // =====================================================

      const loginForm = new URLSearchParams();

      loginForm.append("username", email);

      loginForm.append("password", password);

      const loginResponse = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: loginForm.toString(),
      });

      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();

        let message = `Login failed (${loginResponse.status})`;

        try {
          const errorData = JSON.parse(errorText);

          if (errorData.detail) {
            message =
              typeof errorData.detail === "string"
                ? errorData.detail
                : JSON.stringify(errorData.detail);
          }
        } catch {
          if (errorText) {
            message += `: ${errorText}`;
          }
        }

        throw new Error(message);
      }

      // =====================================================
      // READ JWT RESPONSE
      // =====================================================

      const loginData = await loginResponse.json();

      console.log("Login response:", loginData);

      const token = loginData.access_token;

      if (!token) {
        throw new Error(
          "Login succeeded, but the backend did not return an access token.",
        );
      }

      // =====================================================
      // SAVE JWT
      // =====================================================

      localStorage.setItem("access_token", token);

      // =====================================================
      // UPDATE APP
      // =====================================================

      const displayName = name || email.split("@")[0] || "Aetheria Seeker";

      onLoginSuccess(displayName, email, token);

      // =====================================================
      // CLOSE MODAL
      // =====================================================

      onClose();

      // Clear password from React state
      setPassword("");
      setError("");
    } catch (err) {
      console.error("Authentication error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.9,
          opacity: 0,
        }}
        className="bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6 overflow-hidden"
      >
        {/* =================================================
            CLOSE BUTTON
        ================================================== */}

        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition-all cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* =================================================
            BRAND
        ================================================== */}

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />

            <span>AETHERIA SANCTUARY</span>
          </div>

          <h2 className="text-2xl font-black text-white">
            {mode === "login"
              ? "Welcome Back, Seeker"
              : mode === "register"
                ? "Create Your Account"
                : "Reset Password"}
          </h2>

          <p className="text-xs text-slate-400">
            {mode === "login"
              ? "Enter your credentials to access your saved readings and reports."
              : mode === "register"
                ? "Join Aetheria to unlock personalized palmistry and tarot guidance."
                : "Enter your email address to receive password recovery instructions."}
          </p>
        </div>

        {/* =================================================
            LOGIN / REGISTER TABS
        ================================================== */}

        {mode !== "forgot" && (
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* =================================================
            FORM
        ================================================== */}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}

          {mode === "register" && (
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Your Name
              </label>

              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />

                <input
                  type="text"
                  placeholder="Elena Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* EMAIL */}

          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
              Email Address
            </label>

            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />

              <input
                type="email"
                placeholder="seeker@aetheria.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* PASSWORD */}

          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Password
                </label>

                {mode === "login" && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setMode("forgot");
                      setError("");
                    }}
                    className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>
              {loading
                ? "Processing..."
                : mode === "login"
                  ? "Sign In"
                  : mode === "register"
                    ? "Create Account"
                    : "Send Reset Link"}
            </span>

            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* =================================================
            FORGOT PASSWORD
        ================================================== */}

        {mode === "forgot" && (
          <div className="text-center pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
