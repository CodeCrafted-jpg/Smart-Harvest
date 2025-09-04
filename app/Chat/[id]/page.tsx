"use client"

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Paperclip, 
  MoreVertical, 
  ArrowLeft,
  Leaf,
  Cloud,
  Sprout,
  MessageCircle,
  Loader2,
  MapPin,
  Thermometer,
  Droplets
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatPageProps {
  params: {
    id: string;
  };
}

const AgriChatPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const chatId = params?.id as string;

  // Simulate loading and initial message
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMessages([
        {
          id: '1',
          content: `Namaste! I'm Smart-Harvest AI, your agricultural companion for Jharkhand. I can help you with crop recommendations based on your soil test results, weather conditions, and local farming practices. How can I assist you today?`,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response with agricultural context
    setTimeout(() => {
      const responses = [
        "Based on your location and soil conditions, I recommend considering these crops for the upcoming season. Let me analyze the weather patterns and soil data to provide more specific guidance.",
        "That's a great question about crop selection! For Jharkhand's climate, I'd suggest focusing on crops that are well-suited to your soil type and the current weather forecast.",
        "I understand your farming concern. Let me help you with practical advice based on local agricultural practices and current market conditions in Jharkhand.",
        "For pest management in your area, here are some organic and sustainable approaches that work well with local crops and climate conditions.",
        "Considering the monsoon patterns and your soil test results, I can suggest the most suitable crops and expected yield estimates for your farm."
      ];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (actionText: string) => {
    setInputValue(actionText);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Loading Skeleton */}
        <div className="flex flex-col h-screen">
          {/* Header Skeleton */}
          <div className="bg-white/80 backdrop-blur-lg border-b border-green-200 px-4 py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-200 rounded-lg animate-pulse"></div>
                <div>
                  <div className="w-32 h-4 bg-green-200 rounded animate-pulse"></div>
                  <div className="w-20 h-3 bg-green-100 rounded animate-pulse mt-1"></div>
                </div>
              </div>
              <div className="w-8 h-8 bg-green-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Chat Area Skeleton */}
          <div className="flex-1 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${i % 2 === 0 ? '' : 'flex-row-reverse space-x-reverse'}`}>
                    <div className="w-8 h-8 bg-green-200 rounded-full animate-pulse"></div>
                    <div className={`px-4 py-3 rounded-2xl ${i % 2 === 0 ? 'bg-green-200' : 'bg-green-200'} animate-pulse`}>
                      <div className="w-48 h-4 bg-green-300 rounded"></div>
                      <div className="w-32 h-4 bg-green-300 rounded mt-2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Skeleton */}
          <div className="bg-white/80 backdrop-blur-lg border-t border-green-200 px-4 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="h-12 bg-green-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="flex flex-col h-screen">
        {/* Chat Header */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-green-200 px-4 py-4 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft size={20} className="text-green-600" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                </div>
                
                <div>
                  <h1 className="font-semibold text-gray-900">Smart-Harvest AI</h1>
                  <p className="text-sm text-green-600">Online • Agricultural Assistant</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-1 text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full">
                <Leaf size={12} />
                <span>Jharkhand Region</span>
              </div>
              <button className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <MoreVertical size={20} className="text-green-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {/* Chat ID Display */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-green-700 border border-green-200">
                <MessageCircle size={14} />
                <span>Consultation ID: {chatId}</span>
              </div>
            </div>

            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Sprout className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Welcome to Smart-Harvest AI</h3>
                  <p className="text-green-100 text-sm">Your AI-powered farming companion</p>
                </div>
              </div>
              <p className="text-green-100 text-sm leading-relaxed">
                I can help you with crop recommendations, soil analysis, weather insights, pest management, 
                and farming best practices specific to Jharkhand's climate and soil conditions.
              </p>
            </div>

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-green-500' 
                      : 'bg-gradient-to-br from-green-500 to-green-600'
                  }`}>
                    {message.sender === 'user' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Leaf size={16} className="text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-green-500 text-white'
                      : 'bg-white shadow-sm border border-green-100'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-green-100' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600">
                    <Leaf size={16} className="text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white shadow-sm border border-green-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white/80 backdrop-blur-lg border-t border-green-200 px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <button className="p-2 text-green-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <Paperclip size={20} />
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about crop recommendations, soil health, weather conditions, or farming practices..."
                  className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-green-400"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={`p-3 rounded-full transition-all duration-200 ${
                  inputValue.trim() && !isTyping
                    ? 'bg-green-500 text-white hover:bg-green-600 transform hover:scale-105'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isTyping ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                { 
                  icon: Sprout, 
                  text: "Crop Recommendations", 
                  color: "text-green-600 bg-green-50 hover:bg-green-100",
                  query: "I need crop recommendations for my farm in Jharkhand"
                },
                { 
                  icon: Cloud, 
                  text: "Weather Analysis", 
                  color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
                  query: "How will current weather affect my crops?"
                },
                { 
                  icon: Thermometer, 
                  text: "Soil Health Check", 
                  color: "text-orange-600 bg-orange-50 hover:bg-orange-100",
                  query: "Help me understand my soil test results"
                },
                { 
                  icon: Droplets, 
                  text: "Pest Management", 
                  color: "text-red-600 bg-red-50 hover:bg-red-100",
                  query: "How to prevent common pests in my crops?"
                },
                { 
                  icon: MapPin, 
                  text: "Local Farming Tips", 
                  color: "text-purple-600 bg-purple-50 hover:bg-purple-100",
                  query: "What are the best practices for farming in my district?"
                }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.query)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${action.color}`}
                >
                  <action.icon size={14} />
                  <span>{action.text}</span>
                </button>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="text-center mt-4">
              <p className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
                AI recommendations • Always consult with local agricultural experts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriChatPage;