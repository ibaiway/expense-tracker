import { Router, Response, Request } from "express"
import { db } from "./db/database"
import { AuthenticatedRequest, requireAuth } from "./middlewares/auth"
import {
  createExpense,
  createProject,
  getExpenses,
} from "./controllers/project-controller"

const router = Router()

router.get("/projects", (req, res) => {
  res.send(db.selectFrom("project").selectAll().execute())
})

router.post("/projects", requireAuth, async (req: Request, res: Response) => {
  const project = await createProject(req as AuthenticatedRequest, res)
  res.send(project)
})

router.get(
  "/projects/:projectId/expenses",
  requireAuth,
  async (req: Request, res: Response) => {
    const expenses = await getExpenses(req as AuthenticatedRequest, res)
    res.send(expenses)
  }
)

router.post(
  "/projects/:projectId/expenses",
  requireAuth,
  async (req: Request, res: Response) => {
    const expenses = await createExpense(req as AuthenticatedRequest, res)
    res.send(expenses)
  }
)

export default router
