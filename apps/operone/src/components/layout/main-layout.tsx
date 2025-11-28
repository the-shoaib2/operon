import * as React from "react"
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useChat } from "@/contexts/chat-context"

interface MainLayoutProps {
    children: React.ReactNode
    contextPanel?: React.ReactNode
}

function MainLayoutContent({
    children,
    contextPanel,
}: MainLayoutProps) {
    const { currentChat } = useChat()
    const { isMobile } = useSidebar()

    // Determine if we have messages (chat is active)
    const hasMessages = currentChat && currentChat.messages && currentChat.messages.length > 0

    // When no messages: show only main content (chat) - full width
    // When has messages: show context panel (if available) + chat
    // On mobile: always show chat full width if has messages

    return (
        <SidebarInset className="h-screen min-h-screen w-full overflow-hidden">
            <div className="h-full min-h-full w-full flex-1 overflow-hidden">
                {!hasMessages || isMobile ? (
                    // No messages OR Mobile: Show only chat (full width)
                    <div className="h-full min-h-full w-full flex flex-col">
                        {children}
                    </div>
                ) : (
                    // Has messages AND Desktop: Show only Context panel (if available), Chat on right
                    <ResizablePanelGroup
                        direction="horizontal"
                        onLayout={(sizes: number[]) => {
                            document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                                sizes
                            )}`
                        }}
                        className="h-full min-h-full w-full items-stretch"
                    >
                        {/* Context Panel only when chatting (Activity removed) */}
                        {contextPanel && (
                            <>
                                <ResizablePanel
                                    defaultSize={25}
                                    minSize={20}
                                    maxSize={40}
                                >
                                    <div className="h-full min-h-full flex flex-col border-r bg-background/50 backdrop-blur-sm">
                                        <div className="flex-1 overflow-auto p-4">
                                            {contextPanel}
                                        </div>
                                    </div>
                                </ResizablePanel>
                                <ResizableHandle withHandle />
                            </>
                        )}

                        {/* Chat Panel */}
                        <ResizablePanel
                            defaultSize={hasMessages && contextPanel ? 75 : 100}
                            minSize={60}
                        >
                            <div className="h-full min-h-full flex flex-col">
                                {children}
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                )}
            </div>
        </SidebarInset>
    )
}

export function MainLayout(props: MainLayoutProps) {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar collapsible="icon" />
            <MainLayoutContent {...props} />
        </SidebarProvider>
    )
}
