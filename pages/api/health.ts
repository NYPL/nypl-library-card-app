import { NextApiRequest, NextApiResponse } from "next";

/**
 * health -- Endpoint to check the health of the application, used by New Relic Synthetics monitoring.
 * @param req - Next request object
 * @param res - Next response object
 */
async function health(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const uptime = process.uptime();

    res.status(200).json({
      status: "ok",
      uptime: uptime,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    res.status(500).json({
      status: "error",
      message: "Health check failed",
    });
  }
}

export default health;
