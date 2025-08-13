"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "../button";
import { Send, Mic, Paperclip, Settings } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string, model: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  defaultModel?: string;
}

const models = [
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
];

export function ChatInput({
  onSendMessage,
  isLoading = false,
  disabled = false,
  defaultModel = "gpt-4o-mini",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 4000;
  const charCount = message.length;
  const isOverLimit = charCount > maxLength;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || disabled || isOverLimit) return;

    onSendMessage(message.trim(), selectedModel);
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleVoiceRecord = () => {
    // TODO: Implement voice recording
    setIsRecording(!isRecording);
    console.log("Voice recording:", !isRecording);
  };

  const handleFileUpload = () => {
    // TODO: Implement file upload
    console.log("File upload clicked");
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          {/* Model Selection */}
          <div className="flex-shrink-0">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isLoading}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              {models.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              disabled={isLoading || disabled}
              className="w-full p-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              rows={1}
              maxLength={maxLength}
            />

            {/* Character Count */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {charCount}/{maxLength}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Voice Record Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleVoiceRecord}
              disabled={isLoading || disabled}
              className={`h-10 w-10 p-0 ${
                isRecording
                  ? "text-red-500 bg-red-100 dark:bg-red-900/30"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Mic className="h-5 w-5" />
            </Button>

            {/* File Upload Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              disabled={isLoading || disabled}
              className="h-10 w-10 p-0 text-gray-400 hover:text-gray-600"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            {/* Send Button */}
            <Button
              type="submit"
              disabled={!message.trim() || isLoading || disabled || isOverLimit}
              className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {isOverLimit && (
          <div className="mt-2 text-sm text-red-500">
            Message is too long. Maximum {maxLength} characters allowed.
          </div>
        )}

        {/* Help Text */}
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </form>
    </div>
  );
}