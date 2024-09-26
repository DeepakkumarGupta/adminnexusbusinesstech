'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useApi } from '@/utils/api'
import { useAuth } from '@/contexts/AuthContext'

export default function CreateBlogPage() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [image, setImage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()
    const { fetchWithAuth } = useApi()
    const { user } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const blogData = { title, content, excerpt, image }
        const url = `${process.env.NEXT_PUBLIC_API_URL}/blog/post`

        try {
            const response = await fetchWithAuth(url, {
                method: 'POST',
                body: JSON.stringify(blogData),
            })
            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Blog created successfully",
                })
                router.push('/dashboard')
            } else {
                throw new Error('Failed to create blog')
            }
        } catch (error) {
            console.error('Error creating blog:', error)
            toast({
                title: "Error",
                description: "Failed to create blog. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return <div>Please log in to access this page.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Blog</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            Title
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium">
                            Content
                        </label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className="min-h-[200px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="excerpt" className="text-sm font-medium">
                            Excerpt
                        </label>
                        <Input
                            id="excerpt"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="image" className="text-sm font-medium">
                            Image URL
                        </label>
                        <Input
                            id="image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Blog'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}