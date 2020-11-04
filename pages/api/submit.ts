import { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware, cors } from "../../src/utils/api";

/**
 * serverSubmit
 * @param req - Next request object
 * @param res - Next response object
 */
async function serverSubmit(req: NextApiRequest, res: NextApiResponse) {
  // Run the request through the middleware.
  await runMiddleware(req, res, cors);
  let newSubmittedValues = { ...req.body };
  // All already submitted values are stored here so we dont run validations
  // on those values again.
  const existingValues = JSON.parse(req.body.formValues);
  const currentPage = req.body.page;
  // We don't want these values when we do validation.
  delete newSubmittedValues.page;
  delete newSubmittedValues.formValues;
  delete existingValues.newCard;

  let page;
  let queryValues = "";

  // TODO: run values through validation. After the new form field values
  // are validated, then merge all together:
  newSubmittedValues = { ...newSubmittedValues, ...existingValues };
  for (const [key, value] of Object.entries(newSubmittedValues)) {
    queryValues += `&${key}=${value}`;
  }
  // A switch statement so later on we can do form value validation on specific
  // fields based on the current page.
  switch (currentPage) {
    case "personal":
      page = "location";
      break;
    case "location":
      page = "workAddress";
      break;
    case "workAddress":
      page = "address-verification";
      // TODO: Do address API call here.
      break;
    case "addressVerification":
      page = "account";
      break;
    case "account":
      page = "review";
      break;
    case "review":
      page = "congrats";
      // TODO: Call the `createPatron` function with all the form values here.
      break;
    default:
      page = "new";
      break;
  }

  return res.redirect(`/library-card/${page}?newCard=true${queryValues}`);
}

export default serverSubmit;
