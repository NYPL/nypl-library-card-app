import { NextApiRequest, NextApiResponse } from "next";
import logger from "../../src/logger";

async function health(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const uptime = process.uptime();

    res.status(200).json({
      status: "ok",
      uptime: uptime,
    });
  } catch (error) {
    logger.error("Health check failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    res.status(500).json({
      status: "error",
      message: "Health check failed",
    });
  }
}

export default health;
