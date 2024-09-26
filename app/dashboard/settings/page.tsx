'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/contexts/AuthContext'

export default function SettingsPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [name, setName] = useState(user?.username || '')
    const [email, setEmail] = useState(user?.email || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Placeholder for future API call to update user settings
        toast({
            title: "Success",
            description: "Settings updated successfully",
        })
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Name
                            </label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Account preferences will be added in a future update.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}