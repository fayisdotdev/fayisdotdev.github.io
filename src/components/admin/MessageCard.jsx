import {
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Circle,
  Trash2,
} from "lucide-react";

const MessageCard = ({ message, onToggle, onDelete }) => {
  return (
    <div
      className={`border rounded-lg bg-slate-900/60 p-5 transition-all ${
        message.read ? "border-slate-700/50" : "border-emerald-500/30"
      }`}
    >
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-mono text-lg font-bold">{message.name}</h3>

          <div className="text-sm text-slate-400 flex flex-wrap gap-4 mt-2">
            {message.email && (
              <span className="flex items-center gap-1">
                <Mail size={14} /> {message.email}
              </span>
            )}
            {message.phone && (
              <span className="flex items-center gap-1">
                <Phone size={14} /> {message.phone}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(message.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button" aria-label={message.read ? "Mark as unread" : "Mark as read"} onClick={() => onToggle(message.id, message.read)} className="text-slate-400 hover:text-emerald-300">
            {message.read ? <Circle /> : <CheckCircle />}
          </button>
          <button type="button" aria-label="Delete message" onClick={() => onDelete(message.id)} className="text-slate-400 hover:text-red-300">
            <Trash2 />
          </button>
        </div>
      </div>

      <p className="text-slate-300">{message.message}</p>
    </div>
  );
};

export default MessageCard;
