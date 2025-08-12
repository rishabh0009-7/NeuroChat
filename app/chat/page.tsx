"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { ChatInterface } from "../../components/chat/chat-interface";
import { useRouter } from "next/navigation";

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

interface FullConversation {
  id: string;
  title: string;
  updatedAt: string;
  isPinned: boolean;
  isArchived: boolean;
  messages: Message[];
  _count: {
    messages: number;
  };
}

export default function ChatPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<FullConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      const response = await fetch(
        `/api/chat?conversationId=${conversationId}`
      );
      if (response.ok) {
        const conversation = await response.json();
        setCurrentConversation(conversation);
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    loadConversation(conversationId);
  };

  const handleNewConversation = () => {
    setCurrentConversation(null);
    setStreamingMessage(null);
  };

  const handleSendMessage = async (message: string, model: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setStreamingMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationId: currentConversation?.id,
          model,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let fullContent = "";
      let conversationId = currentConversation?.id;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              // Streaming finished
              setStreamingMessage(null);
              setIsLoading(false);

              // Reload conversations and current conversation
              await loadConversations();
              if (conversationId) {
                await loadConversation(conversationId);
              }
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                setStreamingMessage(fullContent);
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setStreamingMessage(null);
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: conversationId }),
      });

      if (response.ok) {
        await loadConversations();
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const handleArchiveConversation = async (
    conversationId: string,
    archived: boolean
  ) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: conversationId,
          isArchived: archived,
        }),
      });

      if (response.ok) {
        await loadConversations();
        if (currentConversation?.id === conversationId) {
          setCurrentConversation((prev) =>
            prev ? { ...prev, isArchived: archived } : null
          );
        }
      }
    } catch (error) {
      console.error("Failed to archive conversation:", error);
    }
  };

  const handlePinConversation = async (
    conversationId: string,
    pinned: boolean
  ) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: conversationId,
          isPinned: pinned,
        }),
      });

      if (response.ok) {
        await loadConversations();
        if (currentConversation?.id === conversationId) {
          setCurrentConversation((prev) =>
            prev ? { ...prev, isPinned: pinned } : null
          );
        }
      }
    } catch (error) {
      console.error("Failed to pin conversation:", error);
    }
  };

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return null; // Will redirect
  }

  // Add streaming message to current conversation if it exists
  const conversationWithStreaming = currentConversation
    ? {
        ...currentConversation,
        messages: streamingMessage
          ? [
              ...currentConversation.messages,
              {
                id: "streaming",
                content: streamingMessage,
                role: "assistant" as const,
                timestamp: new Date(),
                model: "gpt-4o-mini",
                isStreaming: true,
              },
            ]
          : currentConversation.messages,
      }
    : null;

  return (
    <ChatInterface
      conversations={conversations}
      currentConversation={conversationWithStreaming}
      onSendMessage={handleSendMessage}
      onSelectConversation={handleSelectConversation}
      onNewConversation={handleNewConversation}
      onDeleteConversation={handleDeleteConversation}
      onArchiveConversation={handleArchiveConversation}
      onPinConversation={handlePinConversation}
      isLoading={isLoading}
    />
  );
}
