import { PageTitles } from "../interfaces";
import isEmpty from "lodash/isEmpty";

/**
 * getPageTitles
 * Returns the page titles and updates the titles if the user is not in "nyc".
 * @param userLocation The user's location down to the most accurate detail.
 *  The default is an empty string.
 */
export function getPageTitles(userLocation: string): PageTitles {
  // The "nyc" case is the only case when we don't need the work address from
  // users so we don't show it. The work address is needed for the empty,
  // "nys", and "us" cases. Now an extra page is added to the
  // form submission flow.
  if (userLocation === "nyc") {
    return {
      personal: "Step 1 of 5: Personal Information",
      address: "Step 2 of 5: Location",
      // This step won't happen but the DS `Heading` component needs text.
      workAddress: "Work Address",
      verification: "Step 3 of 5: Address Verification",
      account: "Step 4 of 5: Create Your Account",
      review: "Step 5 of 5: Review Your Information",
    };
  }
  return {
    personal: "Step 1 of 6: Personal Information",
    address: "Step 2 of 6: Location",
    workAddress: "Step 3 of 6: Work Address",
    verification: "Step 4 of 6: Address Verification",
    account: "Step 5 of 6: Create Your Account",
    review: "Step 6 of 6: Review Your Information",
  };
}

/**
 * createQueryParams
 * Converts an object into key/value pairs to be use as url query params.
 */
export const createQueryParams = (obj) => {
  let query = "";
  for (const [key, value] of Object.entries(obj)) {
    query += `&${key}=${value}`;
  }
  return query;
};

/**
 * createNestedQueryParams
 * Stringifies an object to be used as the value for a specified key in a url
 * query param string. This makes it easier to group together errors and
 * results and doesn't override any existing url queries if the same key name
 * appears more than once.
 */
export const createNestedQueryParams = (dataAsString = {}, key) => {
  let query = "";
  if (!isEmpty(dataAsString) && key) {
    query = `&${key}=${JSON.stringify(dataAsString)}`;
  }
  return query;
};
