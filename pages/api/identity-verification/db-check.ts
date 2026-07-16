/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from "next";
import {
  createAddressReport,
  getReportStatus,
  type CreateReportResult,
} from "../../../src/services/identityVerification";
import logger from "../../../src/logger";

interface ErrorResponse {
  error: string;
  details?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateReportResult | ErrorResponse>
) {
  if (req.method === "POST") {
    const body = req.body as Record<string, string>;
    const street1 = body["home-line1"];
    const city = body["home-city"];
    const state = body["home-state"];
    const zip = body["home-zip"];

    if (!street1 || !city || !state || !zip) {
      return res.status(400).json({
        error: "home-line1, home-city, home-state, home-zip are required",
      });
    }

    try {
      const result = await createAddressReport({
        street1,
        street2: body["home-line2"],
        city,
        state,
        zip,
      });
      logger.info("Address report created", {
        report_id: result.report_id,
        status: result.status,
      });
      return res.status(201).json(result);
    } catch (error: any) {
      logger.error("Failed to create address report", {
        message: error?.message,
      });
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error?.message });
    }
  }

  if (req.method === "GET") {
    const { reportId } = req.query;
    if (!reportId || typeof reportId !== "string") {
      return res.status(400).json({ error: "reportId is required" });
    }
    try {
      const result = await getReportStatus(reportId);
      return res.status(200).json(result);
    } catch (error: any) {
      logger.error("Failed to get address report status", {
        message: error?.message,
      });
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error?.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
