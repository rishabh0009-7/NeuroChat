'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '../button';
import { Send, Mic, StopCircle, Settings } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, model: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  defaultModel?: string;
}

export function ChatInput({ onSendMessage, isLoading, disabled = false, defaultModel = 'gpt-4o-mini' }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [model, setModel] = useState(defaultModel);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const models = [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim(), model);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="border-t bg-white dark:bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        {/* Model Selection */}
        <div className="flex items-center justify-between">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {models.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Message Input */}
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-h-[44px] max-h-32"
              rows={1}
              disabled={isLoading || disabled}
            />
          </div>

          {/* Voice Recording Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsRecording(!isRecording)}
            disabled={isLoading || disabled}
            className={`h-10 w-10 p-0 ${
              isRecording 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!message.trim() || isLoading || disabled}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Character Count */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
          {message.length}/4000 characters
        </div>
      </form>
    </div>
  );
}
