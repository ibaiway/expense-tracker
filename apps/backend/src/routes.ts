import { Router, Response, Request } from "express"
import { db } from "./db/database"
import { AuthenticatedRequest, requireAuth } from "./middlewares/auth"
import {
  createExpense,
  createProject,
  getExpenses,
  getProjects,
} from "./controllers/project-controller"
import { requireProjectMembership } from "./middlewares/projectMembership"

const router = Router()

router.get("/projects", requireAuth, async (req, res) => {
  const projects = await getProjects(req as AuthenticatedRequest, res)
  res.send(projects)
})

router.post("/projects", requireAuth, async (req: Request, res: Response) => {
  const project = await createProject(req as AuthenticatedRequest, res)
  res.send(project)
})

router.get(
  "/projects/:projectId/expenses",
  requireAuth,
  requireProjectMembership,
  async (req: Request, res: Response) => {
    const expenses = await getExpenses(req as AuthenticatedRequest, res)
    res.send(expenses)
  }
)

router.post(
  "/projects/:projectId/expenses",
  requireAuth,
  requireProjectMembership,
  async (req, res: Response) => {
    const expenses = await createExpense(req as AuthenticatedRequest, res)
    res.send(expenses)
  }
)

export default router
