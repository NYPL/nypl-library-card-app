// import { NextApiRequest, NextApiResponse } from "next";
// import { runMiddleware, cors, getCsrfToken } from "../../src/utils/api";

// /**
//  * address
//  * @param req - Next request object
//  * @param res - Next response object
//  */
// async function csrf(req: NextApiRequest, res: NextApiResponse) {
//   // Run the request through the middleware.
//   await runMiddleware(req, res, cors);

//   const { csrfToken } = getCsrfToken(req, res);
//   // console.log("api endpoint end", csrfToken);
//   return res.json({ csrfToken });
// }

// export default csrf;
