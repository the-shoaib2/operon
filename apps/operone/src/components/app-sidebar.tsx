import * as React from "react"
import { Command, MessageSquare, Trash2, Pencil } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useCallback } from "react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts"
import { useChat } from "@/contexts/chat-context"
import { commonNavItems, quickActions, truncateText } from "@/components/app-navigation"
import { cn } from "@/lib/utils"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { isMobile, state, toggleSidebar } = useSidebar()

  // Use unified chat context
  const { chats, currentChat, createChat, setCurrentChat, updateChat, deleteChat } = useChat()

  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false)
  const [chatToRename, setChatToRename] = React.useState<any>(null)
  const [newChatTitle, setNewChatTitle] = React.useState("")

  // Dynamic resize logic for auto-collapse behavior
  const handleResize = useCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    
    // Auto-collapse if window hits minimum height (800px) or width (700px)
    if ((width <= 700 || height <= 800) && state === "expanded" && !isMobile) {
      toggleSidebar()
    }
  }, [state, isMobile, toggleSidebar])
  
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  // Remove expanded sections state - all chats are always visible

  // Categorize chats by time
  const categorizeChats = React.useCallback((chats: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const categories = {
      today: [] as any[],
      yesterday: [] as any[],
      thisWeek: [] as any[],
      thisMonth: [] as any[],
      older: [] as any[]
    };

    chats.forEach(chat => {
      const chatDate = new Date(chat.updatedAt);
      if (chatDate >= today) {
        categories.today.push(chat);
      } else if (chatDate >= yesterday) {
        categories.yesterday.push(chat);
      } else if (chatDate >= lastWeek) {
        categories.thisWeek.push(chat);
      } else if (chatDate >= lastMonth) {
        categories.thisMonth.push(chat);
      } else {
        categories.older.push(chat);
      }
    });

    return categories;
  }, []);

  const categorizedChats = React.useMemo(() => categorizeChats(chats), [chats, categorizeChats]);

  // Handle creating a new chat (with error handling)
  const handleCreateNewChat = React.useCallback(async () => {
    try {
      // If current chat has no messages, just reuse it instead of creating a new one
      if (currentChat && (!currentChat.messages || currentChat.messages.length === 0)) {
        // Reset to clean state and navigate
        setCurrentChat(currentChat)
        navigate('/dashboard/chat', { replace: true })
        return
      }
      
      // Otherwise create a new chat
      await createChat()
      // Use replace to avoid adding to history stack and ensure clean URL
      navigate('/dashboard/chat', { replace: true })
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  }, [createChat, navigate, currentChat, setCurrentChat]);

  // Handle selecting a chat (with error handling)
  const handleSelectChat = React.useCallback(async (chat: any) => {
    try {
      setCurrentChat(chat)
      navigate(`/dashboard/chat?chatId=${chat.id}`)
    } catch (error) {
      console.error('Failed to select chat:', error);
    }
  }, [setCurrentChat, navigate]);

  // Handle chat rename (with validation)
  const handleRenameChat = React.useCallback(async () => {
    if (chatToRename && newChatTitle.trim()) {
      try {
        updateChat(chatToRename.id, { title: newChatTitle.trim() })
        setRenameDialogOpen(false)
        setChatToRename(null)
        setNewChatTitle("")
      } catch (error) {
        console.error('Failed to rename chat:', error);
      }
    }
  }, [chatToRename, newChatTitle, updateChat]);

  // Handle chat delete (with confirmation)
  const handleDeleteChat = React.useCallback(async (chat: any) => {
    try {
      deleteChat(chat.id)
      if (currentChat?.id === chat.id) {
        navigate('/dashboard/chat', { replace: true })
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  }, [deleteChat, currentChat, navigate]);

  // Open rename dialog (reset state)
  const openRenameDialog = React.useCallback((chat: any) => {
    setChatToRename(chat)
    setNewChatTitle(chat.title)
    setRenameDialogOpen(true)
  }, []);

  // Simple static navigation items
  const navMainItems = React.useMemo(() => [], [])

  // Memoized getInitials function
  const getInitials = React.useCallback((user: any) => {
    if (!user || !user?.name) return 'GU'
    const names = user.name.split(' ')
    return names.length > 1
      ? `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
      : `${user.name.charAt(0)}`.toUpperCase()
  }, []);

  // Check if we're on a settings page
  const isSettingsPage = location.pathname.startsWith('/settings')

  // Filter out settings items from secondary nav when on settings pages
  const filteredNavSecondary = React.useMemo(() => {
    if (!isSettingsPage) return commonNavItems

    return commonNavItems.filter(item =>
      !item.url?.startsWith('/settings')
    )
  }, [isSettingsPage])

  const sidebarData = {
    user: {
      name: user?.name || 'Guest User',
      email: user?.email || 'guest@example.com',
      avatar: user?.image || null,
      initials: getInitials(user)
    },
    navMain: navMainItems,
    navSecondary: filteredNavSecondary,
    teams: [{
      name: "Operone",
      logo: Command,
      plan: "Professional"
    }]
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <div className="relative group flex-1">
                <SidebarMenuButton size="lg" asChild className="flex-1" tooltip="Operone">
                  <Link to="/dashboard/chat">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Command className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Operone</span>
                      <span className="truncate text-xs">AI</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
                <SidebarTrigger className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background rounded-md p-1 group-data-[state=expanded]:hidden" />
              </div>
              <SidebarTrigger className="opacity-0 group-data-[state=expanded]:opacity-100 transition-opacity duration-200 group-data-[state=icon]:hidden hover:bg-muted rounded-md" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Non-collapsible Quick Actions */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.url}>
                  <SidebarMenuButton asChild tooltip={action.title}>
                    {action.title === "New Chat" ? (
                      <button
                        onClick={handleCreateNewChat}
                        className="flex items-center gap-2 w-full"
                      >
                        <action.icon className="w-4 h-4" />
                        <span>{action.title}</span>
                      </button>
                    ) : (
                      <Link to={action.url} className="flex items-center gap-2">
                        <action.icon className="w-4 h-4" />
                        <span>{action.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chats Section - Always Expanded */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden gap-0 py-1">
          <SidebarGroupLabel className="px-0">
            <div className="flex items-center gap-2 px-2 py-1">
              <MessageSquare className="w-4 h-4" />
              <span className="group-data-[collapsible=icon]:hidden font-medium">All Chats</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="max-h-96 overflow-y-auto">
              {Object.entries(categorizedChats).map(([category, categoryChats]) => {
                if (categoryChats.length === 0) return null;
                
                const getCategoryTitle = (cat: string) => {
                  switch(cat) {
                    case 'today': return 'Today';
                    case 'yesterday': return 'Yesterday';
                    case 'thisWeek': return 'This Week';
                    case 'thisMonth': return 'This Month';
                    case 'older': return 'Older';
                    default: return cat;
                  }
                };

                return (
                  <div key={category} className="mb-4">
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
                      {getCategoryTitle(category)} ({categoryChats.length})
                    </div>
                    <SidebarMenu>
                      {categoryChats.map((chat) => (
                        <SidebarMenuItem key={chat.id}>
                          <div className="flex items-center justify-between w-full group hover:bg-muted rounded-md transition-colors duration-200 px-2">
                            <SidebarMenuButton
                              asChild
                              className={cn(
                                "flex-1",
                                currentChat?.id === chat.id && "bg-accent text-accent-foreground",
                                "group-hover:bg-transparent"
                              )}
                              tooltip={truncateText(chat.title, 20)}
                            >
                              <button
                                onClick={() => handleSelectChat(chat)}
                                className="flex items-center gap-2 w-full"
                              >
                                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate group-data-[collapsible=icon]:hidden">{truncateText(chat.title, 20)}</span>
                              </button>
                            </SidebarMenuButton>
                            <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openRenameDialog(chat);
                                }}
                                className="p-1 hover:bg-background rounded-md flex items-center justify-center transition-colors duration-200"
                                title="Rename chat"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChat(chat);
                                }}
                                className="p-1 hover:bg-background rounded-md flex items-center justify-center text-destructive transition-colors duration-200 mr-2"
                                title="Delete chat"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </div>
                );
              })}
              {chats.length === 0 && (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
                  No chats yet. Start a new conversation!
                </div>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />

      {/* Rename Chat Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <Input
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            placeholder="Enter new chat title"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRenameChat()
              }
            }}
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRenameDialogOpen(false)
                setChatToRename(null)
                setNewChatTitle("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameChat} disabled={!newChatTitle.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
