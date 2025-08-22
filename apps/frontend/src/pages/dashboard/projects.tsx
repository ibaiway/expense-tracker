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
import { Link, Navigate } from "react-router"

// Types
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

// Constants
const API_BASE_URL = "http://localhost:3001/api"
const DEFAULT_NEW_PROJECT: NewProject = {
  name: "My expenses",
  baseCurrency: "EUR",
}

// Custom hooks
function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error(response.statusText, { cause: response.status })
      }
      return response.json()
    },
  })
}

function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newProject: NewProject) => {
      const response = await fetch(`${API_BASE_URL}/projects`, {
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
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: (error) => {
      console.error("Failed to create project:", error)
      // TODO: Add toast notification here
    },
  })
}

// Components
function CreateProjectDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [newProject, setNewProject] = useState<NewProject>(DEFAULT_NEW_PROJECT)
  const createProjectMutation = useCreateProject()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createProjectMutation.mutate(newProject, {
      onSuccess: () => {
        setNewProject(DEFAULT_NEW_PROJECT)
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
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
                required
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
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={createProjectMutation.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createProjectMutation.isPending}>
              {createProjectMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/dashboard/projects/${project.id}`}>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {project.name}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  )
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Main component
export default function ProjectsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { isPending, data, error } = useProjects()

  // Loading state
  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-lg">Loading projects...</div>
      </div>
    )
  }

  // Error handling
  if (error) {
    if (error.cause === 401) {
      return <Navigate to="/signin" />
    }
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-lg text-red-600">
          Error loading projects: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create new project</Button>
        </DialogTrigger>
        <CreateProjectDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </Dialog>

      {data && data.length > 0 ? (
        <ProjectGrid projects={data} />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="text-lg text-muted-foreground mb-2">
              No projects yet
            </div>
            <div className="text-sm text-muted-foreground">
              Create your first project to get started
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
