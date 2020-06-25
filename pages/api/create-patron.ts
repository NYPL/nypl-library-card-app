import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next"
import { initializeAppAuth, createPatron } from "../../src/server/routes/api";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD", "POST"],
});

// Helper method to wait for a middleware to execute before continuing and
// to throw an error when an error happens in a middleware.
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

/**
 * patron
 * @param req - Next request object
 * @param res - Next response object
 */
async function patron(req: NextApiRequest, res: NextApiResponse) {
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
