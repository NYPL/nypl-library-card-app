/**
 * Error response shape:
 * {
 *   success: false,
 *   status: 409,
 *   type: "username-unavailable",
 *   message: "This username is unavailable",
 *   details: { field: "username" }   // optional
 * }
 */

import { NextApiRequest, NextApiResponse } from "next";
import logger from "../logger";

export const ErrorCodes = {
  METHOD_NOT_ALLOWED: "method-not-allowed",
  // OAuth token requests
  AUTH_FAILED: "auth-failed",
  AUTH_TOKEN_MISSING: "auth-token-missing",
  CSRF_INVALID: "csrf-invalid",
  INVALID_REQUEST: "invalid-request",
  MISSING_REQUIRED_FIELDS: "missing-required-fields",
  // Username
  INVALID_USERNAME: "invalid-username",
  USERNAME_UNAVAILABLE: "username-unavailable",
  // Address
  ADDRESS_VALIDATION_FAILED: "address-validation-failed",
  // Patron / ILS
  PATRON_CREATION_FAILED: "patron-creation-failed",
  ILS_INTEGRATION_ERROR: "ils-integration-error",
  // NYPL Platform API
  PLATFORM_API_ERROR: "platform-api-error",
  PLATFORM_API_TIMEOUT: "platform-api-timeout",
  // Generic
  INTERNAL_SERVER_ERROR: "internal-server-error",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
export interface ApiErrorResponse {
  success: false;
  status: number;
  type: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly type: ErrorCode;
  public readonly details?: Record<string, unknown>;

  constructor(
    status: number,
    type: ErrorCode,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.type = type;
    this.details = details;
  }

  static fromUnknown(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    const originalMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : (JSON.stringify(error) ?? "[unknown error]");

    logger.error("Unhandled error coerced to ApiError", {
      originalMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return new ApiError(
      500,
      ErrorCodes.INTERNAL_SERVER_ERROR,
      "An unexpected error occurred. Please try again."
    );
  }
}

export function buildErrorResponse(error: ApiError): ApiErrorResponse {
  const response: ApiErrorResponse = {
    success: false,
    status: error.status,
    type: error.type,
    message: error.message,
  };

  if (error.details !== undefined) {
    response.details = error.details;
  }

  return response;
}

type ApiRouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

/**
 * Next.js API route handler wrapper
 *  - Catches ApiError throws
 *  - Wrap unknown exceptions safely without stack traces to clients
 *  - Structured logging for all unhandled errors
 */
export function withApiHandler(handler: ApiRouteHandler) {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
      await handler(req, res);
    } catch (error) {
      const apiError = ApiError.fromUnknown(error);

      logger.error("API route error", {
        type: apiError.type,
        status: apiError.status,
        message: apiError.message,
        path: req.url,
        method: req.method,
      });

      if (!res.headersSent) {
        res.status(apiError.status).json(buildErrorResponse(apiError));
      }
    }
  };
}
