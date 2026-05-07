"use client";
import Icons from "./icons";
import { useState, useEffect } from "react";
import { api } from "./../lib/basepath";

export default function AccountPanel({
  userId,
  onDeleteAccount,
  toast,
  onClose,
}) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [creds, setCreds] = useState({ username: "", password: "" });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/getmyaccinfo/${userId}`);
        setInfo(data.getmydoc);
      } catch (error) {
        if (error.response.data.status === 429) {
          toast("Too many reques please try again later", "error");
          return;
        }

        toast("Failed to load account info", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleDeleteAccount = async () => {
    if (!creds.username.trim() || !creds.password.trim()) {
      toast("Please enter your credentials", "error");
      return;
    }
    setDeleting(true);
    try {
      await api.post("/login", {
        username: creds.username,
        password: creds.password,
      });
      await api.delete(`/deleteacandchats/${userId}/${info.username}`);
      toast("Account deleted successfully", "success");
      localStorage.removeItem("med_token");
      onDeleteAccount();
    } catch (err) {
      if (err.response.data.status === 429) {
        toast("Too many reques please try again later", "error");
        return;
      }

      const msg =
        err.response?.data?.message || "Invalid credentials or deletion failed";
      toast(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-white uppercase tracking-widest">
          Account Info
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <Icons.Close />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="w-6 h-6 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
        </div>
      ) : info ? (
        <div className="flex-1 space-y-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/40">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
              Username
            </p>
            <p className="text-white font-medium">{info.username}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/40">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
              Account ID
            </p>
            <p className="text-slate-300 text-xs font-mono break-all">
              {info._id}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/40">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
              Password
            </p>
            <p className="text-slate-400 text-sm">•••••••••••• (hashed)</p>
          </div>
        </div>
      ) : (
        <p className="text-slate-500 text-sm">No info found.</p>
      )}

      <div className="mt-6 pt-4 border-t border-slate-700/40">
        {!showDeleteForm ? (
          <button
            onClick={() => setShowDeleteForm(true)}
            className="w-full py-2.5 rounded-xl text-sm font-medium border border-red-800/50 text-red-400 hover:bg-red-950/40 transition-all"
          >
            Delete Account & All Chats
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-red-400 text-center">
              Confirm your identity to delete your account.
            </p>
            <input
              type="text"
              placeholder="Username"
              value={creds.username}
              onChange={(e) => setCreds({ ...creds, username: e.target.value })}
              className="w-full bg-slate-800/60 border border-slate-600/60 text-white placeholder-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500/60 transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              className="w-full bg-slate-800/60 border border-slate-600/60 text-white placeholder-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500/60 transition-all"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDeleteForm(false);
                  setCreds({ username: "", password: "" });
                }}
                className="flex-1 py-2 rounded-xl text-sm border border-slate-600 text-slate-400 hover:bg-slate-800/50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-700 hover:bg-red-600 text-white transition-all disabled:opacity-50"
              >
                {deleting ? "Verifying..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
