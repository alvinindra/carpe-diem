import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { SignupForm } from "@/components/signup-form"
import { useAuth } from "@/hooks/useAuth"

export const Route = createFileRoute('/captain/signup')({
  component: SignupPage,
})

function SignupPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: '/captain/dashboard' })
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[#F5F1E8] dark:bg-[#2C2416]">
        <div className="text-neutral-800 dark:text-neutral-200 text-xl">Loading...</div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[#F5F1E8] dark:bg-[#2C2416]">
      <div className="w-full max-w-sm">
        <SignupForm />
        <div className="mt-4 text-center text-sm text-neutral-700 dark:text-neutral-300">
          Already have an account?{" "}
          <Link to="/captain/login" className="text-amber-700 dark:text-amber-500 hover:underline font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

