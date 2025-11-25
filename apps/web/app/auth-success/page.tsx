import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { CloseButton } from '@/components/close-button'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'
import { metadata as authSuccessMetadata } from './metadata'

export { authSuccessMetadata as metadata }

import { prisma } from '@/lib/prisma'

function generateToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

async function storeTokenForUser(userId: string): Promise<string> {
    const token = generateToken()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    await prisma.desktopAuthToken.create({
        data: {
            token,
            userId,
            expires: expiresAt
        }
    })

    return token
}

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
        const token = await storeTokenForUser(session.user.id!)
        const deepLink = `operone://auth?token=${token}`

        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md border-none bg-transparent shadow-none">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <CheckCircle2 className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Authentication Successful!</CardTitle>
                        <CardDescription>
                            You can now return to the Operone Desktop App
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <a
                            href={deepLink}
                            className={cn(buttonVariants({ size: 'lg' }), "w-full")}
                        >
                            Open Operone Desktop
                        </a>
                        <CloseButton />
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-center text-muted-foreground w-full">
                            Click &quot;Open Operone Desktop&quot; to continue or &quot;Cancel&quot; to stay here
                        </p>
                    </CardFooter>
                </Card>

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
        )

    }

    // Otherwise, just redirect to dashboard
    redirect('/dashboard')
}
