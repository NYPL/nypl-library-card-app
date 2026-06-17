import { NextApiRequest, NextApiResponse } from "next";
import {
  initializeAppAuth,
  createPatron,
  runMiddleware,
  cors,
} from "../../src/utils/api";
import { withApiHandler } from "../../src/errors/server";
import { ApiError, ErrorCodes } from "../../src/errors";
import logger from "../../src/logger";

export default withApiHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
      throw new ApiError(
        405,
        ErrorCodes.METHOD_NOT_ALLOWED,
        "Method not allowed."
      );
    }
    await runMiddleware(req, res, cors);
    logger.info("Patron creation started", {
      requestId: req.requestId,
      hasFirstName: !!req.body?.firstName,
      hasLastName: !!req.body?.lastName,
      hasEmail: !!req.body?.email,
      hasUsername: !!req.body?.username,
      hasBirthdate: !!req.body?.birthdate,
      hasHomeAddress: !!req.body?.["home-line1"],
      policyType: req.body?.policyType,
      lang: req.body?.lang,
    });
    await initializeAppAuth(req);
    const results = await createPatron(req);
    logger.info("Patron creation succeeded", {
      requestId: req.requestId,
      status: results.status,
    });
    res.status(results.status).json(results);
  }
);
