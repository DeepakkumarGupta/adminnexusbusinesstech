'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useApi } from '@/utils/api'
import { useAuth } from '@/contexts/AuthContext'

export default function EditBlogPage({ params }: { params: { id: string } }) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [image, setImage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const router = useRouter()
    const { toast } = useToast()
    const { fetchWithAuth } = useApi()
    const { user } = useAuth()

    useEffect(() => {
        if (params.id) {
            fetchBlogData(params.id)
        }
    }, [params.id])

    const fetchBlogData = async (id: string) => {
        setIsFetching(true)
        try {
            const response = await fetchWithAuth(`http://localhost:5000/blogs/${id}`)
            if (response.ok) {
                const blogData = await response.json()
                setTitle(blogData.title || '')
                setContent(blogData.content || '')
                setExcerpt(blogData.excerpt || '')
                setImage(blogData.image || '')
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch blog data",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('Error fetching blog data:', error)
            toast({
                title: "Error",
                description: "An error occurred while fetching blog data",
                variant: "destructive",
            })
        } finally {
            setIsFetching(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const blogData = { title, content, excerpt, image }
        const url = `http://localhost:5000/blog/edit/${params.id}`

        try {
            const response = await fetchWithAuth(url, {
                method: 'PUT',
                body: JSON.stringify(blogData),
            })
            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Blog updated successfully",
                })
                router.push('/dashboard')
            } else {
                throw new Error('Failed to update blog')
            }
        } catch (error) {
            console.error('Error updating blog:', error)
            toast({
                title: "Error",
                description: "Failed to update blog. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return <div>Please log in to access this page.</div>
    }

    if (isFetching) {
        return <div>Loading...</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Blog</CardTitle>
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
                        <p className='text-sm text-muted-foreground'>If you change the title, the link to the blog will also change</p>
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
                        {isLoading ? 'Updating...' : 'Update Blog'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}