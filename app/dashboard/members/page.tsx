'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/utils/api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast";

type User = {
    _id: string
    username: string
    email: string
    isAdmin: boolean
    role: string
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [isCreatingUser, setIsCreatingUser] = useState(false)
    const { user } = useAuth()
    const { fetchWithAuth } = useApi()

    useEffect(() => {
        if (user) {
            fetchUsers()
        }
    }, [user])

    const fetchUsers = async () => {
        try {
            const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`)
            if (response.ok) {
                const data = await response.json()
                setUsers(data)
            } else {
                const errorData = await response.json()
                toast({
                    title: "Error",
                    description: errorData.message || "Failed to fetch users",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            toast({
                title: "Error",
                description: "An unexpected error occurred while fetching users",
                variant: "destructive",
            })
        }
    }

    const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsCreatingUser(true)

        const formData = new FormData(event.currentTarget)
        const newUser = {
            username: formData.get('username') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            isAdmin: formData.get('isAdmin') === 'true',
            role: formData.get('role') as string,
        }

        try {
            const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/admin/create-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            })

            if (response.ok) {
                await fetchUsers()
                setIsCreatingUser(false)
            } else {
                console.error('Failed to create user')
            }
        } catch (error) {
            console.error('Error creating user:', error)
        }
    }

    const handleUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const updatedUser = {
            _id: editingUser?._id,
            username: formData.get('username') as string,
            email: formData.get('email') as string,
            isAdmin: formData.get('isAdmin') === 'true',
            role: formData.get('role') as string,
        }

        try {
            const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/admin/user-update/${updatedUser._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            })

            if (response.ok) {
                await fetchUsers()
                setEditingUser(null)
            } else {
                console.error('Failed to update user')
            }
        } catch (error) {
            console.error('Error updating user:', error)
        }
    }

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return
        }

        try {
            const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/admin/user-delete/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                await fetchUsers()
            } else {
                console.error('Failed to delete user')
            }
        } catch (error) {
            console.error('Error deleting user:', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
                <Button onClick={() => setIsCreatingUser(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create User
                </Button>
            </div>

            {isCreatingUser && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <Input name="username" placeholder="Username" required />
                            <Input name="email" type="email" placeholder="Email" required />
                            <Input name="password" type="password" placeholder="Password" required />
                            <Select name="isAdmin">
                                <SelectTrigger>
                                    <SelectValue placeholder="Admin Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="false">Not Admin</SelectItem>
                                    <SelectItem value="true">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select name="role">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Software Engineering Roles */}
                                    <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                                    <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                                    <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                                    <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                                    <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                                    <SelectItem value="Mobile App Developer">Mobile App Developer</SelectItem>
                                    <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                                    <SelectItem value="Machine Learning Engineer">Machine Learning Engineer</SelectItem>
                                    <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                                    <SelectItem value="Security Engineer">Security Engineer</SelectItem>
                                    <SelectItem value="Blockchain Developer">Blockchain Developer</SelectItem>
                                    <SelectItem value="AI Engineer">AI Engineer</SelectItem>

                                    {/* Digital Marketing Roles */}
                                    <SelectItem value="Digital Marketer">Digital Marketer</SelectItem>
                                    <SelectItem value="SEO Specialist">SEO Specialist</SelectItem>
                                    <SelectItem value="Content Marketer">Content Marketer</SelectItem>
                                    <SelectItem value="Social Media Manager">Social Media Manager</SelectItem>
                                    <SelectItem value="PPC Specialist">PPC Specialist</SelectItem>
                                    <SelectItem value="Email Marketing Specialist">Email Marketing Specialist</SelectItem>
                                    <SelectItem value="Growth Marketer">Growth Marketer</SelectItem>
                                    <SelectItem value="Affiliate Marketer">Affiliate Marketer</SelectItem>
                                    <SelectItem value="Marketing Analyst">Marketing Analyst</SelectItem>

                                    {/* Design Roles */}
                                    <SelectItem value="Designer">Designer</SelectItem>
                                    <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                                    <SelectItem value="Graphic Designer">Graphic Designer</SelectItem>
                                    <SelectItem value="Product Designer">Product Designer</SelectItem>
                                    <SelectItem value="Interaction Designer">Interaction Designer</SelectItem>
                                    <SelectItem value="Web Designer">Web Designer</SelectItem>
                                    <SelectItem value="Creative Director">Creative Director</SelectItem>
                                    <SelectItem value="Motion Graphics Designer">Motion Graphics Designer</SelectItem>
                                    <SelectItem value="Illustrator">Illustrator</SelectItem>

                                    {/* Product & Project Management Roles */}
                                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                                    <SelectItem value="Scrum Master">Scrum Master</SelectItem>
                                    <SelectItem value="Business Analyst">Business Analyst</SelectItem>

                                    {/* Other Related Roles */}
                                    <SelectItem value="Technical Writer">Technical Writer</SelectItem>
                                    <SelectItem value="IT Support Specialist">IT Support Specialist</SelectItem>
                                    <SelectItem value="System Administrator">System Administrator</SelectItem>
                                    <SelectItem value="Database Administrator">Database Administrator</SelectItem>
                                    <SelectItem value="Cloud Engineer">Cloud Engineer</SelectItem>
                                    <SelectItem value="Sales Engineer">Sales Engineer</SelectItem>
                                    <SelectItem value="Content Strategist">Content Strategist</SelectItem>
                                    <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                                    <SelectItem value="Customer Success Manager">Customer Success Manager</SelectItem>

                                    {/* Networking */}
                                    <SelectItem value="Network Engineer">Network Engineer</SelectItem>
                                    <SelectItem value="Network Architect">Network Architect</SelectItem>
                                    <SelectItem value="Security Engineer">Security Engineer</SelectItem>
                                    <SelectItem value="Cloud Network Engineer">Cloud Network Engineer</SelectItem>

                                    {/* IaaS Roles */}
                                    <SelectItem value="Cloud Engineer (IaaS)">Cloud Engineer (IaaS)</SelectItem>
                                    <SelectItem value="Infrastructure Architect">Infrastructure Architect</SelectItem>
                                    <SelectItem value="Infrastructure Operations Specialist">Infrastructure Operations Specialist</SelectItem>

                                    {/* PaaS Roles */}
                                    <SelectItem value="Platform Engineer (PaaS)">Platform Engineer (PaaS)</SelectItem>
                                    <SelectItem value="Platform Architect">Platform Architect</SelectItem>

                                    {/* SaaS Roles */}
                                    <SelectItem value="SaaS Product Manager">SaaS Product Manager</SelectItem>
                                    <SelectItem value="SaaS Implementation Specialist">SaaS Implementation Specialist</SelectItem>
                                    <SelectItem value="SaaS Operations Engineer">SaaS Operations Engineer</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button type="submit">Create User</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {editingUser && (
                <Card>
                    <CardHeader>
                        <CardTitle>Edit User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <Input name="username" placeholder="Username" defaultValue={editingUser.username} required />
                            <Input name="email" type="email" placeholder="Email" defaultValue={editingUser.email} required />
                            <Select name="isAdmin" defaultValue={editingUser.isAdmin ? 'true' : 'false'}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Admin Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="false">Not Admin</SelectItem>
                                    <SelectItem value="true">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select name="role" defaultValue={editingUser.role}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                                    <SelectItem value="Digital Marketer">Digital Marketer</SelectItem>
                                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                                    <SelectItem value="Designer">Designer</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit">Update User</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Admin</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" onClick={() => setEditingUser(user)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}