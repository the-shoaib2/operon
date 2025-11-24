import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { CloseButton } from '@/components/close-button';

// In-memory token store (shared with validate-token API)
const tokenStore = new Map<string, { userId: string; expiresAt: number }>()

function generateToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

function storeTokenForUser(userId: string): string {
    const token = generateToken()
    const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes
    tokenStore.set(token, { userId, expiresAt })

    // Clean up expired tokens
    for (const [key, value] of tokenStore.entries()) {
        if (value.expiresAt < Date.now()) {
            tokenStore.delete(key)
        }
    }

    return token
}

// Export token store for use in API route
export { tokenStore }

export default async function AuthSuccessPage(props: {
    searchParams: Promise<{ token?: string; from?: string }>
}) {
    const searchParams = await props.searchParams
    const { token, from } = searchParams
    const session = await auth()

    if (!session || !session.user) {
        redirect('/login')
    }

    // If coming from desktop login or has token
    if (token || from === 'desktop') {
        // Generate a secure token for the desktop app
        const token = storeTokenForUser(session.user.id!)
        const deepLink = `operone://auth?token=${token}`

        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-6 p-8 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto">
                        <svg
                            className="w-10 h-10 text-primary-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold">Authentication Successful!</h1>
                    <p className="text-muted-foreground">You can now return to the Operone Desktop App</p>

                    <div className="flex flex-col gap-3">
                        <a
                            href={deepLink}
                            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
                        >
                            Open Operone Desktop
                        </a>
                        <CloseButton />
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Click &quot;Open Operone Desktop&quot; to continue or &quot;Cancel&quot; to stay here
                    </p>

                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                // Show confirmation dialog after 1 second
                                setTimeout(() => {
                                    if (confirm('Open Operone Desktop App?\\n\\nClick OK to open the app, or Cancel to stay on this page.')) {
                                        window.location.href = '${deepLink}';
                                    }
                                }, 1000);
                            `,
                        }}
                    />
                </div>
            </div>
        )
    }

    // Otherwise, just redirect to dashboard
    redirect('/dashboard')
}
