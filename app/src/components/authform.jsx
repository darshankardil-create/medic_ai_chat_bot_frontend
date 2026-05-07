"use client";
import { useState } from "react";
import Icons from "./icons";
import { api } from "./../lib/basepath";

export default function AuthForm({ onAuth, toast }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      toast("Please fill in all fields", "error");
      return;
    }
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/login" : "/signin";
      const { data } = await api.post(endpoint, form);
      localStorage.setItem("med_token", data.token);
      toast(
        `Welcome${mode === "signup" ? ", " + form.username : ""}!`,
        "success",
      );
      onAuth(data.token, form.username);
    } catch (err) {
      if (err.response.data.status === 429) {
        toast("Too many reques please try again later", "error");
        return;
      }

      const msg = err.response?.data?.message || "Something went wrong";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%) opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 mb-4">
            <Icons.Stethoscope />
          </div>
          <h1
            className="text-3xl font-bold text-white tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            MediQuery
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            AI-powered medical knowledge assistant
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <div className="flex bg-slate-800/60 rounded-xl p-1 mb-6">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                  ${mode === m ? "bg-teal-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="your_username"
                className="w-full bg-slate-800/60 border border-slate-600/60 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-800/60 border border-slate-600/60 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm mt-2 shadow-lg shadow-teal-900/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          Medical information is for reference only. Always consult a doctor.
        </p>
      </div>
    </div>
  );
}
