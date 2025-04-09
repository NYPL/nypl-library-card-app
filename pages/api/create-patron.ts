import { NextApiRequest, NextApiResponse } from "next";
import {
  initializeAppAuth,
  createPatron,
  runMiddleware,
  cors,
} from "../../src/utils/api";

/**
 * patron
 * @param req - Next request object
 * @param res - Next response object
 */
async function patron(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.json(405);
  }
  // Run the request through the middleware.
  await runMiddleware(req, res, cors);
  // Initialize the authentication for the app.
  // TODO: set a better path for using an CSRF token.
  await initializeAppAuth(req, res);
  // Now, we can call the NYPL Platform API to validate the patron's
  // address and username, and create a new ILS patron account.
  await createPatron(req, res);
}

export default patron;
