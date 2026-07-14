/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from "next";
import {
  findIncompleteInquiry,
  createInquiry,
  createSessionToken,
} from "../../../src/services/identityVerification";
import logger from "../../../src/logger";

interface SuccessResponse {
  inquiry_id: string;
  session_token: string | null;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { firstName, lastName, birthdate, email } = req.body as {
      firstName: string;
      lastName: string;
      birthdate?: string;
      email: string;
    };

    const userId = email;
    const userData = {
      "name-first": firstName,
      "name-last": lastName,
      ...(birthdate && { birthdate }),
    };

    const existing = await findIncompleteInquiry(userId);

    if (existing) {
      const {
        id: inquiryId,
        attributes: { status },
      } = existing;
      logger.info(`Found existing inquiry ${inquiryId}`, { status });

      if (status === "pending") {
        const sessionToken = await createSessionToken(inquiryId);
        return res
          .status(200)
          .json({ inquiry_id: inquiryId, session_token: sessionToken });
      }

      return res
        .status(200)
        .json({ inquiry_id: inquiryId, session_token: null });
    }

    const inquiryId = await createInquiry(userId, userData);
    logger.info("New inquiry created", { inquiryId });
    return res.status(200).json({ inquiry_id: inquiryId, session_token: null });
  } catch (error: any) {
    logger.error("API Route Error", { message: error?.message });
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error?.message });
  }
}
