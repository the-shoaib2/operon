import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PasskeyRegister } from '@/components/passkey-register'
import { prisma } from '@/lib/prisma'
import { PasskeyIcon } from '@/components/icons/passkey'
import { ProfileCard } from '@/components/profile-card'

export default async function DashboardPage() {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    // Get user's passkeys
    const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? '' },
        include: { authenticators: true },
    })

    const passkeyCount = user?.authenticators.length || 0

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl font-bold">
                            Welcome  {session.user?.name}!
                        </CardTitle>
                        <CardDescription>
                            You are successfully authenticated
                        </CardDescription>
                    </CardHeader>
                </Card>

                <ProfileCard />


                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <PasskeyIcon />
                            <CardTitle className="text-xl font-bold">
                                Passkey
                            </CardTitle>
                        </div>
                        <CardDescription>
                            {passkeyCount > 0
                                ? `You have ${passkeyCount} passkey${passkeyCount > 1 ? 's' : ''} registered`
                                : 'Register a passkey for passwordless authentication'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PasskeyRegister />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
