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
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface Conversation {
  _id: string;
  messages: Message[];
  submission: any;
}

const AgriChatPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  const submissionId = params?.id as string;

  // Initialize conversation
  useEffect(() => {
    const initializeConversation = async () => {
      if (!isSignedIn || !submissionId) {
        setIsLoading(false);
        return;
      }

      try {
        // First, try to get existing conversation
        const existingConvo = await fetch(`/api/conversation?id=${submissionId}`);
        
        if (existingConvo.ok) {
          const data = await existingConvo.json();
          setMessages(data.messages);
          setConversationId(data.conversation._id);
          setFormData(data.conversation.submission);
        } else {
          // Create new conversation with initial AI message
          console.log('Creating new conversation for submission:', submissionId);
          
          const response = await fetch('/api/conversation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ submissionId })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create conversation');
          }

          const data = await response.json();
          setMessages(data.messages);
          setConversationId(data.conversation._id);
          
          // Fetch form data separately if needed
          const formResponse = await fetch(`/api/form-submission/${submissionId}`);
          if (formResponse.ok) {
            const formData = await formResponse.json();
            setFormData(formData.submission);
          }
        }
      } catch (error) {
        console.error('Failed to initialize conversation:', error);
        // Set fallback initial message
        setMessages([
          {
            role: 'assistant',
            content: 'Hello! I\'m Smart-Harvest AI, your agricultural companion for Jharkhand. I\'m ready to help you with farming advice and crop recommendations. How can I assist you today?',
            createdAt: new Date()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeConversation();
  }, [isSignedIn, submissionId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      createdAt: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          conversationId: conversationId,
          submissionId: submissionId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Update messages with the latest from the server
      setMessages(data.messages);
      
      // Update conversation ID if it's a new conversation
      if (!conversationId) {
        setConversationId(data.conversation._id);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again or check your internet connection.',
        createdAt: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-green-100 rounded-lg mb-4">
            <Leaf className="h-12 w-12 text-green-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to access the Smart-Harvest AI chat.</p>
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
                <span>Consultation ID: {submissionId}</span>
              </div>
            </div>

            {/* Form Data Summary (if available) */}
            {formData && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Sprout className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Your Farm Profile</h3>
                    <p className="text-green-100 text-sm">Based on your submitted information</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-green-200">Location</p>
                    <p className="font-medium">{formData.district}</p>
                  </div>
                  <div>
                    <p className="text-green-200">Farm Size</p>
                    <p className="font-medium">{formData.farmSize} acres</p>
                  </div>
                  <div>
                    <p className="text-green-200">Soil Type</p>
                    <p className="font-medium">{formData.soilType}</p>
                  </div>
                  <div>
                    <p className="text-green-200">Season</p>
                    <p className="font-medium">{formData.season}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-md ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-green-500' 
                      : 'bg-gradient-to-br from-green-500 to-green-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Leaf size={16} className="text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-green-500 text-white'
                      : 'bg-white shadow-sm border border-green-100'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-green-100' : 'text-gray-400'
                    }`}>
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-xs lg:max-md">
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
                  query: "Based on my farm details, what crops do you recommend for this season?"
                },
                { 
                  icon: Cloud, 
                  text: "Weather Analysis", 
                  color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
                  query: "How will current weather patterns affect my recommended crops?"
                },
                { 
                  icon: Thermometer, 
                  text: "Soil Health", 
                  color: "text-orange-600 bg-orange-50 hover:bg-orange-100",
                  query: "How can I improve my soil health based on the pH and nutrient levels?"
                },
                { 
                  icon: Droplets, 
                  text: "Irrigation Tips", 
                  color: "text-red-600 bg-red-50 hover:bg-red-100",
                  query: "What's the best irrigation schedule for my crops and water source?"
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