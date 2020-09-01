import isEmpty from "lodash/isEmpty";

import ilsLibraryList from "../data/ilsLibraryList";
import config from "../../appConfig";
import { Address } from "../interfaces";

const errorMessages = {
  firstName: "Please enter a valid first name.",
  lastName: "Please enter a valid last name.",
  birthdate: "Please enter a valid date, MM/DD/YYYY, including slashes.",
  ageGate: "You must be 13 years or older to continue.",
  email: "Please enter a valid email address.",
  username: "Username must be between 5-25 alphanumeric characters.",
  pin: "Please enter a 4-digit PIN.",
  location: "Please select an address option.",
  address: {
    line1: "Please enter a valid street address.",
    city: "Please enter a valid city.",
    state: "Please enter a 2-character state abbreviation.",
    zip: "Please enter a 5 or 9-digit postal code.",
  } as Address,
};

/**
 * findLibraryCode
 * Find the code for a library by searching for its name in the `ilsLibraryList`
 * array. If no object is found, return the default value of "eb" for
 * "e-branch" or "simplye" (interchangeable names);
 * @param libraryName Name of library to find in the list.
 */
function findLibraryCode(libraryName?: string) {
  const library = ilsLibraryList.find(
    (library) => library.label === libraryName
  );
  return library?.value || "eb";
}

/**
 * findLibraryName
 * Find the name for a library by searching for its code in the `ilsLibraryList`
 * array. If no object is found, return the default value of "eb" for
 * "e-branch" or "simplye" (interchangeable names);
 * @param libraryCode Name of library to find in the list.
 */
function findLibraryName(libraryCode?: string) {
  const library = ilsLibraryList.find(
    (library) => library.value === libraryCode
  );
  return library?.label || "SimplyE";
}

/**
 * getPatronAgencyType
 * Returns the agency type based on the patron's location
 * from the query param.
 */
const getPatronAgencyType = (agencyTypeParam?) => {
  const { agencyType } = config;
  return !isEmpty(agencyTypeParam) && agencyTypeParam.toLowerCase() === "nys"
    ? agencyType.nys
    : agencyType.default;
};

/**
 * getLocationValue
 * Map the location value from the form field into the string value.
 */
const getLocationValue = (location: string): string => {
  const locationMap = {
    nyc: "New York City (All five boroughs)",
    nys: "New York State (Outside NYC)",
    us: "United States (Visiting NYC)",
  };
  return locationMap[location];
};

export {
  findLibraryCode,
  findLibraryName,
  getPatronAgencyType,
  getLocationValue,
  errorMessages,
};
