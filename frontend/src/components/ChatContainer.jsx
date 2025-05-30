import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Trash2 } from "lucide-react";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ProfileModal from "../pages/ProfileModal.jsx";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // New state to control Profile Modal visibility
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedUser) return;
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5001/api/messages/${messageId}`, {
        withCredentials: true,
      });

      useChatStore.setState((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));

      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto overflow-x-hidden">
        {/* Pass empty handler or no-op */}
        <ChatHeader onOpenProfile={() => {}} />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto overflow-x-hidden">
      {/* Pass the function to open Profile Modal */}
      <ChatHeader onOpenProfile={() => setProfileModalOpen(true)} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className="chat-bubble flex flex-col relative max-w-[70%] break-words">
              {message.senderId === authUser._id && (
                <button
                  onClick={() => handleDeleteMessage(message._id)}
                  className="absolute top-1 right-1 p-1 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                  title="Delete message"
                  aria-label="Delete message"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              )}

              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p className="break-words">{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />

      {/* Profile modal */}
      {isProfileModalOpen && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatContainer;
