// DMChat.jsx (cookie-based auth; no token reading from JS)
import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Search, Paperclip, Smile, Send, Plus } from "lucide-react";
import Navbar from "./Navbar";

/* ---------------- debug helpers ---------------- */
const DEBUG = true;
const debug = (...args) => DEBUG && console.log("[DMChat]", ...args);
const group = (label) => DEBUG && console.group(label);
const groupEnd = () => DEBUG && console.groupEnd();
const table = (rows) => DEBUG && console.table(rows);

function logUser(label, u) {
  if (!DEBUG) return;
  if (!u) {
    console.log(`[DMChat] ${label}: null/undefined`);
    return;
  }
  const summary = {
    id: u.id,
    email: u.email,
    username: u.username,
    fullname: u.fullname,
  };
  console.log(`[DMChat] ${label}:`, summary);
}

function logConvList(convs, label = "Conversations") {
  if (!DEBUG) return;
  group(`📚 ${label} (${convs.length})`);
  table(
    convs.map((c) => ({
      room: c.room,
      other_id: c.other?.id,
      other_username: c.other?.username,
      other_fullname: c.other?.fullname,
      lastMessageAt: c.lastMessageAt,
      lastMessage: c.lastMessage?.slice?.(0, 60),
    }))
  );
  groupEnd();
}

/* ---------------- helpers ---------------- */
function displayName(other) {
  const n1 = (other?.fullname || "").trim();
  const n2 = (other?.username || "").trim();
  const idTail = other?.id ? String(other.id).slice(-4) : "unknown";
  return n1 || n2 || `User (${idTail})`;
}

function makeDmRoom(myId, otherId) {
  const [a, b] = [String(myId), String(otherId)].sort();
  return `dm:${a}|${b}`;
}

function parseDmRoom(room) {
  const m = /^dm:([^|]+)\|([^|]+)$/.exec(room || "");
  if (!m) return [null, null];
  return [m[1], m[2]];
}

