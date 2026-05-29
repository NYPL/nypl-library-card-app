import { NextApiRequest, NextApiResponse } from "next";
import {
  initializeAppAuth,
  validateAddress,
  runMiddleware,
  cors,
} from "../../src/utils/api";
import { withApiHandler } from "../../src/errors/server";
import { ApiError, ErrorCodes } from "../../src/errors";

/**
 * address
 * @param req - Next request object
 * @param res - Next response object
 */
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
    await initializeAppAuth(req);
    const { status, data } = await validateAddress(req);
    res.status(status).json(data);
  }
);
