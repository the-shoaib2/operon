import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Settings, Copy, RefreshCw, ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react'
import { Button } from '@/components'
import { Select } from '@/components'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components'
import { PromptInput, PromptInputTextarea, PromptInputSubmit } from '@/components/ai-elements/prompt-input'
import { useAI } from '@/contexts/ai-context'
import { useNavigate } from 'react-router-dom'
import type { ModelInfo } from '@repo/types'

export function ChatInterface() {
    const { messages, sendMessage, sendMessageStreaming, isLoading, streamingMessage, activeProvider, getAvailableModels } = useAI()
    const navigate = useNavigate()
    const [input, setInput] = useState('')
    const [availableModels, setAvailableModels] = useState<ModelInfo[]>([])
    const [selectedModel, setSelectedModel] = useState('')
    const [hoveredMessage, setHoveredMessage] = useState<string | null>(null)
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isLoading, streamingMessage])

    // Load available models when provider changes
    useEffect(() => {
        if (activeProvider) {
            loadModels()
        }
    }, [activeProvider])

    const loadModels = async () => {
        if (!activeProvider) return
        
        try {
            const models = await getAvailableModels(activeProvider.type)
            setAvailableModels(models)
            if (models.length > 0) {
                setSelectedModel(activeProvider.model)
            }
        } catch (error) {
            console.error('Failed to load models:', error)
        }
    }

    const handleCopy = async (content: string, messageId: string) => {
        try {
            await navigator.clipboard.writeText(content)
            setCopiedMessageId(messageId)
            setTimeout(() => setCopiedMessageId(null), 2000)
        } catch (error) {
            console.error('Failed to copy:', error)
        }
    }

    const handleRegenerate = async (messageId: string) => {
        // Find the user message that prompted this response
        const messageIndex = messages.findIndex(m => m.id === messageId)
        if (messageIndex > 0) {
            const userMessage = messages[messageIndex - 1]
            if (userMessage && userMessage.role === 'user') {
                try {
                    // Use streaming for browser mode, regular for Electron
                    if (!window.electronAPI || !window.electronAPI.ai) {
                        await sendMessageStreaming(userMessage.content)
                    } else {
                        await sendMessage(userMessage.content)
                    }
                } catch (error) {
                    console.error('Failed to regenerate:', error)
                }
            }
        }
    }

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const message = input.trim()
        setInput('')

        try {
            // Use streaming for browser mode, regular for Electron
            if (!window.electronAPI || !window.electronAPI.ai) {
                await sendMessageStreaming(message)
            } else {
                await sendMessage(message)
            }
        } catch (error) {
            console.error('Failed to send message:', error)
        }
    }

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="border-b bg-muted/30 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-sm font-semibold">Operone</h1>
                                <p className="text-xs text-muted-foreground">AI Assistant</p>
                            </div>
                        </div>
                        
                        {/* Model Selector */}
                        {activeProvider ? (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Model:</span>
                                <Select value={selectedModel} onValueChange={setSelectedModel}>
                                    {availableModels.map((model) => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        ) : (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-2"
                                onClick={() => navigate('/settings/account')}
                            >
                                <Settings className="w-4 h-4" />
                                Configure
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="max-w-4xl mx-auto">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-16">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-8">
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                                <div className="space-y-4 max-w-2xl">
                                    <h2 className="text-3xl font-bold tracking-tight">
                                        How can I help you today?
                                    </h2>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        I'm Operone, your AI assistant. I can help you manage files, run commands, organize your workspace, and much more.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mt-12">
                                    {[
                                        'Help me organize my downloads folder',
                                        'What are the system requirements for this app?',
                                        'Show me how to use the file manager',
                                        'Explain the AI provider settings'
                                    ].map((suggestion, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            className="h-auto py-4 px-6 justify-start text-left whitespace-normal border-muted-foreground/20 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                                            onClick={() => setInput(suggestion)}
                                        >
                                            <span className="text-sm leading-relaxed group-hover:text-primary transition-colors">
                                                {suggestion}
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 space-y-6">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                            className={cn(
                                                "group relative px-4 py-6",
                                                message.role === 'user' ? 'bg-muted/20' : 'bg-background'
                                            )}
                                            onMouseEnter={() => setHoveredMessage(message.id)}
                                            onMouseLeave={() => setHoveredMessage(null)}
                                        >
                                            <div className="max-w-4xl mx-auto">
                                                <div className="flex gap-4">
                                                    {/* Avatar */}
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                                        message.role === 'user' 
                                                            ? 'bg-primary text-primary-foreground' 
                                                            : 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
                                                    )}>
                                                        {message.role === 'user' ? (
                                                            <span className="text-sm font-medium">You</span>
                                                        ) : (
                                                            <Sparkles className="w-4 h-4" />
                                                        )}
                                                    </div>

                                                    {/* Message Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                                                    <p className="text-sm leading-7 whitespace-pre-wrap">
                                                                        {message.content}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Action Buttons */}
                                                            {message.role === 'assistant' && hoveredMessage === message.id && (
                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() => handleCopy(message.content, message.id)}
                                                                    >
                                                                        {copiedMessageId === message.id ? (
                                                                            <span className="text-xs text-green-600">✓</span>
                                                                        ) : (
                                                                            <Copy className="w-4 h-4" />
                                                                        )}
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() => handleRegenerate(message.id)}
                                                                    >
                                                                        <RefreshCw className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                    >
                                                                        <ThumbsUp className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                    >
                                                                        <ThumbsDown className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                    >
                                                                        <MoreVertical className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                ))}
                                
                                {/* Streaming Message */}
                                {streamingMessage && (
                                    <div className="group relative px-4 py-6 bg-background">
                                        <div className="max-w-4xl mx-auto">
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Sparkles className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="prose prose-sm max-w-none dark:prose-invert">
                                                        <p className="text-sm leading-7 whitespace-pre-wrap">
                                                            {streamingMessage}
                                                            <span className="inline-block w-1 h-5 bg-primary animate-pulse ml-1 align-middle" />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Loading Indicator */}
                                {isLoading && !streamingMessage && (
                                    <div className="group relative px-4 py-6 bg-background">
                                        <div className="max-w-4xl mx-auto">
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Sparkles className="w-4 h-4" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                                                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                                                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div ref={scrollRef} />
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="border-t bg-background/95 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto p-4">
                    {/* Status Bar */}
                    {activeProvider && (
                        <div className="flex items-center justify-between mb-3 px-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>Connected to {activeProvider.type}</span>
                                <span>•</span>
                                <span>Model: {selectedModel || 'Default'}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {messages.length} messages
                            </div>
                        </div>
                    )}

                    {/* Input Container with Vercel AI Elements */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                        <PromptInput
                            onSubmit={async (message) => {
                                if (!message.text.trim() || isLoading) return
                                
                                try {
                                    // Use streaming for browser mode, regular for Electron
                                    if (!window.electronAPI || !window.electronAPI.ai) {
                                        await sendMessageStreaming(message.text)
                                    } else {
                                        await sendMessage(message.text)
                                    }
                                } catch (error) {
                                    console.error('Failed to send message:', error)
                                }
                            }}
                            className="relative bg-muted/30 border border-border/50 rounded-2xl focus-within:border-primary/30 focus-within:bg-background transition-all duration-300 shadow-sm hover:shadow-md hover:border-border/80"
                        >
                            <div className="flex items-end gap-3 p-4">
                                <PromptInputTextarea
                                    value={input}
                                    onChange={setInput}
                                    placeholder="Message Operone..."
                                    className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60 text-base resize-none py-2 px-0 min-h-[24px] max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent transition-all duration-200"
                                    disabled={isLoading}
                                />
                                
                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                    
                                    <PromptInputSubmit
                                        disabled={!input.trim() || isLoading}
                                        className={cn(
                                            "h-9 w-9 rounded-lg transition-all duration-300 shrink-0",
                                            input.trim() && !isLoading
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-105 hover:rotate-12" 
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        )}
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4 transition-transform duration-300" />
                                        )}
                                    </PromptInputSubmit>
                                </div>
                            </div>
                            
                            {/* Input Footer */}
                            <div className="px-4 pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-muted-foreground/70">
                                        Press Enter to send, Shift+Enter for new line
                                    </div>
                                    <div className="text-xs text-muted-foreground/70">
                                        Operone can make mistakes. Verify important information.
                                    </div>
                                </div>
                            </div>
                        </PromptInput>
                    </div>
                </div>
            </div>
        </div>
    )
}
