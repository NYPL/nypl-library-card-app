import type { CreateReportResult } from "../services/identityVerification";

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 8;

/**
 * Polls the GET endpoint for a report until status is no longer "pending",
 * or until MAX_ATTEMPTS is reached.
 */
export async function pollReport(
  endpoint: string,
  reportId: string
): Promise<CreateReportResult | null> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const res = await fetch(`/library-card${endpoint}?reportId=${reportId}`);
    if (!res.ok) return null;

    const data: CreateReportResult = await res.json();
    if (data.status !== "pending") {
      return data;
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  return null;
}
