import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { errorMiddleware } from "../../../src/middlewares/error-middleware"

describe("errorMiddleware", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction
  let mockConsoleWarn: ReturnType<typeof vi.spyOn>
  let mockConsoleError: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    }
    mockNext = vi.fn()

    // Set up console mocks for each test
    mockConsoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore console mocks after each test
    vi.restoreAllMocks()
  })

  describe("ZodError handling", () => {
    it("should handle ZodError with 400 status and formatted errors", () => {
      // Create a mock ZodError
      const mockZodError = new z.ZodError([
        {
          code: "invalid_type",
          expected: "string",
          input: 123,
          path: ["title"],
          message: "Invalid input: expected string, received number",
        },
      ])

      // Call the middleware
      errorMiddleware(
        mockZodError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      // Verify the response
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Validation failed",
        details: z.flattenError(mockZodError),
      })
      expect(mockConsoleWarn).toHaveBeenCalledWith(z.flattenError(mockZodError))
      expect(mockNext).not.toHaveBeenCalled()
    })

    it("should handle empty ZodError", () => {
      const mockZodError = new z.ZodError([])

      errorMiddleware(
        mockZodError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Validation failed",
        details: z.flattenError(mockZodError),
      })
    })
  })

  describe("Generic Error handling", () => {
    it("should handle generic errors with 500 status", () => {
      const genericError = new Error("Something went wrong")

      errorMiddleware(
        genericError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Unexpected error",
      })
      expect(mockConsoleError).toHaveBeenCalledWith(genericError)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it("should handle custom error types", () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message)
          this.name = "CustomError"
        }
      }

      const customError = new CustomError("Custom error message")

      errorMiddleware(
        customError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Unexpected error",
      })
      expect(mockConsoleError).toHaveBeenCalledWith(customError)
    })
  })

  describe("Edge cases", () => {
    it("should handle errors without message", () => {
      const errorWithoutMessage = new Error()

      errorMiddleware(
        errorWithoutMessage,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Unexpected error",
      })
    })

    it("should not call next function for any error type", () => {
      const zodError = new z.ZodError([])
      const genericError = new Error("Test error")

      // Test with ZodError
      errorMiddleware(
        zodError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
      expect(mockNext).not.toHaveBeenCalled()

      // Reset mocks
      vi.clearAllMocks()

      // Test with generic error
      errorMiddleware(
        genericError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})
