"use client"

import React, { forwardRef, useRef } from "react"
import { cn } from "@/lib/utils"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { AppIcon } from "@/components/icons/app-icon"
import { FolderIcons } from "@/components/icons/system-icons"

// Generic circle component with icon
const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode; IconComponent?: React.ComponentType<{ width?: number; height?: number; className?: string }> }>(
  ({ className, children, IconComponent }: { className?: string; children?: React.ReactNode; IconComponent?: React.ComponentType<{ width?: number; height?: number; className?: string }> }, ref) => (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-1 p-0 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {IconComponent ? (
        <IconComponent width={24} height={24} className="text-gray-700" />
      ) : (
        children
      )}
    </div>
  )
)

Circle.displayName = "Circle"

export default function AnimatedBeamSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Create refs for left and right icons (using 5 icons each side)
  const leftIcons = ['agents', 'core', 'thinking', 'memory', 'plugins'] as const
  const rightIcons = ['sdb', 'fs', 'shell', 'networking', 'mcp'] as const

  const leftRef0 = useRef<HTMLDivElement>(null)
  const leftRef1 = useRef<HTMLDivElement>(null)
  const leftRef2 = useRef<HTMLDivElement>(null)
  const leftRef3 = useRef<HTMLDivElement>(null)
  const leftRef4 = useRef<HTMLDivElement>(null)
  const leftRefs = [leftRef0, leftRef1, leftRef2, leftRef3, leftRef4]

  const rightRef0 = useRef<HTMLDivElement>(null)
  const rightRef1 = useRef<HTMLDivElement>(null)
  const rightRef2 = useRef<HTMLDivElement>(null)
  const rightRef3 = useRef<HTMLDivElement>(null)
  const rightRef4 = useRef<HTMLDivElement>(null)
  const rightRefs = [rightRef0, rightRef1, rightRef2, rightRef3, rightRef4]

  const centerRef = useRef<HTMLDivElement>(null)

  // Synchronized animation settings
  const animationDuration = 3
  const animationDelay = 0

  return (
    <div
      className="relative flex h-[100vh] w-full items-center justify-center overflow-hidden py-10"
      ref={containerRef}
    >
      {/* LAYOUT WRAPPER */}
      <div className="flex size-full max-h-[300px] max-w-3xl flex-col items-stretch justify-between gap-6">

        {/* 5 ROWS WITH ICONS */}
        {leftIcons.map((iconKey, i) => (
          <div key={i} className="flex flex-row items-center justify-between">
            {/* Left circle with icon and label */}
            <div className="flex flex-col items-center gap-2">
              <Circle ref={leftRefs[i]} IconComponent={FolderIcons[iconKey]} />
              <span className="text-xs font-medium text-gray-600 capitalize">{iconKey}</span>
            </div>

            {/* Center circle only on middle row */}
            {i === 2 ? (
              <div className="flex flex-col items-center gap-2">
                <Circle 
                  ref={centerRef} 
                  className="size-20 bg-gradient-to-br from-[rgb(255,140,0)]/20 via-[rgb(139,0,255)]/20 to-[rgb(0,255,127)]/20 shadow-[0_0_30px_-12px_rgba(255,140,0,0.8),0_0_60px_-12px_rgba(139,0,255,0.7),0_0_90px_-12px_rgba(255,0,139,0.6),0_0_120px_-12px_rgba(0,255,127,0.5),0_0_150px_-12px_rgba(255,69,0,0.4)]"
                >
                  <AppIcon width={76} height={76} />
                </Circle>
                <span className="text-xs font-medium uppercase text-gray-600 dark:text-gray-400">Operone</span>
              </div>
            ) : (
              <div className="w-20" />
            )}

            {/* Right circle with icon and label */}
            <div className="flex flex-col items-center gap-2">
              <Circle ref={rightRefs[i]} IconComponent={FolderIcons[rightIcons[i] as keyof typeof FolderIcons]} />
              <span className="text-xs font-medium text-gray-600 capitalize">{rightIcons[i]}</span>
            </div>
          </div>
        ))}

      </div>

      {/* BEAMS: LEFT -> CENTER */}
      {leftRefs.map((ref, i) => (
        <AnimatedBeam
          key={`L${i}`}
          containerRef={containerRef}
          fromRef={ref}
          toRef={centerRef}
          curvature={i < 2 ? -60 : i > 2 ? 60 : 0}
          endYOffset={i < 2 ? -10 : i > 2 ? 10 : 0}
          duration={animationDuration}
          delay={animationDelay}
        />
      ))}

      {/* BEAMS: RIGHT -> CENTER */}
      {rightRefs.map((ref, i) => (
        <AnimatedBeam
          key={`R${i}`}
          containerRef={containerRef}
          fromRef={ref}
          toRef={centerRef}
          reverse
          curvature={i < 2 ? -60 : i > 2 ? 60 : 0}
          endYOffset={i < 2 ? -10 : i > 2 ? 10 : 0}
          duration={animationDuration}
          delay={animationDelay}
        />
      ))}
    </div>
  )
}
