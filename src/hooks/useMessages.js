import { useState, useEffect } from "react";
import {
  fetchAllMessages,
  toggleReadStatus,
  removeMessage,
} from "../services/messagesService";

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await fetchAllMessages();
      setMessages(data);
    } catch (e) {
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (id, read) => {
    await toggleReadStatus(id, read);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: !read } : m)),
    );
  };

  const deleteMsg = async (id) => {
    await removeMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return { messages, loading, error, loadMessages, toggleRead, deleteMsg };
};
