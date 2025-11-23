import { useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        // Simulate AI response
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'This is a placeholder response. The AI engine will be connected via Electron IPC.',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMessage])
            setIsLoading(false)
        }, 1000)
    }

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-0 animate-in fade-in duration-500 slide-in-from-bottom-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight mb-2">
                            How can I help you?
                        </h2>
                        <p className="text-muted-foreground max-w-md">
                            I can help you manage files, run commands, and organize your workspace.
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex gap-4 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2",
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                            )}
                            <div
                                className={cn(
                                    "rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm max-w-[80%]",
                                    message.role === 'user'
                                        ? 'bg-primary text-primary-foreground ml-12'
                                        : 'bg-card border text-card-foreground mr-12'
                                )}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex gap-4 max-w-3xl mx-auto w-full animate-in fade-in">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-card border rounded-2xl px-5 py-4 shadow-sm">
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce delay-100" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce delay-200" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 bg-background/80 backdrop-blur-sm border-t">
                <div className="max-w-3xl mx-auto relative">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Ask anything..."
                        className="pr-12 py-6 text-base rounded-full shadow-sm border-muted-foreground/20 focus-visible:ring-primary/20"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-muted-foreground">
                        Operone can make mistakes. Please verify important information.
                    </p>
                </div>
            </div>
        </div>
    )
}
