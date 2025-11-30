'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Shield, AlertTriangle, Check, X, Search, Download } from 'lucide-react'

interface SecurityLog {
    id: string
    type: 'login' | 'logout' | 'password_change' | '2fa_enabled' | '2fa_disabled' | 'api_access' | 'suspicious' | 'failed_login'
    description: string
    timestamp: string
    ipAddress: string
    userAgent: string
    location: string
    severity: 'low' | 'medium' | 'high' | 'critical'
}

export default function SecurityLogPage() {
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState<'all' | 'login' | 'security' | 'api' | 'suspicious'>('all')

    // Security logs state - will be fetched from API
    const [logs, setLogs] = useState<SecurityLog[]>([])
    const [logsLoading, setLogsLoading] = useState(true)

    // Fetch security logs on component mount
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('/api/security/logs')
                if (response.ok) {
                    const data = await response.json()
                    setLogs(data.logs || [])
                }
            } catch {
                console.error('Failed to fetch security logs')
            } finally {
                setLogsLoading(false)
            }
        }

        fetchLogs()
    }, [])

    // Show loading state while data is being fetched
    if (logsLoading) {
        return (
            <div className="space-y-4 px-2 sm:px-0">
                <Card className='border-none'>
                    <CardContent className="w-full border-b px-2 sm:px-0 py-6">
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handleExportLogs = async () => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // Create a sample export
            const exportData = {
                logs: filteredLogs,
                exportDate: new Date().toISOString(),
                filters: { filter, severity, searchTerm }
            }
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `security-logs-${new Date().toISOString().split('T')[0]}.json`
            a.click()
            URL.revokeObjectURL(url)
            
            alert('Security logs exported successfully')
        } catch {
            alert('Failed to export logs')
        } finally {
            setLoading(false)
        }
    }

    const getLogIcon = (type: SecurityLog['type']) => {
        switch (type) {
            case 'login': return <Check className="h-4 w-4 text-green-500" />
            case 'logout': return <X className="h-4 w-4 text-gray-500" />
            case 'failed_login': return <X className="h-4 w-4 text-red-500" />
            case 'password_change': return <Shield className="h-4 w-4 text-blue-500" />
            case '2fa_enabled': return <Check className="h-4 w-4 text-green-500" />
            case '2fa_disabled': return <X className="h-4 w-4 text-orange-500" />
            case 'api_access': return <Shield className="h-4 w-4 text-purple-500" />
            case 'suspicious': return <AlertTriangle className="h-4 w-4 text-red-500" />
            default: return <Shield className="h-4 w-4 text-gray-500" />
        }
    }


    const getTypeBadge = (type: SecurityLog['type']) => {
        const colors = {
            login: 'text-green-600',
            logout: 'text-gray-600',
            failed_login: 'text-red-600',
            password_change: 'text-blue-600',
            '2fa_enabled': 'text-green-600',
            '2fa_disabled': 'text-orange-600',
            api_access: 'text-purple-600',
            suspicious: 'text-red-600'
        }

        return (
            <Badge variant="outline" className={`text-xs ${colors[type]}`}>
                {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
        )
    }

    const filteredLogs = logs.filter(log => {
        // Search filter
        if (searchTerm && !log.description.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false
        }

        // Type filter
        if (filter !== 'all') {
            switch (filter) {
                case 'login':
                    if (!['login', 'logout', 'failed_login'].includes(log.type)) return false
                    break
                case 'security':
                    if (!['password_change', '2fa_enabled', '2fa_disabled', 'suspicious'].includes(log.type)) return false
                    break
                case 'api':
                    if (log.type !== 'api_access') return false
                    break
                case 'suspicious':
                    if (log.type !== 'suspicious') return false
                    break
            }
        }

        return true
    })

    return (
        <div className="space-y-4 px-2 sm:px-0">
            <Card className='border-none'>
                <CardContent className="w-full border-b px-2 sm:px-0 py-6">
                    <div className="space-y-6">
                        {/* Page Header */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold">Security Log</h1>
                                <p className="text-muted-foreground">Monitor and review security-related activities</p>
                            </div>
                            <Button onClick={handleExportLogs} variant="outline" size="sm" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Logs
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Filters */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search security logs..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Select value={filter} onValueChange={(value: 'all' | 'login' | 'security' | 'api' | 'suspicious') => setFilter(value)}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Events</SelectItem>
                                            <SelectItem value="login">Login/Logout</SelectItem>
                                            <SelectItem value="security">Security</SelectItem>
                                            <SelectItem value="api">API Access</SelectItem>
                                            <SelectItem value="suspicious">Suspicious</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Security Logs */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Security Events
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {filteredLogs.length} event{filteredLogs.length !== 1 ? 's' : ''} found
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-lg border shadow-sm bg-gradient-to-br from-background to-muted/20">
                                {filteredLogs.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-center">
                                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                            <Shield className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">No security events found</h3>
                                        <p className="text-sm text-muted-foreground max-w-md">
                                            Try adjusting your filters or search terms to find security events
                                        </p>
                                    </div>
                                ) : (
                                    <div className="max-h-96 overflow-y-auto">
                                        <div className="divide-y divide-border/50">
                                            {filteredLogs.map((log, index) => (
                                                <div 
                                                    key={log.id} 
                                                    className={`p-4 hover:bg-muted/30 transition-colors ${index === 0 ? 'border-t-0' : ''}`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="mt-1 flex-shrink-0">
                                                            {getLogIcon(log.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0 space-y-3">
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                <h4 className="font-medium text-base truncate flex-1">{log.description}</h4>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    {getTypeBadge(log.type)}
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                                    <span className="text-muted-foreground">Time:</span>
                                                                    <span className="font-medium">
                                                                        {new Date(log.timestamp).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                                    <span className="text-muted-foreground">IP:</span>
                                                                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{log.ipAddress}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                                                    <span className="text-muted-foreground">Location:</span>
                                                                    <span className="font-medium">{log.location}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
