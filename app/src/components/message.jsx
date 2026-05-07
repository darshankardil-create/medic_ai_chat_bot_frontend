import Icons from "./icons";

export default function MessageBubble({ msg }) {
  const isUser = msg.type === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mr-2 mt-1 shrink-0">
          <span className="text-teal-400 text-xs">M</span>
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${
            isUser
              ? "bg-teal-600/25 border border-teal-500/30 text-white rounded-tr-sm"
              : "bg-slate-800/70 border border-slate-700/50 text-slate-200 rounded-tl-sm"
          }`}
      >
        {msg.content}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center ml-2 mt-1 shrink-0">
          <Icons.User />
        </div>
      )}
    </div>
  );
}
