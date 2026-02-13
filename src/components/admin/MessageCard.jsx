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
      className={`bg-slate-800/50 border rounded-xl p-6 transition-all ${
        message.read ? "border-slate-700/50" : "border-emerald-500/30"
      }`}
    >
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{message.name}</h3>

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
          <button onClick={() => onToggle(message.id, message.read)}>
            {message.read ? <Circle /> : <CheckCircle />}
          </button>
          <button onClick={() => onDelete(message.id)}>
            <Trash2 />
          </button>
        </div>
      </div>

      <p className="text-slate-300">{message.message}</p>
    </div>
  );
};

export default MessageCard;
