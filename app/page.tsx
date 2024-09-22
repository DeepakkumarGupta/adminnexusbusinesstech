'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Users, LayoutDashboard, Settings, Menu, LogOut } from 'lucide-react'

type User = {
  _id: string
  username: string
  email: string
  isAdmin: boolean
  role: string
}

type AdminUser = {
  _id: string
  username: string
  email: string
  isAdmin: boolean
  role: string
}

export default function AdminPanel() {
  const [activeView, setActiveView] = useState('dashboard')
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [createUserError, setCreateUserError] = useState<string | null>(null)
  const [isDeletingUser, setIsDeletingUser] = useState(false)
  const [deleteUserError, setDeleteUserError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser')
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser))
    } else {
      router.push('/login')
    }
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (adminUser && activeView === 'users') {
      fetchUsers()
    }
  }, [adminUser, activeView])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/users', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        console.error('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    router.push('/login')
  }

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsCreatingUser(true)
    setCreateUserError(null)

    const formData = new FormData(event.currentTarget)
    const newUser = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      isAdmin: formData.get('isAdmin') === 'true',
      role: formData.get('role') as string,
    }

    try {
      const response = await fetch('http://localhost:5000/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
        credentials: 'include',
      })

      if (response.ok) {
        await fetchUsers()
        setActiveView('users')
      } else {
        const errorData = await response.json()
        setCreateUserError(errorData.message || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      setCreateUserError('An error occurred while creating the user')
    } finally {
      setIsCreatingUser(false)
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
      const response = await fetch(`http://localhost:5000/admin/user-update/${updatedUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
        credentials: 'include',
      })

      if (response.ok) {
        await fetchUsers()
        setActiveView('users')
        setEditingUser(null)
      } else {
        const errorData = await response.json()
        console.error('Failed to update user:', errorData.message)
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    setIsDeletingUser(true)
    setDeleteUserError(null)

    try {
      const response = await fetch(`http://localhost:5000/admin/user-delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        await fetchUsers()
      } else {
        const errorData = await response.json()
        setDeleteUserError(errorData.message || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      setDeleteUserError('An error occurred while deleting the user')
    } finally {
      setIsDeletingUser(false)
    }
  }

  const Sidebar = () => (
    <div className="w-64 bg-card shadow-md h-full">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-card-foreground">Admin Panel</h1>
        {adminUser && (
          <p className="text-sm text-muted-foreground mt-2">{adminUser.email}</p>
        )}
      </div>
      <nav className="mt-4">
        <button
          className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground flex items-center"
          onClick={() => setActiveView('dashboard')}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground flex items-center"
          onClick={() => setActiveView('users')}
        >
          <Users className="mr-2 h-4 w-4" />
          Users
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground flex items-center"
          onClick={() => setActiveView('settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground flex items-center"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </button>
      </nav>
    </div>
  )

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-background">Loading...</div>
  }

  if (!adminUser) {
    return null // This will prevent any flash of content before redirecting to login
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <button
          className="fixed top-4 left-4 z-40 p-2 bg-background border rounded-md"
          onClick={() => setActiveView('sidebar')}
        >
          <Menu className="h-6 w-6" />
        </button>
        {activeView === 'sidebar' && (
          <div className="fixed inset-0 bg-background/80 z-50">
            <div className="fixed inset-y-0 left-0 w-64 bg-card shadow-lg">
              <Sidebar />
              <button
                className="absolute top-2 right-2 p-2"
                onClick={() => setActiveView('dashboard')}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {adminUser && (
          <div className="mb-8 bg-card p-4 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-card-foreground">
              Welcome, {adminUser.username}!
            </h2>
            <p className="text-muted-foreground mt-2">
              Let's get going! You're logged in as {adminUser.email}.
            </p>
          </div>
        )}

        {activeView === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-card p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">Total Users</h3>
                <p className="text-3xl font-bold text-primary">{users.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="text-2xl font-bold text-foreground">Users</h2>
              <button
                onClick={() => setActiveView('create-user')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-card rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-muted-foreground">Username</th>
                    <th className="px-4 py-2 text-left text-muted-foreground">Email</th>
                    <th className="px-4 py-2 text-left text-muted-foreground">Admin</th>
                    <th className="px-4 py-2 text-left text-muted-foreground">Role</th>
                    <th className="px-4 py-2 text-left text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-t border-border">
                      <td className="px-4 py-2 text-card-foreground">{user.username}</td>
                      <td className="px-4 py-2 text-card-foreground">{user.email}</td>
                      <td className="px-4 py-2 text-card-foreground">{user.isAdmin ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2 text-card-foreground">{user.role}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setEditingUser(user)
                              setActiveView('edit-user')
                            }}
                            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-2 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
                            disabled={isDeletingUser}
                          >
                            {isDeletingUser ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {deleteUserError && (
              <p className="mt-4 text-sm text-destructive">{deleteUserError}</p>
            )}
          </div>
        )}

        {activeView === 'create-user' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Create User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                name="username"
                placeholder="Username"
                required
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              />
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
              <select
                name="isAdmin"
                required
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="false">Not Admin</option>
                <option value="true">Admin</option>
              </select>
              <select
                name="role"
                required
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="">Select a role</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Digital Marketer">Digital Marketer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Designer">Designer</option>
              </select>
              <button
                type="submit"
                className={`px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 ${isCreatingUser ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={isCreatingUser}
              >
                {isCreatingUser ? 'Creating User...'

                  : 'Create User'}
              </button>
            </form>
            {createUserError && (
              <p className="mt-4 text-sm text-destructive">{createUserError}</p>
            )}
          </div>
        )}

        {activeView === 'edit-user' && editingUser && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <input
                name="username"
                placeholder="Username"
                defaultValue={editingUser.username}
                required
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                defaultValue={editingUser.email}
                required
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              />
              <select
                name="isAdmin"
                defaultValue={editingUser.isAdmin ? 'true' : 'false'}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="false">Not Admin</option>
                <option value="true">Admin</option>
              </select>
              <select
                name="role"
                defaultValue={editingUser.role}
                required
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="">Select a role</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Digital Marketer">Digital Marketer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Designer">Designer</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Update User
              </button>
            </form>
          </div>
        )}

        {activeView === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Settings</h2>
            <p className="text-muted-foreground">Admin panel settings will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  )
}