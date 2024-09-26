'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/utils/api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, FileText, Plus } from 'lucide-react'

type Blog = {
    _id: string;
    title: string;
    excerpt: string;
    // Add other blog properties as needed
}

export default function DashboardPage() {
    const [userCount, setUserCount] = useState(0)
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuth()
    const { fetchWithAuth } = useApi()

    useEffect(() => {
        if (user) {
            fetchUserCount()
            fetchBlogs()
        }
    }, [user])

    const fetchUserCount = async () => {
        try {
            const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/admin/usercount`)
            if (response.ok) {
                const data = await response.json()
                setUserCount(data.count)
            } else {
                console.error('Failed to fetch user count')
            }
        } catch (error) {
            console.error('Error fetching user count:', error)
        }
    }

    const fetchBlogs = async () => {
        setIsLoading(true)
        try {
            const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/blogsbyauthor/${user?.username}`)
            if (response.ok) {
                const data = await response.json()
                setBlogs(data)
            } else {
                console.error('Failed to fetch blogs')
            }
        } catch (error) {
            console.error('Error fetching blogs:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <Link href="/dashboard/create-blog" passHref>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Blog
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{blogs.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Blogs</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {blogs.slice(0, 5).map((blog) => (
                                <li key={blog._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                    <span className="font-medium">{blog.title}</span>
                                    <Link href={`/dashboard/edit-blog/${blog._id}`} passHref>
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}