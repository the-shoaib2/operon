"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <Sun className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        )
    }

    const cycleTheme = () => {
        const currentTheme = theme
        if (currentTheme === "light") {
            setTheme("dark")
        } else {
            setTheme("light")
        }
    }

    const getThemeIcon = () => {
        const currentTheme = theme
        if (currentTheme === "light") {
            return <Sun className="h-[1.2rem] w-[1.2rem]" />
        } else {
            return <Moon className="h-[1.2rem] w-[1.2rem]" />
        }
    }

    return (
        <Button variant="ghost" size="icon" className="rounded-full" onClick={cycleTheme}>
            {getThemeIcon()}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
