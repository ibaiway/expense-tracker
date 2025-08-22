import { Card, CardHeader, CardTitle } from "@/components/ui/card"

import { useMutation, useQuery } from "@tanstack/react-query"
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

export default function ProjectsPage() {
  const mutation = useMutation({
    mutationFn: (newProject: NewProject) => {
      return fetch("http://localhost:3001/api/projects", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      })
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
      <button
        onClick={() => {
          mutation.mutate({
            name: "New Project",
            baseCurrency: "USD",
          })
        }}
      >
        Create Project
      </button>
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
