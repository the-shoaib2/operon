import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAI } from "@/contexts/ai-context";
import { useChat } from "@/contexts/chat-context";
import { useModelDetector } from "@/contexts/model-context";
import type { ChatStatus } from "ai";
import type { Chat } from "@repo/types";

// AI Component Imports
import { ChatPromptInput } from "./prompt-input";
import { Message, MessageContent, MessageLoading } from "@/components/ai/message";
import { Shimmer } from "@/components/ai/shimmer";
import { ReasoningStepsDisplay, type ReasoningStep } from "@/components/ai/reasoning-steps";
import type { ChatMode } from "@/components/ai/chat-mode-selector";
import {
  ChatLayout as ChatLayoutContainer,
  ChatMain,
  ChatContent,
  ChatMessages,
  ChatMessagesContainer,
  ChatInputContainer,
  ChatEmptyState,
  ChatMessageList,
  ChatStatusBar
} from "./chat-layout";

// Chat Layout Props Interface
interface ChatLayoutProps {
  className?: string;
}


// Main Chat Component using structured layout
export const ChatLayout = React.memo(function ChatLayout({
  className
}: ChatLayoutProps) {
  const {
    messages,
    sendMessageStreaming,
    isLoading,
    streamingMessage,
    setMessages
  } = useAI();

  // Use unified chat context
  const {
    currentChat,
    updateChat,
    generateChatTitle,
    getChatById,
    setCurrentChat,
    updateChatMessages
  } = useChat();

  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [chatStatus, setChatStatus] = useState<ChatStatus>("ready");
  const [chatMode, setChatMode] = useState<ChatMode>("chat");
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const skipNextSyncRef = useRef(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Load chat from URL params or use current chat (optimized)
  useEffect(() => {
    const chatId = searchParams.get('chatId');

    if (chatId && chatId !== currentChat?.id) {
      const chat = getChatById(chatId);
      if (chat) {
        setCurrentChat(chat);
        // Load messages from chat and skip next sync to prevent double update
        const messagesWithTimestamp = (chat.messages || []).map(msg => ({
          ...msg,
          timestamp: msg.timestamp || new Date()
        }));
        setMessages(messagesWithTimestamp);
        skipNextSyncRef.current = true;
      }
    } else if (!chatId && currentChat) {
      // Load messages from current chat and skip next sync
      const messagesWithTimestamp = (currentChat.messages || []).map(msg => ({
        ...msg,
        timestamp: msg.timestamp || new Date()
      }));
      setMessages(messagesWithTimestamp);
      skipNextSyncRef.current = true;
    }
  }, [searchParams, currentChat?.id, getChatById, setCurrentChat, setMessages]);

  // Optimized auto-scroll with useCallback
  const scrollToBottom = useCallback((force = false) => {
    if (scrollRef.current && (!isUserInteracting || force)) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isUserInteracting]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, streamingMessage, scrollToBottom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear any ongoing operations
      setError(null);
      setChatStatus("ready");
      setReasoningSteps([]);
      if (userInteractionTimeoutRef.current) {
        clearTimeout(userInteractionTimeoutRef.current);
      }
    };
  }, []);

  // Handle user interaction with scroll area
  const handleUserScroll = useCallback(() => {
    setIsUserInteracting(true);
    
    // Clear existing timeout
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    
    // Reset user interaction state after 3 seconds of inactivity
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000);
  }, []);

  // Handle input focus to prevent auto-scroll
  const handleInputFocus = useCallback(() => {
    setIsUserInteracting(true);
    
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000);
  }, []);

  // Generate chat title when messages are available and chat doesn't have a proper title
  useEffect(() => {
    if (currentChat && messages.length > 0 && currentChat.title === 'New Chat') {
      generateChatTitle(currentChat.id, messages);
    }
  }, [messages, currentChat, generateChatTitle]);

  // Auto-select Ollama model if available and no model selected
  const { availableModels } = useModelDetector();

  useEffect(() => {
    if (!selectedModel && availableModels.length > 0) {
      // Find Ollama models within the available models list
      const ollamaOptions = availableModels.filter(m => m.provider === 'ollama');

      if (ollamaOptions.length > 0) {
        // Prefer llama3.2, otherwise take the first one
        const defaultModel = ollamaOptions.find(m => m.name.includes('llama3.2')) || ollamaOptions[0];
        if (defaultModel) {
          setSelectedModel(defaultModel.id);
        }
      }
    }
  }, [selectedModel, availableModels]);

  // Update chat messages in project context (debounced with cleanup)
  useEffect(() => {
    if (!currentChat || messages.length === 0) return;

    const timeoutId = setTimeout(() => {
      updateChat(currentChat.id, {
        messages: messages,
        updatedAt: new Date()
      });
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [messages, currentChat, updateChat]);

  // Update chat status based on loading state with error handling
  useEffect(() => {
    if (isLoading) {
      setChatStatus("submitted");
      setError(null); // Clear previous errors
    } else if (streamingMessage) {
      setChatStatus("streaming");
    } else {
      setChatStatus("ready");
    }
  }, [isLoading, streamingMessage]);

  // Listen for agent events to populate reasoning steps (with proper cleanup)
  useEffect(() => {
    if (!window.electronAPI?.ai?.onAgentEvent) return;
    if (chatMode === 'chat') return; // Only listen in agentic/planning modes

    const cleanup = window.electronAPI.ai.onAgentEvent((payload: any) => {
      // Handle reasoning events
      if (payload.topic === 'reasoning' && payload.event) {
        const eventType = payload.event.split(':')[1]; // e.g., 'step:think' -> 'think'

        if (eventType === 'think' || eventType === 'act' || eventType === 'observe') {
          const step: ReasoningStep = {
            type: eventType as 'think' | 'act' | 'observe',
            content: payload.data?.content || payload.data?.output || '',
            timestamp: Date.now(),
            status: 'completed',
          };

          setReasoningSteps(prev => [...prev, step]);
        }
      }
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [chatMode]);

  // Clear reasoning steps when starting new message
  useEffect(() => {
    if (isLoading && chatMode !== 'chat') {
      setReasoningSteps([]);
    }
  }, [isLoading, chatMode]);

  // Sync messages to current chat whenever they change (optimized)
  const isUpdatingRef = useRef(false);
  const lastMessagesRef = useRef<string>("");

  useEffect(() => {
    // Prevent infinite loops and unnecessary updates
    if (isUpdatingRef.current || !currentChat || messages.length === 0) {
      return;
    }

    // Skip sync if we just loaded messages from chat (prevents double sync)
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }

    // Create a unique identifier for current messages to detect actual changes
    const currentMessagesId = messages.map(m => m.id || `${m.content}-${m.timestamp}`).join('|');

    // Only proceed if messages actually changed
    if (currentMessagesId === lastMessagesRef.current) {
      return;
    }

    // Check if messages are different from what's in the chat
    const chatMessages = currentChat.messages || [];
    const messagesChanged = messages.length !== chatMessages.length ||
      messages.some((msg, idx) => {
        const chatMsg = chatMessages[idx];
        return msg.id !== chatMsg?.id || msg.content !== chatMsg?.content;
      });

    if (messagesChanged) {
      isUpdatingRef.current = true;
      lastMessagesRef.current = currentMessagesId;

      // Update chat messages
      updateChatMessages(currentChat.id, messages);

      // Auto-generate title from first user message if still "New Chat"
      if (currentChat.title === 'New Chat' && messages.length >= 1) {
        generateChatTitle(currentChat.id, messages);
      }

      // Reset flag after a short delay to allow state to settle
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [messages, currentChat?.id, currentChat?.messages, updateChatMessages, generateChatTitle]);

  // Memoized submit handler with proper error handling
  const handleSubmit = useCallback(async (message: { text: string; files: any[] }) => {
    if (!message.text.trim()) return;

    setInput("");
    setError(null);
    
    // Force scroll to bottom when submitting
    setTimeout(() => {
      scrollToBottom(true);
    }, 100);

    try {
      await sendMessageStreaming(message.text);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send message";
      setError(errorMessage);
      setChatStatus("error");
    }
  }, [sendMessageStreaming, scrollToBottom]);

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
    setError(null); // Clear error when user selects suggestion
  }, []);

  // Memoized retry handler
  const handleRetry = useCallback(() => {
    setError(null);
    setChatStatus("ready");
  }, []);

  // Memoized status display with error handling and retry
  const statusDisplay = useMemo(() => {
    if (error) {
      return (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <span>Error: {error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRetry}
            className="h-auto p-1 text-xs"
          >
            Retry
          </Button>
        </div>
      );
    }
    return null;
  }, [error, handleRetry]);

  
  return (
    <ChatLayoutContainer className={cn("h-full", className)}>
      <ChatMain>
        <ChatContent>
          <ChatMessages onScroll={handleUserScroll}>
            <ChatMessagesContainer>
              {messages.length === 0 ? (
                <ChatEmptyState
                  icon={<Sparkles className="w-5 h-5 text-primary-foreground" />}
                  actions={
                    suggestionButtons.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {suggestion}
                      </Button>
                    ))
                  }
                />
              ) : (
                <ChatMessageList>
                  {transformedMessages.map((message) => (
                    <Message key={message.id} from={message.role}>
                      <MessageContent>
                        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {message.content}
                        </div>
                      </MessageContent>
                    </Message>
                  ))}
                </ChatMessageList>
              )}

              {/* Show reasoning steps in agentic/planning modes */}
              {(chatMode === 'agentic' || chatMode === 'planning') && reasoningSteps.length > 0 && (
                <div className="px-4 py-2">
                  <ReasoningStepsDisplay steps={reasoningSteps} />
                </div>
              )}

              {/* Optimized loading indicator */}
              <MessageLoading
                isLoading={isLoading}
                streamingMessage={streamingMessage || undefined}
              />

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

              <div ref={scrollRef} />
            </ChatMessagesContainer>
          </ChatMessages>

          <ChatInputContainer>
            <ChatStatusBar status={statusDisplay} />
            <ChatPromptInput
              input={input}
              setInput={setInput}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              onSubmit={handleSubmit}
              status={chatStatus}
              chatMode={chatMode}
              onChatModeChange={setChatMode}
              onFocus={handleInputFocus}
            />
          </ChatInputContainer>
        </ChatContent>
      </ChatMain>
    </ChatLayoutContainer>
  );
});

export default function Chat() {
  return <ChatLayout />;
}

