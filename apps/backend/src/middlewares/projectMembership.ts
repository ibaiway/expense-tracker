import { NextFunction, Response, Request } from "express"
import { db } from "../db/database"
import { AuthenticatedRequest } from "./auth"

export const requireProjectMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { projectId } = req.params
  const { userId } = (req as AuthenticatedRequest).session

  const hasMembership = await checkProjectMembership(userId, projectId)

  if (!hasMembership) {
    return res.status(403).json({ error: "Forbidden" })
  }

  next()
}

const checkProjectMembership = async (
  userId: string,
  projectId: string
): Promise<boolean> => {
  const membership = await db
    .selectFrom("project_members")
    .select("projectId")
    .where("projectId", "=", projectId)
    .where("userId", "=", userId)
    .executeTakeFirst()

  /*
    THIS would be better, kysely doesn't support EXISTS yet 

    SELECT EXISTS (
    SELECT 1
    FROM project_members
    WHERE project_id = $1 AND user_id = $2
    );
*/
  return !!membership
}
