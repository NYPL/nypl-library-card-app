/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from "next";
import redis, { inquiryKey } from "../../../src/lib/redis";

const PERSONA_API_KEY =
  process.env.PERSONA_API_KEY ||
  "PERSONA_SANDBOX_API_KEY_REDACTED";
const PERSONA_API_URL = "https://api.withpersona.com/api/v1";
const PERSONA_VERSION = "2025-10-27";

export type InquiryStatus =
  | "created"
  | "pending"
  | "completed"
  | "approved"
  | "declined"
  | "expired"
  | "failed";

interface SuccessResponse {
  inquiry_id: string;
  status: InquiryStatus;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Inquiry ID is required" });
  }

  try {
    const cached = await redis.get<InquiryStatus>(inquiryKey(id));
    if (cached) {
      console.log(`Cache hit for ${id}: ${cached}`);
      return res.status(200).json({ inquiry_id: id, status: cached });
    }

    console.log(`Cache miss for ${id}, polling Persona`);
    const response = await fetch(`${PERSONA_API_URL}/inquiries/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PERSONA_API_KEY}`,
        "Content-Type": "application/json",
        "Persona-Version": PERSONA_VERSION,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to fetch inquiry (${response.status}): ${errorBody}`
      );
    }

    const json = await response.json();
    const status: InquiryStatus = json.data.attributes.status;

    return res.status(200).json({ inquiry_id: id, status });
  } catch (error: any) {
    console.error("Error fetching inquiry status:", error?.message || error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error?.message,
    });
  }
}
