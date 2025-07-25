import { Request, Response, NextFunction } from "express"
import { auth } from "../utils/auth"
import { fromNodeHeaders } from "better-auth/node"
import { Session } from "better-auth/*"

export interface AuthenticatedRequest extends Request {
  session: Session
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  /** 
   * TODO: Add email verification
  if (!session.user.emailVerified) {
    return res.status(401).json({ error: "Email not verified" })
  }
    */

  ;(req as AuthenticatedRequest).session = session.session
  next()
}
