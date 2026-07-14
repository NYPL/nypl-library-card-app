/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from "next";
import redis, { inquiryKey } from "../../../src/lib/redis";
import { getInquiryStatus } from "../../../src/services/identityVerification";
import logger from "../../../src/logger";

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
  attributes: Record<string, any>;
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
    const cached = await redis.get<{
      status: InquiryStatus;
      attributes: Record<string, any>;
    }>(inquiryKey(id));
    if (cached) {
      logger.info("inquiry status: cache hit", { id, status: cached.status });
      return res.status(200).json({
        inquiry_id: id,
        status: cached.status,
        attributes: cached.attributes ?? {},
      });
    }

    logger.info("inquiry status: polling Persona", { id });
    const { status, attributes } = await getInquiryStatus(id);
    return res
      .status(200)
      .json({ inquiry_id: id, status: status as InquiryStatus, attributes });
  } catch (error: any) {
    logger.error("Error fetching inquiry status", { message: error?.message });
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error?.message });
  }
}
