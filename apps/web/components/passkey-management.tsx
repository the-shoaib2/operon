'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Loader2, Pencil, Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PasskeyIcon } from '@/components/icons'
import { startRegistration } from '@simplewebauthn/browser'

interface Passkey {
    id: string
    name: string | null
    credentialDeviceType: string
    credentialBackedUp: boolean
    createdAt: string
    updatedAt: string
}

export function PasskeyManagement() {
    const [passkeys, setPasskeys] = useState<Passkey[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRegistering, setIsRegistering] = useState(false)
    const [editingPasskey, setEditingPasskey] = useState<Passkey | null>(null)
    const [deletingPasskey, setDeletingPasskey] = useState<Passkey | null>(null)
    const [newName, setNewName] = useState('')
    const router = useRouter()

    const fetchPasskeys = async () => {
        try {
            const response = await fetch('/api/passkeys')
            if (response.ok) {
                const data = await response.json()
                setPasskeys(data.passkeys)
            }
        } catch (error) {
            console.error('Error fetching passkeys:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPasskeys()
    }, [])

    const handleRegister = async () => {
        setIsRegistering(true)
        try {
            const optionsResponse = await fetch('/api/webauthn/register/options', {
                method: 'POST',
            })

            if (!optionsResponse.ok) throw new Error('Failed to get registration options')

            const { options } = await optionsResponse.json()
            const registrationResponse = await startRegistration(options)

            const verificationResponse = await fetch('/api/webauthn/register/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    response: registrationResponse,
                    challenge: options.challenge,
                }),
            })

            if (!verificationResponse.ok) throw new Error('Failed to verify registration')

            await fetchPasskeys()
            router.refresh()
        } catch (error) {
            console.error('Passkey registration error:', error)
        } finally {
            setIsRegistering(false)
        }
    }

    const handleUpdateName = async () => {
        if (!editingPasskey || !newName.trim()) return

        try {
            const response = await fetch(`/api/passkeys/${editingPasskey.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName.trim() }),
            })

            if (response.ok) {
                await fetchPasskeys()
                setEditingPasskey(null)
                setNewName('')
            }
        } catch (error) {
            console.error('Error updating passkey name:', error)
        }
    }

    const handleDelete = async () => {
        if (!deletingPasskey) return

        try {
            const response = await fetch(`/api/passkeys/${deletingPasskey.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                await fetchPasskeys()
                setDeletingPasskey(null)
                router.refresh()
            }
        } catch (error) {
            console.error('Error deleting passkey:', error)
        }
    }

    const getDeviceIcon = (deviceType: string) => {
        return <PasskeyIcon className="h-5 w-5" />
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="font-medium">Passkeys</h3>
                    <p className="text-sm text-muted-foreground">
                        Passkeys are a safer and easier replacement for passwords.
                    </p>
                </div>
                <Button onClick={handleRegister} disabled={isRegistering} size="sm">
                    {isRegistering ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registering...
                        </>
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Passkey
                        </>
                    )}
                </Button>
            </div>

            {passkeys.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <PasskeyIcon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">No passkeys found</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                        You haven't created any passkeys yet. Add one to sign in without a password.
                    </p>
                    <Button onClick={handleRegister} disabled={isRegistering} className="mt-6" variant="outline">
                        Create your first passkey
                    </Button>
                </div>
            ) : (
                <div className="rounded-md border">
                    {passkeys.map((passkey, index) => (
                        <div key={passkey.id} className={`flex items-center justify-between p-4 ${index !== passkeys.length - 1 ? 'border-b' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                    {getDeviceIcon(passkey.credentialDeviceType)}
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {passkey.name || `Passkey ${passkey.credentialDeviceType}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Created on {formatDate(passkey.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setEditingPasskey(passkey)
                                        setNewName(passkey.name || '')
                                    }}
                                >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => setDeletingPasskey(passkey)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Name Dialog */}
            <Dialog open={!!editingPasskey} onOpenChange={(open) => !open && setEditingPasskey(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Passkey Name</DialogTitle>
                        <DialogDescription>
                            Give your passkey a memorable name
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="My Passkey"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingPasskey(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateName} disabled={!newName.trim()}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deletingPasskey} onOpenChange={(open) => !open && setDeletingPasskey(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Passkey?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deletingPasskey?.name || 'this passkey'}"?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
