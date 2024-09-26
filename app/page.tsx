import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Lock, AlertTriangle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <Card className="w-full max-w-md bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-black dark:text-white flex items-center justify-center">
            <Shield className="mr-2 h-8 w-8" />
            Admin Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            This area is restricted to authorized personnel only.
            Please log in to access the admin panel.
          </p>
          <div className="flex justify-center">
            <Link href="/login" passHref>
              <Button size="lg" className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black">
                <Lock className="mr-2 h-5 w-5" />
                Admin Login
              </Button>
            </Link>
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <AlertTriangle className="mr-1 h-4 w-4" />
            <span>Unauthorized access attempts are logged</span>
          </div>
        </CardContent>
      </Card>

      <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-400 dark:text-gray-600">
        <p>&copy; 2024 Nexus Business Tech | All Rights Reserved</p>
      </div>
    </div>
  )
}