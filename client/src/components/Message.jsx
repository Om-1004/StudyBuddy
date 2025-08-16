import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, Video, MoreHorizontal, Paperclip, Smile, Send } from 'lucide-react';

// Mock data for conversations
const mockConversations = [
  {
    id: '1',
    name: 'Sarah Chen',
    subject: 'Computer Science',
    lastMessage: 'Hey! Are you free to study tomorrow?',
    timestamp: '2m ago',
    unreadCount: 2,
    isOnline: true,
    avatar: 'SC'
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    subject: 'Mathematics',
    lastMessage: 'Thanks for the notes!',
    timestamp: '1h ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'MJ'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    subject: 'Physics',
    lastMessage: 'The exam is next week, right?',
    timestamp: '3h ago',
    unreadCount: 1,
    isOnline: true,
    avatar: 'ER'
  }
];

// Mock messages for active conversation
const mockMessages = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Sarah Chen',
    message: 'Hey! Are you free to study tomorrow?',
    timestamp: '2:30 PM',
    isOwn: false
  },
  {
    id: '2',
    senderId: '1',
    senderName: 'You',
    message: 'Yes! What time works for you?',
    timestamp: '2:32 PM',
    isOwn: true
  },
  {
    id: '3',
    senderId: '2',
    senderName: 'Sarah Chen',
    message: 'How about 3 PM at the library?',
    timestamp: '2:33 PM',
    isOwn: false
  },
  {
    id: '4',
    senderId: '1',
    senderName: 'You',
    message: 'Perfect! See you there 📚',
    timestamp: '2:35 PM',
    isOwn: true
  }
];

function MessagingApp() {
  const [activeConversation, setActiveConversation] = useState(mockConversations[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      senderId: '1',
      senderName: 'You',
      message: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setActiveConversation(conversation)}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeConversation.id === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {conversation.avatar}
                  </div>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">{conversation.subject}</p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {activeConversation.avatar}
                </div>
                {activeConversation.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div>
                <h2 className="font-semibold text-gray-900">{activeConversation.name}</h2>
                <p className="text-sm text-gray-500">
                  {activeConversation.isOnline ? 'Online' : 'Offline'} • {activeConversation.subject}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Video className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isOwn 
                  ? 'bg-blue-500 text-white rounded-br-md' 
                  : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
              }`}>
                <p className="text-sm">{message.message}</p>
                <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3" onSubmit={handleSendMessage}>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-12"
                value={newMessage}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Smile className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
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

export default MessagingApp;