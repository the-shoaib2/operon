"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Sparkles, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAI } from "@/contexts/ai-context";
import type { FileUIPart, ChatStatus } from "ai";

// AI Component Imports
import { ChatPromptInput } from "./prompt-input";
import { Message, MessageContent } from "@/components/ai/message";
import { Shimmer } from "@/components/ai/shimmer";


// Optimized ChatLayout Component with memoization
interface ChatLayoutProps {
  className?: string;
}

export const ChatLayout = React.memo(function ChatLayout({ 
  className
}: ChatLayoutProps) {
  const { 
    messages, 
    sendMessageStreaming, 
    isLoading, 
    streamingMessage, 
    activeProvider 
  } = useAI();
  
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [chatStatus, setChatStatus] = useState<ChatStatus>("ready");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Optimized auto-scroll with useCallback
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, streamingMessage, scrollToBottom]);

  // Update chat status based on loading state
  useEffect(() => {
    if (isLoading) {
      setChatStatus("submitted");
    } else if (streamingMessage) {
      setChatStatus("streaming");
    } else {
      setChatStatus("ready");
    }
  }, [isLoading, streamingMessage]);

  // Memoized submit handler with proper error handling
  const handleSubmit = useCallback(async (message: { text: string; files: FileUIPart[] }) => {
    if (!message.text.trim()) return;
    
    setInput("");
    
    try {
      await sendMessageStreaming(message.text);
    } catch (error) {
      console.error("Failed to send message:", error);
      setChatStatus("error");
    }
  }, [sendMessageStreaming]);

  // Memoized transformed messages with proper typing
  const transformedMessages = useMemo(() => 
    messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    })),
    [messages]
  );

  // Memoized suggestion buttons with shadcn-friendly labels
  const suggestionButtons = useMemo(() => [
    "Start a conversation",
    "Explain the architecture", 
    "Create a code example",
    "Generate an artifact"
  ], []);

  // Memoized suggestion click handler
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
  }, []);

  // Memoized status display with shadcn styling patterns
  const statusDisplay = useMemo(() => {
    if (!activeProvider) return null;
    
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-muted-foreground">Connected to {activeProvider.type}</span>
        <span className="text-muted-foreground/60">•</span>
        <span className="text-muted-foreground">Model: {selectedModel || "Default"}</span>
      </div>
    );
  }, [activeProvider, selectedModel]);

  // Memoized message count display with shadcn typography
  const messageCountDisplay = useMemo(() => (
    <span className="text-sm text-muted-foreground">{messages.length} messages</span>
  ), [messages.length]);

  return (
    <div className={cn("flex flex-col h-screen overflow-hidden bg-background", className)}>
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
                <div className="space-y-6">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 shadow-lg">
                        <Sparkles className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h2 className="text-2xl font-semibold mb-3 text-foreground">Start a conversation</h2>
                      <p className="text-muted-foreground mb-6 max-w-sm">
                        Ask me anything! I'm here to help with your questions and tasks.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {suggestionButtons.map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pb-4">
                      {transformedMessages.map((message) => (
                        <Message key={message.id} from={message.role}>
                          <MessageContent>
                            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                              {message.content}
                            </div>
                          </MessageContent>
                        </Message>
                      ))}
                    </div>
                  )}
                  
                  {/* Loading indicator with shadcn styling */}
                  {isLoading && !streamingMessage && (
                    <div className="flex justify-center py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Streaming message with shadcn shimmer */}
                  {streamingMessage && (
                    <div className="flex justify-start">
                      <Message from="assistant">
                        <MessageContent>
                          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                            {streamingMessage}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Shimmer>Typing...</Shimmer>
                          </div>
                        </MessageContent>
                      </Message>
                    </div>
                  )}
                </div>

                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input Container with proper scrolling */}
          <div className="flex-shrink-0 border-t border-border bg-background">
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
              {/* Status bar with shadcn typography */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {statusDisplay}
                </div>
                <div className="text-xs text-muted-foreground">
                  {messageCountDisplay}
                </div>
              </div>

              <ChatPromptInput
                input={input}
                setInput={setInput}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                onSubmit={handleSubmit}
                status={chatStatus}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function Chat() {
  return <ChatLayout />;
}

