import { NextApiRequest, NextApiResponse } from "next";
import {
  initializeAppAuth,
  validateUsername,
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
    logger.info("Username validation started", {
      requestId: req.requestId,
      hasUsername: !!req.body?.username,
    });
    await initializeAppAuth(req);
    const { status, data } = await validateUsername(req);
    res.status(status).json(data);
  }
);
