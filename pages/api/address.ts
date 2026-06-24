import { NextApiRequest, NextApiResponse } from "next";
import {
  initializeAppAuth,
  validateAddress,
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
    logger.info("Address validation started", {
      requestId: req.requestId,
      isWorkAddress: req.body?.isWorkAddress,
      hasAddress: !!req.body?.address,
      hasCity: !!req.body?.address?.city,
      hasState: !!req.body?.address?.state,
      hasZip: !!req.body?.address?.zip,
    });
    await initializeAppAuth(req);
    const { status, data } = await validateAddress(req);
    res.status(status).json(data);
  }
);
