import axios from "axios";
import { ApiErrorResponse, ErrorCodes } from "../errors";
import { commonAPIErrors } from "../data/apiErrorMessageTranslations";

/**
 * Checks if a value is a ApiErrorResponse instance.
 */
export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as ApiErrorResponse).success === false &&
    typeof (data as ApiErrorResponse).status === "number" &&
    typeof (data as ApiErrorResponse).type === "string" &&
    typeof (data as ApiErrorResponse).message === "string"
  );
}

/**
 * Maps the API error:
 *   - No HTTP response (network failure, timeout): PLATFORM_API_ERROR
 *   - HTTP 403: session expired?
 *   - ApiErrorResponse instance:  pass through as is
 *   - Any other shape: INTERNAL_SERVER_ERROR fallback
 */
export function normalizeAxiosError(error: unknown): ApiErrorResponse {
  const axiosLike = error as { response?: { status?: number; data?: unknown } };
  const response = axios.isAxiosError(error)
    ? error.response
    : axiosLike?.response;

  if (!response) {
    return {
      success: false,
      status: 502,
      type: ErrorCodes.PLATFORM_API_ERROR,
      message: "The service is currently unavailable. Please try again.",
    };
  }

  const { status, data } = response;

  if (status === 403) {
    return {
      success: false,
      status: 403,
      type: ErrorCodes.CSRF_INVALID,
      message: commonAPIErrors.errorValidatingToken,
    };
  }

  if (isApiErrorResponse(data)) {
    return data;
  }

  return {
    success: false,
    status: status ?? 500,
    type: ErrorCodes.INTERNAL_SERVER_ERROR,
    message:
      (typeof (data as { message?: string })?.message === "string"
        ? (data as { message: string }).message
        : null) ?? "An unexpected error occurred. Please try again.",
  };
}
