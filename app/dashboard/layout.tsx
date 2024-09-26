"use client"
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    FileText,
    Settings,
    Menu,
    X,
    LogOut,
    Users,
} from 'lucide-react'
import { useState } from 'react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    const { user, logout } = useAuth()

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Members', href: '/dashboard/members', icon: Users },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar for desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <span className="text-xl font-semibold">Admin Access</span>
                    </div>
                    <div className="mt-5 flex-1 flex flex-col">
                        <nav className="flex-1 px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${pathname === item.href
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                >
                                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.username}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                            </div>
                            <Button
                                onClick={logout}
                                variant="ghost"
                                size="icon"
                                className="ml-auto"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar */}
            <div className={`${sidebarOpen ? 'block' : 'hidden'} md:hidden fixed inset-0 z-40 flex`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-gray-800">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <Button
                            onClick={() => setSidebarOpen(false)}
                            variant="ghost"
                            size="icon"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <span className="sr-only">Close sidebar</span>
                            <X className="h-6 w-6 text-white" aria-hidden="true" />
                        </Button>
                    </div>
                    <div className="flex-shrink-0 flex items-center px-4">
                        <span className="text-xl font-semibold">Admin Access</span>
                    </div>
                    <div className="mt-5 flex-1 h-0 overflow-y-auto">
                        <nav className="px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${pathname === item.href
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="mr-4 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
                    <Button
                        onClick={() => setSidebarOpen(true)}
                        variant="ghost"
                        size="icon"
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </Button>
                </div>
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <AdminProtectedRoute>{children}</AdminProtectedRoute>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}