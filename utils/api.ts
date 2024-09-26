import { useAuth } from '@/contexts/AuthContext'

export const useApi = () => {
    const { sessionToken } = useAuth()

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        const headers = new Headers(options.headers || {})
        headers.set('Content-Type', 'application/json')
        if (sessionToken) {
            headers.set('Authorization', `Bearer ${sessionToken}`)
        }

        const response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers,
        })

        if (response.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
            window.location.href = '/login'
            throw new Error('Unauthorized')
        }

        return response
    }

    return { fetchWithAuth }
}