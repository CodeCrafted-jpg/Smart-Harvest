'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { MessageCircle, Clock, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

export default function PreviousChatsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchConversations();
    }
  }, [isLoaded, user]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/conversation/list');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch conversations');
      }

      setConversations(data.conversations || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const continueConversation = (conversationId: any) => {
    router.push(`/Chat/${conversationId}`);
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const getPreviewText = (messages: any[]) => {
    if (!messages || messages.length === 0) {
      return 'No messages yet';
    }

    // Get the last user message or first assistant message
    const lastUserMessage = messages
      .filter((msg: { role: string; }) => msg.role === 'user')
      .pop();

    if (lastUserMessage) {
      return lastUserMessage.content.substring(0, 100) + '...';
    }

    // Fallback to last message
    const lastMessage = messages[messages.length - 1];
    return lastMessage?.content?.substring(0, 100) + '...' || 'New conversation';
  };

  const getCropInfo = (submission: { cropType: any; village: any; district: any; }) => {
    if (!submission) return 'General farming chat';
    return `${submission.cropType} - ${submission.village}, ${submission.district}`;
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please sign in to view your conversations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Previous Conversations
          </h1>
          <p className="text-gray-600">
            Continue your farming discussions with Smart-Harvest AI
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={fetchConversations}
              className="mt-2 text-red-600 underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Conversations List */}
        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No conversations yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your first conversation with Smart-Harvest AI to get personalized farming advice.
            </p>
            <button
              onClick={() => router.push('/Form')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start New Conversation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div
                key={conversation._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                onClick={() => continueConversation(conversation._id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Conversation Header */}
                      <div className="flex items-center mb-2">
                        <MessageCircle className="h-5 w-5 text-green-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getCropInfo(conversation.submission)}
                        </h3>
                      </div>

                      {/* Preview Text */}
                      <p className="text-gray-600 mb-3 leading-relaxed">
                        {getPreviewText(conversation.messages)}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(conversation.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {conversation.messages?.length || 0} messages
                        </div>
                        {conversation.submission && (
                          <div className="text-green-600 font-medium">
                            {conversation.submission.farmSize} acres
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Continue Arrow */}
                    <div className="ml-4 flex-shrink-0">
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                    </div>
                  </div>
                </div>

                {/* Farm Details Footer (if available) */}
                {conversation.submission && (
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        <span className="font-medium">Soil:</span> {conversation.submission.soilType} 
                        <span className="mx-2">•</span>
                        <span className="font-medium">Season:</span> {conversation.submission.season}
                      </div>
                      <div className="text-green-600 font-medium">
                        Continue Chat →
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* New Conversation Button */}
        {conversations.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/form')}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Start New Conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}