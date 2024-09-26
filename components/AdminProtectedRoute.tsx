'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && (!user || !user.isAdmin)) {
            router.push('/login')
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return user && user.isAdmin ? <>{children}</> : null
}
