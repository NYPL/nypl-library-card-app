/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from "next";

import { withApiHandler } from "../../../src/errors/server";
import { ApiError, ErrorCodes } from "../../../src/errors";
import { cors, runMiddleware } from "../../../src/utils/api";
import { getBearerToken } from "../../../src/services/identityVerification/auth";

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

    const token = await getBearerToken();

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
      access_token: token.accessToken,
      token_type: token.tokenType,
      expires_in: token.expiresIn,
      scope: token.scope,
    });
  }
);
