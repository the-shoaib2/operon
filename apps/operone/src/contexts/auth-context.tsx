import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'

interface User {
    id: string
    email: string
    name: string
    image?: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    isNewLogin: boolean
    login: () => Promise<void>
    loginWithToken: (token: string) => Promise<void>
    logout: () => Promise<void>
    clearNewLoginFlag: () => void
    error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isNewLogin, setIsNewLogin] = useState(false)
    const validatingRef = useRef(false)

    // Check authentication status on mount
    useEffect(() => {
        checkAuth()

        // Listen for auth success events from deep links
        const handleAuthSuccess = (_event: any, data: { token: string }) => {
            // Prevent duplicate validation calls
            if (validatingRef.current) {
                return
            }
            validateAndSetUser(data.token)
        }

        // Store the cleanup function returned by onAuthSuccess
        let cleanup: (() => void) | undefined

        // Note: This will be implemented in preload.ts
        if (window.electronAPI?.onAuthSuccess) {
            cleanup = window.electronAPI.onAuthSuccess(handleAuthSuccess)
        }

        // Cleanup function to prevent duplicate listeners
        return () => {
            // Remove the event listener
            if (cleanup) {
                cleanup()
            }
            // Reset validation state on cleanup
            validatingRef.current = false
        }
    }, [])

    const checkAuth = async () => {
        setIsLoading(true)
        setError(null)

        try {
            if (!window.electronAPI) {
                console.warn('Electron API not available')
                setIsLoading(false)
                return
            }

            const userData = await window.electronAPI.getUser()
            if (userData) {
                setUser(userData)
            }
        } catch (err) {
            console.error('Failed to check auth:', err)
            setError(err instanceof Error ? err.message : 'Failed to check authentication')
        } finally {
            setIsLoading(false)
        }
    }

    const validateAndSetUser = async (token: string) => {
        if (validatingRef.current) {
            return
        }

        validatingRef.current = true
        setIsLoading(true)
        setError(null)

        try {
            // Validate token with backend and get user data
            const response = await fetch('http://localhost:3000/api/auth/validate-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            })


            if (!response.ok) {
                const errorData = await response.json()
                console.error('Validation failed:', errorData)
                throw new Error(errorData.error || 'Token validation failed')
            }

            const { user: userData } = await response.json()

            // Store user data via IPC
            if (window.electronAPI) {
                console.log('AuthContext received user data:', userData)
                await window.electronAPI.setUser(userData, token)
                setUser(userData)
                setIsNewLogin(true) // Mark as fresh login
            }
        } catch (err) {
            console.error('Failed to validate token:', err)
            setError(err instanceof Error ? err.message : 'Authentication failed')
        } finally {
            setIsLoading(false)
            validatingRef.current = false
        }
    }

    const checkExistingWebSession = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/session-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })

            if (response.ok) {
                const data = await response.json()
                // Store user data and token
                if (window.electronAPI) {
                    await window.electronAPI.setUser(data.user, data.token)
                    setUser(data.user)
                    setIsNewLogin(true) // Mark as fresh login from existing session
                }
                return true
            }
        } catch (error) {
            // Silently handle - no existing session is expected behavior
            // Only log if it's not a 401 or network error
            if (error instanceof Error && !error.message.includes('401')) {
                console.log('Session check failed:', error.message)
            }
        }
        return false
    }

    const login = async () => {
        setIsLoading(true)
        setError(null)

        try {
            if (!window.electronAPI) {
                throw new Error('Electron API not available')
            }

            // First, try to check for existing web session
            const hasExistingSession = await checkExistingWebSession()

            if (hasExistingSession) {
                setIsLoading(false)
                return
            }

            // If no existing session, proceed with browser login
            await window.electronAPI.login()
            // Reset loading state after browser opens - the actual authentication will happen via deep link callback
            setIsLoading(false)
        } catch (err) {
            console.error('Failed to initiate login:', err)
            setError(err instanceof Error ? err.message : 'Failed to start login')
            setIsLoading(false)
        }
    }

    const logout = async () => {
        setIsLoading(true)
        setError(null)

        try {
            if (window.electronAPI) {
                await window.electronAPI.logout()
            }
            setUser(null)
        } catch (err) {
            console.error('Failed to logout:', err)
            setError(err instanceof Error ? err.message : 'Failed to logout')
        } finally {
            setIsLoading(false)
        }
    }

    const clearNewLoginFlag = () => {
        setIsNewLogin(false)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                isNewLogin,
                login,
                loginWithToken: validateAndSetUser,
                logout,
                clearNewLoginFlag,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
