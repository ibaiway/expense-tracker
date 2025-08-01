import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { IconInfoSquare } from "@tabler/icons-react"
import { Link, useNavigate } from "react-router"
import { useState } from "react"
import { authClient } from "@/auth/auth-client"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const session = authClient.useSession()

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Signup form values:", formData)
    authClient.signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      },
      {
        onSuccess: () => {
          console.log("Signup successful")
          navigate("/dashboard")
          session.refetch()
        },
        onError: (error) => {
          console.error("Signup error:", error)
        },
      }
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Tooltip>
                    <TooltipTrigger className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                      <IconInfoSquare />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Password must be at least 8 characters long and contain
                        at least one uppercase letter, one lowercase letter, and
                        one number.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Sign up
                </Button>
                <Button variant="outline" className="w-full">
                  Sign up with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/signin" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
