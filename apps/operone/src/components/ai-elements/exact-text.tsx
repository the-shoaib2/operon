import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Copy, RefreshCw, Zap, Clock, Hash } from 'lucide-react'
import type { ExactTextResult } from '@repo/types'

interface ExactTextProps {
  result?: ExactTextResult
  isLoading?: boolean
  onRegenerate?: () => void
  className?: string
}

export function ExactText({ result, isLoading, onRegenerate, className }: ExactTextProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className={cn("w-full max-w-2xl mx-auto", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center min-h-[120px]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Generating exact text...</p>
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return null
  }

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Exact Text Generation
          </CardTitle>
          <div className="flex items-center gap-2">
            {onRegenerate && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerate}
                className="gap-2"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerate
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(result.text)}
              className="gap-2"
            >
              {copied ? (
                <span className="text-xs">✓</span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
              Copy
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Metadata */}
        {result.metadata && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {result.metadata.model && (
              <Badge variant="secondary" className="gap-1">
                <Hash className="w-3 h-3" />
                {result.metadata.model}
              </Badge>
            )}
            {result.metadata.tokens && (
              <Badge variant="outline" className="gap-1">
                <Hash className="w-3 h-3" />
                {result.metadata.tokens} tokens
              </Badge>
            )}
            {result.metadata.duration && (
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" />
                {(result.metadata.duration / 1000).toFixed(2)}s
              </Badge>
            )}
          </div>
        )}

        {/* Exact Text Content */}
        <div className="relative">
          <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                {result.text}
              </pre>
            </div>
          </div>
          
          {/* Exact Text Indicator */}
          <div className="absolute -top-2 -right-2">
            <Badge variant="default" className="gap-1 text-xs">
              <Zap className="w-3 h-3" />
              Exact
            </Badge>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-xs text-muted-foreground text-center">
          This text was generated using exact text generation for precise output
        </div>
      </CardContent>
    </Card>
  )
}
