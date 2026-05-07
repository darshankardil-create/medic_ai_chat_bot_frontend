"use client";
import ConfirmDialog from "./confirmation";
import { useState, useCallback, useEffect } from "react";
import { api } from "./../lib/basepath";
import dayjs from "dayjs";
import Icons from "./icons";

export default function HistoryPanel({
  username,
  onLoadChat,
  activeChatId,
  onNewChat,
  toast,
  onClose,
  setsidemenu,
  width,
}) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // id pending confirmation

  const fetchHistory = useCallback(async () => {
    try {
      const { data } = await api.get(`/getmyallchats/${username}`);
      setSessions(data.getmychathistory || []);
    } catch {
      toast("Failed to load chat history", "error");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    function a() {
      fetchHistory();
    }
    a();
  }, [fetchHistory]);

  const confirmDelete = (id, e) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const handleDeleteConfirmed = async () => {
    const id = deletingId;
    setDeletingId(null);
    try {
      await api.delete(`/deletechat/${id}`);
      setSessions((p) => p.filter((s) => s.id !== id));
      toast("Chat deleted", "success");
      if (activeChatId === id) onNewChat();
    } catch {
      toast("Failed to delete chat", "error");
    }
  };

  const getPreview = (chatdata) => {
    const first = chatdata?.find((m) => m.type === "user");
    return first?.content?.slice(0, 40) || "Empty chat";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Delete confirmation dialog */}
      {deletingId && (
        <ConfirmDialog
          icon={<Icons.Trash />}
          title="Delete chat?"
          description="This conversation will be permanently deleted and cannot be recovered."
          confirmLabel="Delete"
          confirmClassName="bg-red-700 hover:bg-red-600"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeletingId(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-widest">
          Chat History
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onNewChat();
              if (width <= 767) setsidemenu(false);
            }}
            className="flex items-center gap-1.5 text-xs bg-teal-600/20 hover:bg-teal-600/40 text-teal-400 border border-teal-600/30 px-2.5 py-1.5 rounded-lg transition-all"
          >
            <Icons.Plus /> New
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <Icons.Close />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="w-5 h-5 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 gap-2">
          <Icons.History />
          <p className="text-xs">No saved chats yet</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                onLoadChat(s);
                if (width <= 767) setsidemenu(false);
              }}
              className={`relative p-3 rounded-xl cursor-pointer transition-all border text-sm
                ${
                  activeChatId === s.id
                    ? "bg-teal-600/20 border-teal-600/40 text-white"
                    : "bg-slate-800/40 border-slate-700/30 text-slate-300 hover:bg-slate-800/70 hover:border-slate-600/50"
                }`}
            >
              <div className="pr-8">
                <p className="truncate font-medium">{getPreview(s.chatdata)}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {s.chatdata?.length || 0} messages
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {dayjs(s.time).format("DD/MM/YYYY hh:mm:ss A")}
                </p>
              </div>
              <button
                onClick={(e) => confirmDelete(s.id, e)}
                className="absolute right-2 top-2.5 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/30 transition-all"
                title="Delete chat"
              >
                <Icons.Trash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
