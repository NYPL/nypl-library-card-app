import { NextApiRequest, NextApiResponse } from "next";
import isEmpty from "lodash/isEmpty";
import { createInstance } from "i18next";
import path from "path";
import fs from "fs";
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

const getT = async (lang = "en") => {
  const localePath = path.join(
    process.cwd(),
    "public/locales",
    lang,
    "common.json"
  );
  const safeLang = fs.existsSync(localePath) ? lang : "en";
  const translations = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "public/locales", safeLang, "common.json"),
      "utf-8"
    )
  );
  const i18n = createInstance();
  await i18n.init({
    lng: safeLang,
    fallbackLng: "en",
    defaultNS: "common",
    resources: {
      [safeLang]: { common: translations },
    },
  });
  return i18n.t.bind(i18n);
};

const getTranslatedErrors = (errors: object, t: (key: string) => string) => {
  return Object.fromEntries(
    Object.entries(errors).map(([key, value]) => [
      key,
      typeof value === "object"
        ? getTranslatedErrors(value, t)
        : t(value as string),
    ])
  );
};

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
  console.log("serverSubmit - req.body.formValues: ", req.body.formValues);
  const existingValues = !req.body.formValues
    ? {}
    : JSON.parse(req.body.formValues);
  const currentPage = req.body.page;
  // We don't want these values when we do validation.
  delete newSubmittedValues.page;
  delete newSubmittedValues.formValues;
  delete existingValues.newCard;

  const lang = req.query.lang;
  const finalLang =
    typeof lang === "string"
      ? lang
      : Array.isArray(lang) && lang.length > 0
        ? lang[0]
        : "en";

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
      addresses = constructAddresses(newSubmittedValues);
      errors = validateAddressFormData({}, addresses);
      if (isEmpty(errors)) {
        if (existingValues.location !== "nyc") {
          page = "alternate-address";
        } else {
          page = "account";
        }
      }
      break;
    case "alternate-address":
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
        res.status(results.status).json(results);
        page = "congrats";
      } catch (error) {
        console.log("Error in serverSubmit", error);
        errors = error;
      }
      break;
    default:
      page = "new";
      break;
  }

  if (!isEmpty(errors)) {
    const t = await getT(finalLang);
    errors = getTranslatedErrors(errors, t);
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
