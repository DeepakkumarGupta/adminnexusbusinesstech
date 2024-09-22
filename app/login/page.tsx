'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        setLoginError(null)

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            const response = await fetch('http://localhost:5000/auth/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            })

            if (response.ok) {
                const data = await response.json()
                if (data.isAdmin) {
                    localStorage.setItem('adminUser', JSON.stringify(data))
                    router.push('/') // Redirect to home page (admin panel) after successful login
                } else {
                    setLoginError('You do not have admin privileges.')
                }
            } else {
                setLoginError('Invalid email or password.')
            }
        } catch (error) {
            console.error('Login error:', error)
            setLoginError('An error occurred during login. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="p-8 bg-card rounded shadow-md w-full max-w-md">
                <h1 className="mb-4 text-2xl font-bold text-center text-card-foreground">Admin Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                    />
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {loginError && (
                    <p className="mt-4 text-sm text-destructive">{loginError}</p>
                )}
            </div>
        </div>
    )
}