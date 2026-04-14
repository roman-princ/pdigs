const OUTAGE_MESSAGE_PATTERNS = [
  "failed to fetch",
  "fetch failed",
  "network request failed",
  "networkerror",
  "load failed",
  "service unavailable",
  "bad gateway",
  "gateway timeout",
  "timed out",
  "status 500",
  "status 502",
  "status 503",
  "status 504",
];

const OUTAGE_STATUS_CODES = new Set([500, 502, 503, 504]);

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "";
}

function getErrorStatus(error: unknown): number | null {
  if (typeof error !== "object" || error === null) return null;

  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }

  if ("statusCode" in error && typeof error.statusCode === "number") {
    return error.statusCode;
  }

  return null;
}

export function isSupabaseOutageError(error: unknown): boolean {
  const status = getErrorStatus(error);
  if (status !== null && OUTAGE_STATUS_CODES.has(status)) {
    return true;
  }

  const message = getErrorMessage(error).toLowerCase();
  return OUTAGE_MESSAGE_PATTERNS.some((pattern) => message.includes(pattern));
}

export function redirectToServerErrorPage() {
  if (typeof window === "undefined") return;

  const baseUrl = import.meta.env.BASE_URL || "/";
  const serverErrorUrl = new URL(
    "500",
    new URL(baseUrl, window.location.origin),
  );

  if (window.location.pathname === serverErrorUrl.pathname) {
    return;
  }

  window.location.assign(serverErrorUrl.pathname);
}
