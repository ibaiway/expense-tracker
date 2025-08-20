import { Router, Response, Request } from "express"
import { AuthenticatedRequest, requireAuth } from "./middlewares/auth"
import {
  createExpense,
  createProject,
  getExpenses,
  getProjects,
  updateExpense,
} from "./controllers/project-controller"
import { requireProjectMembership } from "./middlewares/projectMembership"

const router = Router()

router.get("/projects", requireAuth, async (req, res) => {
  await getProjects(req as AuthenticatedRequest, res)
})

router.post("/projects", requireAuth, async (req: Request, res: Response) => {
  await createProject(req as AuthenticatedRequest, res)
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

router.put(
  "/projects/:projectId/expenses/:expenseId",
  requireAuth,
  requireProjectMembership,
  async (req, res: Response) => {
    await updateExpense(req as AuthenticatedRequest, res)
  }
)

export default router
