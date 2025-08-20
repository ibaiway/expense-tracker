import { NextFunction, Request, Response } from "express"
import z from "zod"

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof z.ZodError) {
    const formattedErrors = z.flattenError(err)
    console.warn(formattedErrors)
    res.status(400).json({
      error: "Validation failed",
      details: formattedErrors,
    })
    return
  }
  console.error(err)
  res.status(500).json({
    error: "Unexpected error",
  })
  return
}
