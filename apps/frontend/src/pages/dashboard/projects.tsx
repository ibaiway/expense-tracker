import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Navigate } from "react-router"

type Project = {
  role: "member" | "admin"
  id: string
  name: string
  baseCurrency: string
}

type NewProject = {
  name: string
  baseCurrency: string
}

const defaultNewProject: NewProject = {
  name: "My expenses",
  baseCurrency: "EUR",
}

export default function ProjectsPage() {
  const [newProject, setNewProject] = useState<NewProject>({
    name: defaultNewProject.name,
    baseCurrency: defaultNewProject.baseCurrency,
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (newProject: NewProject) => {
      const response = await fetch("http://localhost:3001/api/projects", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error || `Failed to create project: ${response.statusText}`
        )
      }

      return response.json()
    },
    onSuccess: () => {
      // Reset the form
      setNewProject(defaultNewProject)
      // Refresh the projects list
      queryClient.invalidateQueries({ queryKey: ["projects"] })

      // Close the dialog
      setIsDialogOpen(false)
    },
    onError: (error) => {
      console.error("Failed to create project:", error)
      // You could add a toast notification here
    },
  })

  const { isPending, data, error } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/api/projects", {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error(response.statusText, { cause: response.status })
      }
      return response.json()
    },
  })

  if (isPending) return <div>Loading...</div>
  if (error) {
    if (error.cause === 401) {
      return <Navigate to="/signin" />
    }
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="flex flex-1 flex-col">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create new project</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              mutation.mutate({
                name: newProject.name,
                baseCurrency: newProject.baseCurrency,
              })
            }}
          >
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Create a new project to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="baseCurrency">Base Currency</Label>
                <Input
                  id="baseCurrency"
                  name="baseCurrency"
                  value={newProject.baseCurrency}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      baseCurrency: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={mutation.isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {data.map((project) => (
              <Card className="@container/card" key={project.id}>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {project.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
