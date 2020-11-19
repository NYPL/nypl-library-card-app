import { NextApiRequest, NextApiResponse } from "next";
import isEmpty from "lodash/isEmpty";
import {
  runMiddleware,
  cors,
  initializeAppAuth,
  callPatronAPI,
} from "../../src/utils/api";
import {
  validatePersonalFormData,
  validateAddressFormData,
  validateAccountFormData,
  constructAddresses,
} from "../../src/utils/formDataUtils";
import {
  createQueryParams,
  createNestedQueryParams,
} from "../../src/utils/utils";

/**
 * serverSubmit
 * @param req - Next request object
 * @param res - Next response object
 */
async function serverSubmit(req: NextApiRequest, res: NextApiResponse) {
  // Run the request through the middleware.
  await runMiddleware(req, res, cors);
  // Get a token to be able to call the NYPL API.
  await initializeAppAuth(req, res);

  let newSubmittedValues = { ...req.body };
  // All already submitted values are stored here so we dont run validations
  // on those values again.
  const existingValues = JSON.parse(req.body.formValues);
  const currentPage = req.body.page;
  // We don't want these values when we do validation.
  delete newSubmittedValues.page;
  delete newSubmittedValues.formValues;
  delete existingValues.newCard;

  // The default is the current page. If there are no errors, then this gets
  // updated and we can proceed to the next page.
  let page = currentPage;
  let queryValues = "";
  let addresses;
  let results;
  let errors;

  switch (currentPage) {
    case "personal":
      // Validate the form values for this specific step.
      errors = validatePersonalFormData({}, newSubmittedValues);
      if (isEmpty(errors)) {
        page = "location";
      }
      break;
    case "location":
      console.log("from location - newSubmittedValues", newSubmittedValues);
      addresses = constructAddresses(newSubmittedValues);
      errors = validateAddressFormData({}, addresses);
      console.log("from location - address", addresses);
      console.log("from location - errors", errors);
      if (isEmpty(errors)) {
        console.log("location", newSubmittedValues.location);
        if (newSubmittedValues.location !== "nyc") {
          page = "workAddress";
        } else {
          page = "account";
        }
      }
      console.log("from api location case - page", page);
      break;
    case "workAddress":
      // We need to add the existing home address values since
      // `validateAddressFormData` checks for both home and work addresses.
      addresses = constructAddresses({
        ...newSubmittedValues,
        ...existingValues,
      });
      errors = validateAddressFormData({}, addresses);
      if (isEmpty(errors)) {
        page = "account";
      }
      break;
    case "account":
      errors = validateAccountFormData({}, newSubmittedValues);
      if (isEmpty(errors)) {
        page = "review";
      }
      break;
    case "review":
      try {
        // All the data values are in the `existingValues` variable since
        // no new data is submitted on the "review" page. When JS is not on,
        // checkbox values are submitted as "on" and "off". We need to convert
        // the values into booleans for the API to understand.
        for (const [key, value] of Object.entries(existingValues)) {
          if (value === "on") {
            existingValues[key] = true;
          } else if (value === "off") {
            existingValues[key] = false;
          }
        }
        // If the API call was successful and a patron account was created,
        // go to the congrats page and display the results.
        results = await callPatronAPI(existingValues);
        page = "congrats";
      } catch (error) {
        errors = error;
      }
      break;
    default:
      page = "new";
      break;
  }

  newSubmittedValues = { ...existingValues, ...newSubmittedValues };
  queryValues =
    createQueryParams(newSubmittedValues) +
    createNestedQueryParams(errors, "errors") +
    createNestedQueryParams(results, "results");

  return res.redirect(
    `/library-card/${page}?${encodeURI(`newCard=true${queryValues}`)}`
  );
}

export default serverSubmit;
