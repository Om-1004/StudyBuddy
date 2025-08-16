import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Search, Paperclip, Smile, Send, Plus } from "lucide-react";


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function makeDmRoom(myId, otherId) {
  const [a, b] = [String(myId), String(otherId)].sort();
  const room = `dm:${a}|${b}`;
  console.log("🏠 Created room:", room, "from users", myId, "and", otherId);
  return room;
}

async function resolveUserByUsername(username) {
  console.log("🔍 Looking up user:", username);
  const res = await fetch(
    `http://localhost:3000/api/users/lookup?username=${encodeURIComponent(username)}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("User not found");
  const data = await res.json();
  if (!data?.user?.id) throw new Error("Invalid user payload");
  console.log("✅ Found user:", data.user);
  return data.user;
}

/* ---------------- component ---------------- */

export default function DMChat() {
  const token = localStorage.getItem("accessToken") || getCookie("accessToken");
  const [me, setMe] = useState(null); 

  const socket = useMemo(() => {
    if (!token) {
      console.log("❌ No token found, cannot create socket");
      return null;
    }
    console.log("🔌 Creating socket connection with token");
    return io("http://localhost:3000", {
      withCredentials: true,
      auth: { token },
    });
  }, [token]);

  const [isCreating, setIsCreating] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [conversations, setConversations] = useState([]); 
  const [activeRoom, setActiveRoom] = useState("");
  const [activePeer, setActivePeer] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        console.log("👤 Fetching user info...");
        const res = await fetch("http://localhost:3000/api/me", { credentials: "include" });
        const data = await res.json();
        console.log("✅ User info loaded:", data.user);
        setMe(data.user);
      } catch (e) {
        console.error("❌ Failed to load user info:", e);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      console.log("✅ Socket connected:", socket.id);
    };

    const onReceive = (data) => {
      console.log("📨 Received message:", data);
      if (data?.room === activeRoom) {
        setMessages((prev) => [...prev, data]);
        setTimeout(scrollToBottom, 100);
      } else {
        console.log("📨 Message for different room, ignoring:", data.room, "vs", activeRoom);
      }
    };

    const onConnectError = (err) => {
      console.error("❌ Socket connect_error:", err?.message || err);
    };

    const onError = (error) => {
      console.error("❌ Socket error:", error);
    };

    socket.on("connect", onConnect);
    socket.on("receive-message", onReceive);
    socket.on("connect_error", onConnectError);
    socket.on("error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("receive-message", onReceive);
      socket.off("connect_error", onConnectError);
      socket.off("error", onError);
      socket.disconnect();
    };
  }, [socket, activeRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = async (e) => {
    e?.preventDefault?.();
    if (!socket || !me) {
      console.log("❌ Cannot start conversation: no socket or user info");
      return;
    }

    const username = newUsername.trim();
    if (!username) {
      console.log("❌ No username provided");
      return;
    }

    try {
      const other = await resolveUserByUsername(username); 
      const room = makeDmRoom(me.id, other.id);

      setConversations((prev) => {
        if (prev.some((c) => c.room === room)) {
          console.log("📝 Conversation already exists:", room);
          return prev;
        }
        console.log("📝 Adding new conversation:", room);
        return [{ room, other }, ...prev];
      });

      console.log("🏠 Joining room:", room);
      setActiveRoom(room);
      setActivePeer(other);
      setMessages([]);
      socket.emit("join-room", room);

      try {
        console.log("📚 Fetching message history for:", room);
        const res = await fetch(
          `http://localhost:3000/api/messages/${encodeURIComponent(room)}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error(`history ${res.status}`);
        const data = await res.json();
        console.log(`📚 Loaded ${data.length} historical messages`);
        setMessages(data);
      } catch (historyError) {
        console.error("❌ Failed to load history:", historyError);
      }

      setIsCreating(false);
      setNewUsername("");
    } catch (err) {
      console.error("❌ Failed to start conversation:", err);
      alert(err.message || "Failed to start conversation");
    }
  };

  const openConversation = async (conv) => {
    if (!socket) {
      console.log("❌ No socket connection");
      return;
    }

    console.log("🏠 Opening conversation:", conv.room);
    setActiveRoom(conv.room);
    setActivePeer(conv.other);
    setMessages([]);
    socket.emit("join-room", conv.room);

    try {
      console.log("📚 Fetching message history for:", conv.room);
      const res = await fetch(
        `http://localhost:3000/api/messages/${encodeURIComponent(conv.room)}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error(`history ${res.status}`);
      const data = await res.json();
      console.log(`📚 Loaded ${data.length} historical messages`);
      setMessages(data);
    } catch (e) {
      console.error("❌ Failed to load history:", e);
    }
  };

  const handleSendMessage = () => {
    if (!socket) {
      console.log("❌ No socket connection");
      return;
    }
    
    const text = newMessage.trim();
    if (!text || !activeRoom) {
      console.log("❌ Cannot send message:", { hasText: !!text, activeRoom });
      return;
    }

    console.log("📤 Sending message:", { room: activeRoom, message: text.substring(0, 50) + "..." });
    socket.emit("message", { room: activeRoom, message: text });
    setNewMessage("");
  };

  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      c.other?.username?.toLowerCase()?.includes(q) ||
      c.other?.id?.toLowerCase?.()?.includes(q)
    );
  });

  if (!token) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center text-gray-700">
        Please log in to start messaging.
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <button
              onClick={() => setIsCreating((s) => !s)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              title="New conversation"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by username…"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isCreating && (
            <form onSubmit={startConversation} className="mt-4 space-y-2">
              <label className="block text-sm text-gray-600">
                Enter the <b>username</b> to start a 1-on-1 chat
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., username123"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
              <p className="text-xs text-gray-500">
                We'll look up the user by username, create (or reuse) a DM, and you can start messaging.
              </p>
            </form>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No conversations yet. Click <b>New</b> to start one.
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.room}
                onClick={() => openConversation(conv)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                  activeRoom === conv.room ? "bg-blue-50 border-r-2 border-blue-500" : ""
                }`}
              >
                <div className="font-semibold text-gray-900 truncate">
                  {conv.other?.username || conv.other?.id}
                </div>
                <div className="text-xs text-gray-500 truncate">Room: {conv.room}</div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                {activePeer?.username || activePeer?.id || "No conversation selected"}
              </h2>
              <p className="text-sm text-gray-500">
                {activeRoom ? "Direct Message" : "Create a conversation to begin messaging"}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Paperclip className="w-5 h-5" />
              <Smile className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {!activeRoom ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Create or open a conversation to start chatting.
            </div>
          ) : (
            <>
              {messages.map((m) => {
                const mine = m?.sender?.id === me?.id;
                return (
                  <div key={m._id || `${m.createdAt}-${Math.random()}`} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        mine ? "bg-blue-500 text-white rounded-br-md" : "bg-white text-gray-900 rounded-bl-md shadow-sm"
                      }`}
                    >
                      <p className="text-sm">{m.message}</p>
                      <p className={`text-xs mt-1 ${mine ? "text-blue-100" : "text-gray-500"}`}>
                        {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <button type="button" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={activeRoom ? "Type a message..." : "Open or create a conversation first"}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-12"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={!activeRoom}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Smile className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            

            <button
              onClick={handleSendMessage}
              disabled={!activeRoom || !newMessage.trim()}
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}