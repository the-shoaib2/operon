"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimatedPlaceholderProps {
  placeholders: string[];
  interval?: number;
  className?: string;
}

export const AnimatedPlaceholder = React.memo(function AnimatedPlaceholder({
  placeholders,
  interval = 2000,
  className
}: AnimatedPlaceholderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(true);
  const [displayedText, setDisplayedText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);

  // Typing animation effect
  React.useEffect(() => {
    const currentPlaceholder = placeholders[currentIndex];
    
    if (!isTyping) {
      // Start typing animation
      setIsTyping(true);
      setDisplayedText("");
      
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < currentPlaceholder.length) {
          setDisplayedText(prev => prev + currentPlaceholder[charIndex]);
          charIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
        }
      }, 30); // Typing speed

      return () => clearInterval(typeInterval);
    }
  }, [currentIndex, placeholders, isTyping]);

  // Rotation effect with fade
  React.useEffect(() => {
    const rotationInterval = setInterval(() => {
      // Fade out
      setIsVisible(false);
      
      // Wait for fade out, then change text and fade in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % placeholders.length);
        setIsVisible(true);
      }, 150); // Half of the fade duration
    }, interval);

    return () => clearInterval(rotationInterval);
  }, [placeholders.length, interval]);

  if (!placeholders.length) return null;

  return (
    <span 
      className={cn(
        "text-muted-foreground transition-opacity duration-300 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {displayedText}
      {isTyping && (
        <span className="inline-block w-2 h-4 bg-muted-foreground ml-1 animate-pulse" />
      )}
    </span>
  );
});

AnimatedPlaceholder.displayName = "AnimatedPlaceholder";
