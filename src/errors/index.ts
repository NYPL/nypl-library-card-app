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
    return new ApiError(
      500,
      ErrorCodes.INTERNAL_SERVER_ERROR,
      "An unexpected error occurred. Please try again."
    );
  }
}
