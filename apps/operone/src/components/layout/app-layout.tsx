import * as React from "react"
import { SidebarProvider, SidebarInset } from "@/components"
import { AppSidebar } from "@/components/app-sidebar"

interface AppLayoutProps {
    children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="h-screen overflow-hidden">
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
