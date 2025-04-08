import { NextApiRequest, NextApiResponse } from "next";
import {
  initializeAppAuth,
  validateUsername,
  runMiddleware,
  cors,
} from "../../src/utils/api";

/**
 * username
 * @param req - Next request object
 * @param res - Next response object
 */
async function username(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.json(405);
  }
  // Run the request through the middleware.
  await runMiddleware(req, res, cors);
  // Initialize the authentication for the app.
  // TODO: set a better path for using an CSRF token.
  await initializeAppAuth(req, res);
  // Now, we can call the NYPL Platform API to validate the patron's username.
  await validateUsername(req, res);
}

export default username;
