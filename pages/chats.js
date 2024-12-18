import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";
import "../styles/globals.css";

export default function Chats() {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatName, setActiveChatName] = useState("");

  const fetchChats = async () => {
    const token = localStorage.getItem("token");
    const phone = localStorage.getItem("phone");
    try {
      const res = await api.get(
        `/telegram/chats?phone=${encodeURIComponent(phone)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.data && res.data.data.chats) {
        setChats(res.data.data.chats);
      } else {
        alert("No chats found.");
      }
    } catch (err) {
      alert(
        "Failed to fetch chats: " + err.response?.data?.detail ||
          "Unknown error"
      );
    }
  };

  const fetchMessages = async (chatId, chatName) => {
    const token = localStorage.getItem("token");
    const phone = localStorage.getItem("phone");
    try {
      const res = await api.get(
        `/telegram/messages?phone=${encodeURIComponent(
          phone
        )}&chat_id=${chatId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.data && res.data.data.messages) {
        setMessages(res.data.data.messages);
        setActiveChatId(chatId);
        setActiveChatName(chatName);
      } else {
        alert("No messages found in this chat.");
      }
    } catch (err) {
      alert(
        "Failed to fetch messages: " + err.response?.data?.detail ||
          "Unknown error"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phone");
    router.push("/");
  };

  const handleTelegramLogout = async () => {
    const token = localStorage.getItem("token");
    const phone = localStorage.getItem("phone");
    try {
      const res = await api.post(
        `/telegram/logout?phone=${encodeURIComponent(phone)}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      localStorage.removeItem("phone");
      router.push("/connect");
    } catch (err) {
      alert(
        "Failed to logout from Telegram: " + err.response?.data?.detail ||
          "Unknown error"
      );
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/");
    fetchChats();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="w-1/3 bg-white shadow-lg border-r border-gray-300 overflow-y-auto">
        <h2 className="text-xl font-bold p-4 bg-green-600 text-white">Chats</h2>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => fetchMessages(chat.id, chat.name)}
              className={`p-4 cursor-pointer hover:bg-gray-200 ${
                activeChatId === chat.id ? "bg-blue-500 text-white" : ""
              }`}
            >
              {chat.name || "Unnamed Chat"}
            </li>
          ))}
        </ul>
        <div className="p-4 bg-gray-200 border-t border-gray-300">
          <button
            className="w-full bg-red-500 text-white py-2 rounded-lg"
            onClick={handleTelegramLogout}
          >
            Logout from Telegram
          </button>
          <button
            className="w-full bg-gray-500 text-white py-2 mt-4 rounded-lg"
            onClick={handleLogout}
          >
            Logout from System
          </button>
        </div>
      </div>

      <div className="w-2/3 flex flex-col">
        {activeChatId ? (
          <>
            <div className="p-4 bg-gray-200 border-b border-gray-300">
              <h2 className="text-xl font-bold">{activeChatName || "Chat"}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-white">
              {messages.length > 0 ? (
                <ul>
                  {messages.map((msg, index) => (
                    <li
                      key={index}
                      className="mb-2 p-2 border rounded bg-gray-100"
                    >
                      {msg.text || "No content"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No messages in this chat.</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a chat to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
