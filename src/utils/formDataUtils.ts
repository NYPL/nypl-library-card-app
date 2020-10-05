import isEmpty from "lodash/isEmpty";
import { isEmail, isAlphanumeric, isNumeric, isLength } from "validator";
import ilsLibraryList from "../data/ilsLibraryList";
import config from "../../appConfig";
import {
  Address,
  Addresses,
  ErrorResponse,
  FormAPISubmission,
  FormInputData,
} from "../interfaces";

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

/**
 * constructAddresses
 * Address form fields have "home-" or "work-" as prefixes in their name
 * attribute, such as "home-line1" or "home-city". We need to remove the prefix
 * and create objects for the home and work addresses.
 * @param object FormData object from the client's form submission.
 */
const constructAddresses = (object = {}) => {
  const addresses: Addresses = {
    home: {} as Address,
    work: {} as Address,
  };

  // Remove the addresses fields' prefix and add to the proper object.
  const prefixes = ["home", "work"];
  Object.keys(object).forEach((key) => {
    prefixes.forEach((prefix) => {
      if (key.indexOf(`${prefix}-`) !== -1) {
        const field = key.split("-")[1];
        addresses[prefix][field] = object[key];
      }
    });
  });

  return addresses;
};

/**
 * constructErrorObject
 * Create an error object to be returned by the API endpoints.
 */
const constructErrorObject = (
  type = "general-error",
  message = "There was an error with your request",
  status = 400,
  details?
) => {
  const response: ErrorResponse = {
    status,
    response: {
      type,
      message,
    },
  };

  if (!isEmpty(details)) {
    response.response.details = details;
  }

  return response;
};

/**
 * constructPatronObject
 * Creates an object that can be sent to the Card Creator API. Returns an error
 * object if any fields don't pass their validation requirements.
 */
const constructPatronObject = (
  object: FormInputData
): FormAPISubmission | ErrorResponse => {
  const {
    firstName,
    lastName,
    email,
    birthdate,
    username,
    pin,
    ecommunicationsPref,
    agencyType,
    usernameHasBeenValidated,
    policyType,
    ageGate,
    homeLibraryCode,
    acceptTerms,
  } = object;

  const addresses: Addresses = constructAddresses(object);

  let errorObj = {};

  if (isEmpty(firstName)) {
    errorObj = { ...errorObj, firstName: "First Name field is empty." };
  }

  if (isEmpty(lastName)) {
    errorObj = { ...errorObj, lastName: "Last Name field is empty." };
  }

  if (policyType === "webApplicant" && isEmpty(birthdate)) {
    errorObj = { ...errorObj, birthdate: "Date of Birth field is empty." };
  } else if (policyType === "simplye" && !ageGate) {
    errorObj = {
      ...errorObj,
      ageGate: "You must be 13 years or older to continue.",
    };
  }

  if (isEmpty(addresses.home.line1)) {
    errorObj = { ...errorObj, line1: "Street Address field is empty." };
  }

  if (isEmpty(addresses.home.city)) {
    errorObj = { ...errorObj, city: "City field is empty." };
  }

  if (isEmpty(addresses.home.state)) {
    errorObj = { ...errorObj, state: "State field is empty." };
  }

  if (isEmpty(addresses.home.zip)) {
    errorObj = { ...errorObj, zip: "Postal Code field is empty." };
  }

  // if (
  //   !isEmpty(addresses.home.zip) &&
  //   (!isNumeric(addresses.home.zip) ||
  //     !isLength(addresses.home.zip, { min: 5, max: 10 }))
  // ) {
  //   errorObj = { ...errorObj, zip: "Please enter a 5 or 9-digit postal code." };
  // }

  if (isEmpty(email)) {
    errorObj = { ...errorObj, email: "Email field is empty." };
  } else if (!isEmpty(email.trim()) && !isEmail(email)) {
    errorObj = { ...errorObj, email: "Please enter a valid email address." };
  }

  if (isEmpty(username)) {
    errorObj = { ...errorObj, username: "Username field is empty." };
  }

  if (
    !isEmpty(username) &&
    (!isAlphanumeric(username) || !isLength(username, { min: 5, max: 25 }))
  ) {
    errorObj = {
      ...errorObj,
      username: "Please enter a username between 5-25 alphanumeric characters.",
    };
  }

  if (isEmpty(pin)) {
    errorObj = { ...errorObj, pin: "PIN field is empty." };
  }

  if (
    !isEmpty(pin) &&
    (!isNumeric(pin) || !isLength(pin, { min: 4, max: 4 }))
  ) {
    errorObj = { ...errorObj, pin: "Please enter a 4-digit PIN." };
  }

  if (errorObj && !isEmpty(errorObj)) {
    return constructErrorObject(
      "server-validation-error",
      "server side validation error",
      400,
      errorObj
    );
  }

  const fullName = `${firstName.trim()} ${lastName.trim()}`;

  return {
    name: fullName,
    email,
    birthdate,
    ageGate,
    address: addresses.home,
    workAddress: !isEmpty(addresses.work) ? addresses.work : null,
    username,
    pin,
    ecommunicationsPref,
    agencyType: agencyType || config.agencyType.default,
    usernameHasBeenValidated,
    policyType: policyType || "simplye",
    homeLibraryCode,
    acceptTerms,
  };
};

export {
  findLibraryCode,
  findLibraryName,
  getPatronAgencyType,
  getLocationValue,
  errorMessages,
  constructAddresses,
  constructPatronObject,
  constructErrorObject,
};
