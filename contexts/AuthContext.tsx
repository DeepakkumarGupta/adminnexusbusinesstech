'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    id: string
    username: string
    email: string
    role: string
    isAdmin: boolean
}

interface AuthContextType {
    user: User | null
    sessionToken: string | null
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [sessionToken, setSessionToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('sessionToken')
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser))
            setSessionToken(storedToken)
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            })
            if (response.ok) {
                const data = await response.json()
                setUser(data)
                // Assuming the backend sends the session token in the response
                const token = response.headers.get('X-Session-Token') || 'default-token'
                setSessionToken(token)
                localStorage.setItem('user', JSON.stringify(data))
                localStorage.setItem('sessionToken', token)
                router.push('/dashboard')
            } else {
                throw new Error('Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('sessionToken')
        setUser(null)
        setSessionToken(null)
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ user, sessionToken, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}