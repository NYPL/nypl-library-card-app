/**
 * Server-only error utilities — do NOT import this from client-side components.
 * Uses Winston logger (requires Node.js `fs`).
 */
import { NextApiRequest, NextApiResponse } from "next";
import logger from "../logger";
import { ApiError, ApiErrorResponse } from "./index";

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
 * Next.js API route handler wrapper.
 * - Catches ApiError throws and responds with a structured ApiErrorResponse.
 * - Coerces unknown exceptions safely (no stack traces to clients).
 * - Structured logging for all unhandled errors.
 */
export function withApiHandler(handler: ApiRouteHandler) {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
      await handler(req, res);
    } catch (error) {
      const apiError = ApiError.fromUnknown(error);

      const aggregateErrors =
        error instanceof AggregateError
          ? error.errors.map((e) =>
              e instanceof Error ? e.message : String(e)
            )
          : undefined;

      logger.error("API route error", {
        originalError: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        ...(aggregateErrors && { aggregateErrors }),
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
