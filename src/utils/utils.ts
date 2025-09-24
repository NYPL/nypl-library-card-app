import isEmpty from "lodash/isEmpty";
import { PageTitles } from "../interfaces";

const redirectIfUserHasRegistered = async (hasRegistered: boolean, router) => {
  if (hasRegistered) {
    await router.push("/congrats?newCard=true");
  }
};

/**
 * homePageRedirect
 * Function that should be used in `getStaticProps` or `getServerSideProps`.
 * This returns a redirect object that those functions understand.
 */
const homePageRedirect = () => ({
  redirect: {
    destination: "/new",
    permanent: false,
  },
});

/**
 * getPageTitles
 * Returns the page titles and updates the titles if the user is not in "nyc".
 */
function getPageTitles(): PageTitles {
  // The "nyc" case is the only case when we don't need the work address from
  // users so we don't show it. The work address is needed for the empty,
  // "nys", and "us" cases. Now an extra page is added to the
  // form submission flow.
  return {
    personal: "Step 1 of 5: Personal Information",
    address: "Step 2 of 5: Address",
    workAddress: "Alternate Address",
    verification: "Step 3 of 5: Address Verification",
    account: "Step 4 of 5: Customize Your Account",
    review: "Step 5 of 5: Confirm Your Information",
  };
}

const nyCounties = ["richmond", "queens", "new york", "kings", "bronx"];
const nyCities = [
  "new york",
  "new york city",
  "nyc",
  "bronx",
  "queens",
  "brooklyn",
  "staten island",
];

/**
 * createQueryParams
 * Converts an object into key/value pairs to be use as url query params.
 */
const createQueryParams = (obj = {}) => {
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
const createNestedQueryParams = (dataAsString = {}, key) => {
  let query = "";
  if (!isEmpty(dataAsString) && key) {
    query = `&${key}=${JSON.stringify(dataAsString)}`;
  }
  return query;
};

export {
  redirectIfUserHasRegistered,
  homePageRedirect,
  nyCounties,
  nyCities,
  createQueryParams,
  createNestedQueryParams,
  getPageTitles,
};