async function resolveUserByUsername(username) {
  debug("🔍 Resolving user by username:", username);
  const res = await fetch(
    `http://localhost:3000/api/users/lookup?username=${encodeURIComponent(username)}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("User not found");
  const data = await res.json();
  logUser("Resolved user", data?.user);
  if (!data?.user?.id) throw new Error("Invalid user payload");
  return data.user; // { id, username, fullname? }
}

async function loadConversations() {
  debug("📚 Fetching conversations from server…");
  const res = await fetch("http://localhost:3000/api/conversations", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load conversations");
  const data = await res.json();
  logConvList(data.conversations || [], "Loaded Conversations");
  return data.conversations || [];
}

/* ---------------- component ---------------- */
export default function DMChat() {
  const [authed, setAuthed] = useState(false);
  const [me, setMe] = useState(null);

  // socket (create once we know we're authenticated)
  const socket = useMemo(() => {
    if (!authed) {
      debug("❌ Not authenticated, not creating socket");
      return null;
    }
    debug("🔌 Creating socket connection (cookie-based auth)");
    return io("http://localhost:3000", {
      withCredentials: true, // send httpOnly cookie automatically
    });
  }, [authed]);

  // ui state
  const [isCreating, setIsCreating] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [conversations, setConversations] = useState([]); // [{ room, other, lastMessage, lastMessageAt }]
  const [activeRoom, setActiveRoom] = useState("");
  const [activePeer, setActivePeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);

  // scroll & refs
  const messagesEndRef = useRef(null);
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // latest activeRoom for stable listener
  const activeRoomRef = useRef("");
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  // dedupe messages by _id within a room
  const seenIdsRef = useRef(new Set());

  /* ------- bootstrap: probe /api/me, then load conversations ------- */
  useEffect(() => {
    (async () => {
      try {
        debug("👤 Fetching /api/me …");
        const res = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("unauthorized");
        const data = await res.json();
        setMe(data.user);
        setAuthed(true);
        logUser("Me (/api/me)", data.user);

        setLoadingConversations(true);
        const convs = await loadConversations();
        setConversations(convs);
      } catch (e) {
        setAuthed(false);
        setMe(null);
        console.error("[DMChat] ❌ Not authenticated or bootstrap failed:", e);
      } finally {
        setLoadingConversations(false);
      }
    })();
  }, []);

  // log whenever "me" changes
  useEffect(() => {
    if (me) logUser("Me (state change)", me);
  }, [me]);

  // log whenever activePeer changes
  useEffect(() => {
    if (activePeer) logUser("Active peer", activePeer);
  }, [activePeer]);

  /* ------- stable socket listeners (no stacking) ------- */
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      debug("✅ Socket connected:", socket.id);
      // re-join active room across reconnects
      if (activeRoomRef.current) {
        debug("🏠 Re-joining room after connect:", activeRoomRef.current);
        socket.emit("join-room", activeRoomRef.current);
      }
    };

    const onReceive = (data) => {
      debug("📨 receive-message:", {
        _id: data?._id,
        room: data?.room,
        sender: data?.sender,
        createdAt: data?.createdAt,
        preview: data?.message?.slice?.(0, 80),
      });

      // drop duplicates
      if (data?._id && seenIdsRef.current.has(data._id)) {
        debug("↩️  Dropped duplicate message:", data._id);
        return;
      }
      if (data?._id) seenIdsRef.current.add(data._id);

      if (data?.room === activeRoomRef.current) {
        setMessages((prev) => [...prev, data]);
        setTimeout(scrollToBottom, 50);
      } else {
        // ensure the conversation exists / update previews
        setConversations((prev) => {
          const idx = prev.findIndex((c) => c.room === data.room);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              lastMessage: data.message,
              lastMessageAt: data.createdAt,
            };
            return updated;
          }
          const [u1, u2] = parseDmRoom(data.room);
          const myId = me?.id;
          const otherId = myId === u1 ? u2 : u1;
          const next = [
            {
              room: data.room,
              other: { id: otherId, username: `User ${String(otherId).slice(-4)}` },
              lastMessage: data.message,
              lastMessageAt: data.createdAt,
            },
            ...prev,
          ];
          logConvList(next, "Conversations (after unseen message)");
          return next;
        });
      }
    };

    const onConnectError = (err) =>
      console.error("[DMChat] ❌ Socket connect_error:", err?.message || err);
    const onError = (error) => console.error("[DMChat] ❌ Socket error:", error);

    socket.on("connect", onConnect);
    // prevent stacking: always remove then add
    socket.off("receive-message", onReceive);
    socket.on("receive-message", onReceive);
    socket.on("connect_error", onConnectError);
    socket.on("error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("receive-message", onReceive);
      socket.off("connect_error", onConnectError);
      socket.off("error", onError);
    };
  }, [socket, me]);

  // disconnect socket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        try {
          debug("🔌 Disconnecting socket");
          socket.disconnect();
        } catch {}
      }
    };
  }, [socket]);

  // join whenever activeRoom changes, and reset room-local deduper
  useEffect(() => {
    if (socket && activeRoom) {
      debug("🏠 Joining room:", activeRoom);
      socket.emit("join-room", activeRoom);
    }
    seenIdsRef.current.clear();
  }, [socket, activeRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // log search query changes
  useEffect(() => {
    if (searchQuery) debug("🔎 Search query:", searchQuery);
  }, [searchQuery]);

  /* ------- actions ------- */
  const startConversation = async (e) => {
    e?.preventDefault?.();
    if (!socket || !me) {
      debug("❌ Cannot start: no socket or me", { hasSocket: !!socket, me });
      return;
    }

    const username = newUsername.trim();
    if (!username) {
      debug("❌ No username provided");
      return;
    }

    try {
      const other = await resolveUserByUsername(username); // { id, username, fullname? }
      const room = makeDmRoom(me.id, other.id);
      debug("🧵 Starting conversation", { me: me.id, other: other.id, room });

      setConversations((prev) => {
        const exists = prev.some((c) => c.room === room);
        const next = exists ? prev : [{ room, other }, ...prev];
        logConvList(next, "Conversations (after start)");
        return next;
      });

      setActiveRoom(room);
      setActivePeer(other);
      setMessages([]);
      socket.emit("join-room", room);

      // load history and prefill deduper
      debug("📚 Fetching history for", room);
      const res = await fetch(
        `http://localhost:3000/api/messages/${encodeURIComponent(room)}`,
        { credentials: "include" }
      );
      const history = res.ok ? await res.json() : [];
      debug("📚 History loaded:", history.length);
      seenIdsRef.current.clear();
      history.forEach((m) => m?._id && seenIdsRef.current.add(m._id));
      setMessages(history);

      setIsCreating(false);
      setNewUsername("");
    } catch (err) {
      console.error("[DMChat] ❌ Failed to start conversation:", err);
      alert(err.message || "Failed to start conversation");
    }
  };

  const openConversation = async (conv) => {
    if (!socket) {
      debug("❌ No socket in openConversation");
      return;
    }
    debug("🧵 Opening conversation:", {
      room: conv.room,
      other: {
        id: conv.other?.id,
        username: conv.other?.username,
        fullname: conv.other?.fullname,
      },
    });

    setActiveRoom(conv.room);
    setActivePeer(conv.other);
    setMessages([]);
    socket.emit("join-room", conv.room);

    debug("📚 Fetching history for", conv.room);
    const res = await fetch(
      `http://localhost:3000/api/messages/${encodeURIComponent(conv.room)}`,
      { credentials: "include" }
    );
    const history = res.ok ? await res.json() : [];
    debug("📚 History loaded:", history.length);
    seenIdsRef.current.clear();
    history.forEach((m) => m?._id && seenIdsRef.current.add(m._id));
    setMessages(history);
  };

  const handleSendMessage = () => {
    if (!socket) {
      debug("❌ No socket connection");
      return;
    }
    const text = newMessage.trim();
    if (!text || !activeRoom) {
      debug("❌ Cannot send:", { hasText: !!text, activeRoom });
      return;
    }

    debug("📤 Sending message:", {
      room: activeRoom,
      textPreview: text.substring(0, 80),
    });
    socket.emit("message", { room: activeRoom, message: text });
    setNewMessage("");
  };

  /* ------- filters ------- */
  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const name = displayName(c.other).toLowerCase();
    const idStr = String(c.other?.id || "").toLowerCase();
    return name.includes(q) || idStr.includes(q);
  });

  /* ------- render ------- */
  if (!authed) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center text-gray-700">
        Please log in to start messaging.
      </div>
    );
  }

  return (
  <div>
    <Navbar />
    <div className="h-screen bg-gray-100 flex">
      
      {/* Sidebar */}
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
                We'll look up the user, create (or reuse) a DM, and you can start messaging.
              </p>
            </form>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="p-6 text-sm text-gray-500">Loading…</div>
          ) : filteredConversations.length === 0 ? (
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
                  {displayName(conv.other)}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {conv.lastMessage
                    ? conv.lastMessage.substring(0, 50) +
                      (conv.lastMessage.length > 50 ? "…" : "")
                    : "No messages yet"}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {conv.lastMessageAt
                    ? new Date(conv.lastMessageAt).toLocaleDateString()
                    : ""}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                {activePeer ? displayName(activePeer) : "No conversation selected"}
              </h2>
              <p className="text-sm text-gray-500">
                {activeRoom ? "Direct Message" : "Create or open a conversation"}
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
              Select or create a conversation to start chatting.
            </div>
          ) : (
            <>
              {messages.map((m) => {
                const mine = m?.sender?.id === me?.id;
                return (
                  <div
                    key={m._id || `${m.createdAt}-${Math.random()}`}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        mine
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-white text-gray-900 rounded-bl-md shadow-sm"
                      }`}
                    >
                      <p className="text-sm">{m.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          mine ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {m.createdAt
                          ? new Date(m.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
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
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={
                  activeRoom ? "Type a message…" : "Open or create a conversation first"
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-12"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.isComposing) handleSendMessage();
                }}
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
  </div>
  );
}
