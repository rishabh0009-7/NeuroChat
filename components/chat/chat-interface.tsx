"use client";

import { useState, useEffect, useRef } from "react";
import { ConversationSidebar } from "./conversation-sidebar";
import { Message } from "./message";
import { ChatInput } from "./chat-input";
import { Button } from "../button";
import { Menu, X, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  model?: string;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  isPinned: boolean;
  isArchived: boolean;
  _count: {
    messages: number;
  };
}

interface ChatInterfaceProps {
  conversations: Conversation[];
  currentConversation?: {
    id: string;
    title: string;
    messages: Message[];
  };
  onSendMessage: (message: string, model: string) => void;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onArchiveConversation: (id: string, archived: boolean) => void;
  onPinConversation: (id: string, pinned: boolean) => void;
  isLoading?: boolean;
}

export function ChatInterface({
  conversations,
  currentConversation,
  onSendMessage,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onArchiveConversation,
  onPinConversation,
  isLoading = false,
}: ChatInterfaceProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleSendMessage = async (message: string, model: string) => {
    if (!currentConversation) {
      // Create new conversation
      onNewConversation();
    }

    onSendMessage(message, model);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    // TODO: Implement message editing
    console.log("Edit message:", messageId, newContent);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversation?.id}
          onSelectConversation={onSelectConversation}
          onNewConversation={onNewConversation}
          onDeleteConversation={onDeleteConversation}
          onArchiveConversation={onArchiveConversation}
          onPinConversation={onPinConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {currentConversation ? (
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {currentConversation.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentConversation.messages.length} messages
                </p>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-gray-400" />
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Start a new conversation
                </h1>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          {!currentConversation ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Welcome to your AI Chatbot
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                  Start a new conversation to begin chatting with AI. You can
                  ask questions, get help with tasks, or just have a friendly
                  conversation.
                </p>
                <Button
                  onClick={onNewConversation}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Start New Conversation
                </Button>
              </div>
            </div>
          ) : currentConversation.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {currentConversation.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Send your first message to start the conversation.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {currentConversation.messages.map((message) => (
                <Message
                  key={message.id}
                  id={message.id}
                  content={message.content}
                  role={message.role}
                  timestamp={message.timestamp}
                  model={message.model}
                  isStreaming={message.isStreaming}
                  onEdit={handleEditMessage}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={!currentConversation}
          defaultModel="gpt-4o-mini"
        />
      </div>
    </div>
  );
}
