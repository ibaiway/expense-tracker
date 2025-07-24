import { Router, Response, Request } from "express"
import { db } from "./db/database"
import { AuthenticatedRequest, requireAuth } from "./middlewares/auth"
import { createProject } from "./controllers/project-controller"

const router = Router()

router.get("/projects", (req, res) => {
  res.send(db.selectFrom("project").selectAll().execute())
})

router.post("/projects", requireAuth, async (req: Request, res: Response) => {
  const project = await createProject(req as AuthenticatedRequest, res)
  res.send(project)
})

export default router
