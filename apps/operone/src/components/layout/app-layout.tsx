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
            <SidebarInset className="h-screen min-h-screen w-screen overflow-hidden">
                <main className="flex-1 min-h-full overflow-hidden">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
