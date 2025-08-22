import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "Project 1",
    },
    {
      id: 2,
      name: "Project 2",
    },
    {
      id: 3,
      name: "Project 3",
    },
    {
      id: 4,
      name: "Project 4",
    },
    {
      id: 5,
      name: "Project 5",
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {projects.map((project) => (
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
