"use client";
import { useState, useRef, useEffect } from "react";
import ConfirmDialog from "./confirmation";
import TypingIndicator from "./typedetect";
import AccountPanel from "./accountpannel";
import HistoryPanel from "./chathistory";
import MessageBubble from "./message";
import io from "socket.io-client";
import { API_BASE } from "./../lib/basepath";
import { api } from "./../lib/basepath";
import Icons from "./icons";

export default function ChatInterface({
  username,
  userId,
  toast,
  onLogout,
  setsidemenu,
  sidemenu,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [panel, setPanel] = useState(null); // "account" | null
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const activeChatIdRef = useRef(null);
  const [width, setwidth] = useState(0);

  useEffect(() => {
    const func = () => {
      const w = window.innerWidth;
      setwidth(w);
      setsidemenu(w > 767);
    };
    func();
    window.addEventListener("resize", func);
    return () => window.removeEventListener("resize", func);
  }, [setsidemenu]);

  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  // Socket setup
  useEffect(() => {
    const socket = io(API_BASE, { transports: ["websocket"] });
    socketRef.current = socket;
    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("getanswer", (answer) => {
      setMessages((p) => [...p, { type: "assistant", content: answer }]);
      setWaiting(false);
    });
    socket.on("disconnect", () => console.log("Socket disconnected"));
    return () => socket.disconnect();
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, waiting]);

  // Auto-save
  useEffect(() => {
    if (messages.length === 0) return;
    const sanitized = messages.map(({ type, content }) => ({ type, content }));
    const persist = async () => {
      try {
        if (messages.length === 1) {
          const { data } = await api.post("/savechats", {
            username,
            chathistoryofuser: sanitized,
          });
          setActiveChatId(data.savedid);
          activeChatIdRef.current = data.savedid;
        } else if (activeChatIdRef.current) {
          await api.put(`/updatechathistory/${activeChatIdRef.current}`, {
            updateddata: { chathistoryofuser: sanitized },
          });
        }
      } catch {
        // Silently fail — auto-save is best-effort
      }
    };
    persist();
  }, [messages]);

  const sendMessage = () => {
    const q = input.trim();
    if (!q || waiting) return;
    const userMsg = { type: "user", content: q };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setWaiting(true);
    const history =
      messages.length > 0
        ? messages.map((m) => ({ role: m.type, content: m.content }))
        : null;
    socketRef.current?.emit("proceedans", q, history);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const loadChat = (session) => {
    const clean = (session.chatdata || []).map(({ type, content }) => ({
      type,
      content,
    }));
    setMessages(clean);
    setActiveChatId(session.id);
  };

  const newChat = () => {
    setMessages([]);
    setActiveChatId(null);
  };

  return (
    <div className="flex h-full w-full bg-slate-950">
      {/* Sign-out confirmation */}
      {showSignOutDialog && (
        <ConfirmDialog
          icon={<Icons.LogOut />}
          title="Sign out?"
          description="You'll need to sign in again to access your chats."
          confirmLabel="Sign Out"
          confirmClassName="bg-red-700 hover:bg-red-600"
          onConfirm={() => {
            setShowSignOutDialog(false);
            onLogout();
          }}
          onCancel={() => setShowSignOutDialog(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`md:flex border-r flex-col backdrop-blur-sm bg-slate-900/60 border-slate-700/40 duration-800 h-screen
          ${width <= 767 ? (sidemenu ? "w-[80%] absolute z-3" : "w-[0%] absolute z-3") : "w-64"}
          ${sidemenu ? "" : "opacity-0  pointer-events-none"}`}
      >
        <div className="px-5 py-5 border-b border-slate-700/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
              <Icons.Stethoscope />
            </div>
            <div>
              <h1
                className="text-white font-bold text-sm"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                MediQuery
              </h1>
              <p className="text-slate-500 text-xs">AI Medical Assistant</p>
            </div>
          </div>
        </div>

        <div className="px-3 py-3 flex gap-2">
          <button
            onClick={() => {
              newChat();
              if (width <= 767) setsidemenu(false);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-600/30 transition-all"
          >
            <Icons.Plus /> New Chat
          </button>
        </div>

        <div className="flex-1 h-[70%] relative px-3 py-2">
          <HistoryPanel
            username={username}
            onLoadChat={loadChat}
            activeChatId={activeChatId}
            onNewChat={newChat}
            toast={toast}
            setsidemenu={setsidemenu}
            width={width}
          />
        </div>

        <div className="px-3 pb-4 pt-2 border-t border-slate-700/40 space-y-1.5">
          <button
            onClick={() => {
              setPanel("account");
              if (width <= 767) setsidemenu(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all"
          >
            <Icons.User /> <span className="truncate">{username}</span>
          </button>
          {sidemenu && (
            <button
              onClick={() => {
                setShowSignOutDialog(true);
                if (width <= 767) setsidemenu(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-all"
            >
              <Icons.LogOut /> Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col overflow-hidden h-screen w-screen">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-700/40 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <label
              className={`btn btn-circle swap swap-rotate ${width >= 767 ? "hidden" : ""} relative z-5 top-0.5`}
            >
              <input
                type="checkbox"
                checked={sidemenu}
                onChange={(e) => setsidemenu(e.target.checked)}
              />
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </label>

            <div>
              <p className="text-white text-sm font-medium">
                {activeChatId ? "Saved Chat" : "New Conversation"}
              </p>
              <p className="text-slate-500 text-xs">
                {messages.length} messages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPanel("account")}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <Icons.User />
            </button>
            <button
              onClick={() => setShowSignOutDialog(true)}
              className="md:hidden text-slate-400 hover:text-red-400"
            >
              <Icons.LogOut />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin">
          {messages.length === 0 && (
            <div className="h-screen flex flex-col items-center justify-center text-center text-slate-500 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <Icons.Stethoscope />
              </div>
              <div>
                <p className="text-white font-medium mb-1">
                  Ask a medical question
                </p>
                <p className="text-sm text-slate-500 max-w-xs">
                  I search through the Medical Encyclopedia to give you
                  accurate, concise answers.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-w-md w-full text-xs">
                {[
                  "What are the symptoms of diabetes?",
                  "How does the immune system work?",
                  "What causes high blood pressure?",
                  "Explain what an MRI scan is",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      inputRef.current?.focus();
                    }}
                    className="text-left px-3 py-2.5 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {waiting && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-slate-700/40 bg-slate-900/40 backdrop-blur-sm">
          <div className="flex gap-2 items-end max-w-3xl mx-auto">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a medical question…"
              rows={1}
              disabled={waiting}
              className="flex-1 bg-slate-800/60 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all resize-none disabled:opacity-50"
              style={{ minHeight: "46px", maxHeight: "140px" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 140) + "px";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || waiting}
              className="w-11 h-11 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white flex items-center justify-center transition-all shadow-lg shadow-teal-900/20 shrink-0"
            >
              <Icons.Send />
            </button>
          </div>
          <p className="text-center text-xs text-slate-600 mt-2">
            Enter to send · Shift+Enter for new line · Responses from Medical
            Encyclopedia RAG
          </p>
        </div>
      </main>

      {/* Account Slide-over Panel */}
      {panel === "account" && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
            onClick={() => setPanel(null)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-700/40 z-40 p-5 flex flex-col shadow-2xl  opacity-80">
            <AccountPanel
              userId={userId}
              username={username}
              onDeleteAccount={() => {
                onLogout();
                setPanel(null);
              }}
              toast={toast}
              onClose={() => setPanel(null)}
            />
          </div>
        </>
      )}
    </div>
  );
}
