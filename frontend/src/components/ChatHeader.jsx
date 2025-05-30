import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import axios from "axios";

const ChatHeader = ({ onOpenProfile }) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear this chat?")) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/messages/clear/${selectedUser._id}`,
        { withCredentials: true }
      );

      useChatStore.setState({ messages: [] });

      toast.success("Chat cleared successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear chat");
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* Add cursor-pointer and click handler to open profile modal */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onOpenProfile}
        >
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.avif"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers?.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="btn btn-sm btn-error"
            title="Clear chat"
          >
            Clear Chat
          </button>

          <button onClick={() => setSelectedUser(null)} title="Close chat">
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
