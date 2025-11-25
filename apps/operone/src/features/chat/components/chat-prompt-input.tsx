"use client";

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputSelect,
  PromptInputSelectTrigger,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectValue,
} from "@/components/ai/prompt-input";
import type { FileUIPart, ChatStatus } from "ai";
import { MicIcon, PaperclipIcon, Loader2Icon } from "lucide-react";
import { useModelDetector } from "@/contexts";

interface ChatPromptInputProps {
  input: string;
  setInput: (value: string) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  onSubmit: (message: { text: string; files: FileUIPart[] }, event: React.FormEvent<HTMLFormElement>) => void;
  status: ChatStatus;
}

export function ChatPromptInput({
  input,
  setInput,
  selectedModel,
  setSelectedModel,
  onSubmit,
  status,
}: ChatPromptInputProps) {
  const { availableModels, isLoading, isOllamaAvailable, getAuthStatus } = useModelDetector();

  return (
    <PromptInput onSubmit={onSubmit}>
      <PromptInputTextarea
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        placeholder="Type your message..."
      />
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputButton>
            <PaperclipIcon size={16} />
          </PromptInputButton>
          <PromptInputButton>
            <MicIcon size={16} />
            <span>Voice</span>
          </PromptInputButton>
          <PromptInputSelect
            value={selectedModel}
            onValueChange={setSelectedModel}
            disabled={isLoading}
          >
            <PromptInputSelectTrigger>
              <PromptInputSelectValue>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  availableModels.find((m: any) => m.id === selectedModel)?.name || "Select model"
                )}
              </PromptInputSelectValue>
            </PromptInputSelectTrigger>
            <PromptInputSelectContent>
              {/* Ollama Models Section */}
              {isOllamaAvailable && (
                <>
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    Local Models (Ollama)
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-green-600">Connected</span>
                    </div>
                  </div>
                  {availableModels
                    .filter((model: any) => model.provider === 'ollama')
                    .map((model: any) => (
                      <PromptInputSelectItem key={model.id} value={model.id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span>{model.name}</span>
                            <span className="text-xs text-muted-foreground">{model.description}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-xs text-green-600">Local</span>
                          </div>
                        </div>
                      </PromptInputSelectItem>
                    ))}
                </>
              )}
              
              {/* Cloud Models Section */}
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                Cloud Models
              </div>
              {availableModels
                .filter((model: any) => model.provider !== 'ollama')
                .map((model: any) => {
                  const authStatus = getAuthStatus(model.id);
                  return (
                    <PromptInputSelectItem key={model.id} value={model.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                          <span>{model.name}</span>
                          <span className="text-xs text-muted-foreground">{model.description}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {authStatus === 'authenticated' && (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-xs text-green-600">Connected</span>
                            </>
                          )}
                          {authStatus === 'pending' && (
                            <>
                              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                              <span className="text-xs text-yellow-600">Auth Required</span>
                            </>
                          )}
                          {authStatus === 'failed' && (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                              <span className="text-xs text-red-600">Failed</span>
                            </>
                          )}
                        </div>
                      </div>
                    </PromptInputSelectItem>
                  );
                })}
              
              {/* No Models Message */}
              {availableModels.length === 0 && !isLoading && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground text-center">
                  No models available. Start Ollama or configure cloud models.
                </div>
              )}
              
              {/* Ollama Not Available Message */}
              {!isOllamaAvailable && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground text-center border-t">
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span>Ollama not detected. Start Ollama to use local models.</span>
                  </div>
                </div>
              )}
            </PromptInputSelectContent>
          </PromptInputSelect>
        </PromptInputTools>
        <PromptInputSubmit disabled={!input.trim()} status={status} />
      </PromptInputFooter>
    </PromptInput>
  );
}
