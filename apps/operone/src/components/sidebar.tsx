import { MessageSquare, Settings, Database, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { View } from '../App'

interface SidebarProps {
    className?: string
    activeView: View
    onNavigate: (view: View) => void
}

export function Sidebar({ className, activeView, onNavigate }: SidebarProps) {
    return (
        <div className={cn("pb-12 w-64 border-r bg-muted/20 h-screen flex flex-col", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center justify-between mb-4 px-4">
                        <h2 className="text-lg font-semibold tracking-tight">
                            Operone
                        </h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">New Chat</span>
                        </Button>
                    </div>
                    <div className="space-y-1">
                        <Button
                            variant={activeView === 'chat' ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => onNavigate('chat')}
                        >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat
                        </Button>
                        <Button
                            variant={activeView === 'memory' ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => onNavigate('memory')}
                        >
                            <Database className="mr-2 h-4 w-4" />
                            Memory
                        </Button>
                        <Button
                            variant={activeView === 'settings' ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => onNavigate('settings')}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Recent
                    </h2>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start font-normal">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Project Planning
                        </Button>
                        <Button variant="ghost" className="w-full justify-start font-normal">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Code Review
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
