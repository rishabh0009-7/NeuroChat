"use client";

import { useState, useEffect } from "react";
import { Button } from "../button";
import {
  Plus,
  Search,
  MessageSquare,
  Pin,
  Archive,
  Trash2,
  MoreVertical,
  Settings,
} from "lucide-react";

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

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onArchiveConversation: (id: string, archived: boolean) => void;
  onPinConversation: (id: string, pinned: boolean) => void;
}

export function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onArchiveConversation,
  onPinConversation,
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);

  useEffect(() => {
    const filtered = conversations.filter((conv) => {
      const matchesSearch = conv.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesArchive = showArchived ? conv.isArchived : !conv.isArchived;
      return matchesSearch && matchesArchive;
    });

    // Sort: pinned first, then by date
    const sorted = filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    setFilteredConversations(sorted);
  }, [conversations, searchQuery, showArchived]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleConversationAction = (action: string, conversationId: string) => {
    switch (action) {
      case "pin":
        onPinConversation(
          conversationId,
          !conversations.find((c) => c.id === conversationId)?.isPinned
        );
        break;
      case "archive":
        onArchiveConversation(
          conversationId,
          !conversations.find((c) => c.id === conversationId)?.isArchived
        );
        break;
      case "delete":
        if (confirm("Are you sure you want to delete this conversation?")) {
          onDeleteConversation(conversationId);
        }
        break;
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Conversations
          </h2>
          <Button
            onClick={onNewConversation}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <div className="mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </Button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No conversations found</p>
            {!showArchived && (
              <Button
                onClick={onNewConversation}
                variant="ghost"
                size="sm"
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                Start your first conversation
              </Button>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  currentConversationId === conversation.id
                    ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {conversation.isPinned && (
                        <Pin className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                      )}
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {conversation.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{conversation._count.messages} messages</span>
                      <span>•</span>
                      <span>{formatDate(conversation.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConversationAction("pin", conversation.id);
                      }}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-yellow-500"
                    >
                      <Pin className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConversationAction("archive", conversation.id);
                      }}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConversationAction("delete", conversation.id);
                      }}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}
