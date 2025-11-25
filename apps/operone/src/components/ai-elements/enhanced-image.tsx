import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Download, Copy, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react'
import type { GeneratedImage } from '@repo/types'

interface EnhancedImageProps {
  images: GeneratedImage[]
  isLoading?: boolean
  onRegenerate?: () => void
  className?: string
}

export function EnhancedImage({ images, isLoading, onRegenerate, className }: EnhancedImageProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (imageData: string, index: number) => {
    try {
      // Convert base64 to blob
      const response = await fetch(`data:image/png;base64,${imageData}`)
      const blob = await response.blob()
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error('Failed to copy image:', error)
    }
  }

  const handleDownload = (imageData: string, index: number) => {
    const link = document.createElement('a')
    link.href = `data:image/png;base64,${imageData}`
    link.download = `generated-image-${index + 1}.png`
    link.click()
  }

  if (isLoading) {
    return (
      <Card className={cn("w-full max-w-2xl mx-auto", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Generating image...</p>
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

  if (images.length === 0) {
    return null
  }

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Generated Images</span>
              <span className="text-xs text-muted-foreground">({images.length})</span>
            </div>
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
          </div>

          {/* Images Grid */}
          <div className={cn(
            "grid gap-4",
            images.length === 1 ? "grid-cols-1" : 
            images.length === 2 ? "grid-cols-2" : 
            "grid-cols-1 md:grid-cols-2"
          )}>
            {images.map((image, index) => (
              <div key={index} className="group relative">
                <div className="relative overflow-hidden rounded-lg border bg-muted/20">
                  <img
                    src={`data:${image.mediaType};base64,${image.base64}`}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Image Actions Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => handleCopy(image.base64, index)}
                    >
                      {copiedIndex === index ? (
                        <span className="text-xs">✓</span>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => handleDownload(image.base64, index)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Image Metadata */}
                {(image.width || image.height || image.prompt) && (
                  <div className="mt-2 text-xs text-muted-foreground space-y-1">
                    {image.width && image.height && (
                      <p>Size: {image.width}×{image.height}</p>
                    )}
                    {image.prompt && (
                      <p className="line-clamp-2">Prompt: {image.prompt}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
