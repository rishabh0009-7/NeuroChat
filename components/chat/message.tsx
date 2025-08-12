'use client';

import { useState } from 'react';
import { Copy, Check, Edit, MoreVertical, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '../button';

interface MessageProps {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  model?: string;
  isStreaming?: boolean;
  onEdit?: (id: string, content: string) => void;
}

export function Message({ 
  id, 
  content, 
  role, 
  timestamp, 
  model, 
  isStreaming = false,
  onEdit 
}: MessageProps) {
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const isUser = role === 'user';
  const isAssistant = role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={`group relative py-4 ${isUser ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            isUser 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-600 text-white'
          }`}>
            {isUser ? 'U' : 'AI'}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {isUser ? 'You' : 'AI Assistant'}
                </span>
                {model && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {model}
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(timestamp)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isUser && onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowActions(!showActions)}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Message Text */}
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  rows={Math.max(3, content.split('\n').length)}
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
                <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                  {content}
                  {isStreaming && (
                    <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse" />
                  )}
                </div>
              </div>
            )}

            {/* Feedback Actions */}
            {isAssistant && !isEditing && (
              <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Good
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Bad
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
