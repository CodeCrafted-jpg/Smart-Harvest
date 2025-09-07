"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  User,
  Leaf,
  Plus,
  Menu,
  X,
  Trash2,
  MessageCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface Message {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface ChatSession {
  sessionId: string;
  title: string;
  createdAt: string;
  lastActivity: string;
  messageCount: number;
  lastMessage: {
    role: string;
    content: string;
    createdAt: string;
  } | null;
}

const QuickChatInterface: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load sessions
  const loadSessions = async () => {
    if (!isSignedIn) return;
    setIsLoadingSessions(true);
    try {
      const res = await fetch("/api/quickChat?list=true");
      const data = await res.json();
      if (data.success) setSessions(data.sessions);
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) loadSessions();
  }, [isSignedIn]);

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setCurrentTitle("");
    setSidebarOpen(false);
  };

  const loadChat = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/quickChat?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        setCurrentSessionId(data.sessionId);
        setCurrentTitle(data.title);
        setSidebarOpen(false);
      }
    } catch (err) {
      console.error("Failed to load chat:", err);
    }
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this chat?")) return;
    try {
      const res = await fetch(`/api/quickChat?sessionId=${sessionId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
        if (currentSessionId === sessionId) startNewChat();
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/quickChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue, sessionId: currentSessionId }),
      });
      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      setMessages(data.messages);
      setCurrentSessionId(data.sessionId);
      setCurrentTitle(data.title);
      loadSessions();
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I’m having trouble processing your request. Please try again.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHrs = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHrs < 1) return "Now";
    if (diffHrs < 24) return `${diffHrs}h`;
    if (diffHrs < 48) return "1d";
    return date.toLocaleDateString();
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="p-4 bg-green-100 rounded-lg mb-4">
            <MessageCircle className="h-12 w-12 text-green-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600">
            Sign in to start chatting with Smart-Harvest AI
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-80 bg-white/80 backdrop-blur-xl border-r border-green-200 transition-transform duration-300 lg:translate-x-0 lg:static`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-green-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Smart-Harvest AI</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-green-50 rounded-lg"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* New Chat */}
          <div className="p-4">
            <button
              onClick={startNewChat}
              className="w-full flex items-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <Plus size={18} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Sessions */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="space-y-2">
              {isLoadingSessions ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="p-3 bg-gray-100 rounded-lg animate-pulse">
                    <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="w-20 h-3 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : sessions.length > 0 ? (
                sessions.map((s) => (
                  <div
                    key={s.sessionId}
                    onClick={() => loadChat(s.sessionId)}
                    className={`group p-3 rounded-lg cursor-pointer ${
                      currentSessionId === s.sessionId
                        ? "bg-green-100 border border-green-200"
                        : "hover:bg-green-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {s.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {s.messageCount} messages • {formatTime(s.lastActivity)}
                        </p>
                        {s.lastMessage && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                            {s.lastMessage.role === "user" ? "You: " : "AI: "}
                            {s.lastMessage.content}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={(e) => deleteSession(s.sessionId, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No chat sessions yet</p>
                  <p className="text-xs text-gray-400">Start a new conversation</p>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-green-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName || user?.emailAddresses[0]?.emailAddress}
                </p>
                <p className="text-xs text-gray-500">Quick Chat Mode</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-green-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-green-50 rounded-lg"
              >
                <Menu size={20} className="text-green-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg relative">
                  <Sparkles className="h-5 w-5 text-white" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">
                    {currentTitle || "Quick Chat with Smart-Harvest AI"}
                  </h1>
                  <p className="text-sm text-green-600">
                    Ready to help • Agricultural Assistant
                  </p>
                </div>
              </div>
            </div>
            {currentSessionId && (
              <button
                onClick={startNewChat}
                className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">New</span>
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to Smart-Harvest AI
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Your quick agricultural assistant. Ask me anything about
                  farming, crops, soil health, or agricultural practices in
                  India.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    "What crops grow best in sandy soil?",
                    "How to control pest attacks naturally?",
                    "Best time to plant rice in monsoon?",
                    "How to improve soil fertility?",
                  ].map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setInputValue(ex)}
                      className="p-4 text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg"
                    >
                      <p className="text-sm text-gray-700">{ex}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-3xl ${
                        m.role === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          m.role === "user"
                            ? "bg-green-500"
                            : "bg-gradient-to-br from-green-500 to-green-600"
                        }`}
                      >
                        {m.role === "user" ? (
                          <User size={16} className="text-white" />
                        ) : (
                          <Sparkles size={16} className="text-white" />
                        )}
                      </div>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          m.role === "user"
                            ? "bg-green-500 text-white"
                            : "bg-white shadow-sm border border-green-100"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {m.content}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            m.role === "user"
                              ? "text-green-100"
                              : "text-gray-400"
                          }`}
                        >
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3 max-w-3xl">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-white shadow-sm border border-green-100">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="bg-white/80 backdrop-blur-lg border-t border-green-200 px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about farming, crops, soil, weather..."
                  className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  style={{ minHeight: "48px" }}
                  disabled={isTyping}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={`p-3 rounded-full transition ${
                  inputValue.trim() && !isTyping
                    ? "bg-green-500 text-white hover:bg-green-600 transform hover:scale-105 shadow-lg"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isTyping ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>

            {/* Quick Suggestions */}
            {messages.length > 0 && !isTyping && (
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  "Tell me more",
                  "Any alternatives?",
                  "What about organic methods?",
                  "Cost analysis please",
                ].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInputValue(s)}
                    className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-full hover:bg-green-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
                Smart-Harvest AI can make mistakes. Verify with agricultural
                experts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickChatInterface;
