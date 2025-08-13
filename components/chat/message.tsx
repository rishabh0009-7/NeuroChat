"use client";

import { useState } from "react";
import { Button } from "../button";
import {
  Copy,
  Edit,
  ThumbsUp,
  ThumbsDown,
  User,
  Bot,
  Check,
  Loader,
} from "lucide-react";

interface MessageProps {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  model?: string;
  isStreaming?: boolean;
  onEdit?: (messageId: string, newContent: string) => void;
}

export function Message({
  id,
  content,
  role,
  timestamp,
  model,
  isStreaming = false,
  onEdit,
}: MessageProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const isUser = role === "user";
  const isAssistant = role === "assistant";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      onEdit?.(id, editContent);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(content);
  };

  const handleFeedback = (type: "positive" | "negative") => {
    // TODO: Implement feedback system
    console.log(`${type} feedback for message:`, id);
  };

  const formatContent = (text: string) => {
    // Simple markdown-like formatting
    return text.split('\n').map((line, i) => (
      <p key={i} className={i > 0 ? 'mt-2' : ''}>
        {line}
      </p>
    ));
  };

  return (
    <div
      className={`group relative py-4 ${
        isUser ? "bg-gray-50 dark:bg-gray-900/50" : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
            }`}
          >
            {isUser ? (
              <User className="h-5 w-5" />
            ) : (
              <Bot className="h-5 w-5" />
            )}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {isUser ? "You" : "AI Assistant"}
                </span>
                {model && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {model}
                  </span>
                )}
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatTime(timestamp)}
                </span>
              </div>

              {/* Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>

                {isUser && onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}

                {isAssistant && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback("positive")}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-green-500"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback("negative")}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Message Text */}
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={Math.max(3, editContent.split("\n").length)}
                />
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {isStreaming ? (
                  <div className="flex items-start space-x-2">
                    <div className="text-gray-900 dark:text-gray-100">
                      {formatContent(content)}
                    </div>
                    <Loader className="h-4 w-4 animate-spin text-blue-500 mt-1 flex-shrink-0" />
                  </div>
                ) : (
                  <div className="text-gray-900 dark:text-gray-100">
                    {formatContent(content)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}