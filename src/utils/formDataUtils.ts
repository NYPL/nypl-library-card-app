import isEmpty from "lodash/isEmpty";
import { isEmail, isAlphanumeric, isNumeric, isLength } from "validator";
import ilsLibraryList from "../data/ilsLibraryList";
import config from "../../appConfig";
import {
  Address,
  Addresses,
  ProblemDetail,
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
  verifyPin: "The two PINs don't match.",
  acceptTerms: "The terms and conditions were not accepted.",
  address: {
    line1: "Please enter a valid street address.",
    city: "Please enter a valid city.",
    state: "Please enter a 2-character state abbreviation.",
    zip: "Please enter a 5 or 9-digit postal code.",
  } as Address,
};

/**
 * isDate
 * Makes sure that the input value matches the desired path and is a date with
 * the year bounds.
 */
function isDate(
  input,
  minYear = 1902,
  maxYear = new Date().getFullYear()
): boolean {
  // regular expression to match required date format
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (input === "") {
    return false;
  }

  if (input.match(regex)) {
    const temp = input.split("/");
    const dateFromInput = new Date(`${temp[2]}/${temp[0]}/${temp[1]}`);

    return (
      dateFromInput.getDate() === Number(temp[1]) &&
      dateFromInput.getMonth() + 1 === Number(temp[0]) &&
      Number(temp[2]) > minYear &&
      Number(temp[2]) < maxYear
    );
  }

  return false;
}

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
  return locationMap[location] || "United States (Visiting NYC)";
};

/**
 * constructAddressType
 * Address form fields have "home-" or "work-" as prefixes in their name
 * attribute, such as "home-line1" or "home-city". We need to remove the prefix
 * and create an object for address type that was passed.
 */
const constructAddressType = (object = {}, type: string) => {
  const address = {};
  Object.keys(object).forEach((key) => {
    if (key.indexOf(`${type}-`) !== -1) {
      // Remove the addresses field prefix and add to the proper object.
      const field = key.split("-")[1];
      address[field] = object[key];
    }
  });
  return address;
};

/**
 * constructAddresses
 * From a single object that has address data prefixed with "home-" or "work-",
 * create an Addresses object.
 * @param object FormData object from the client's form submission.
 */
const constructAddresses = (object = {}): Addresses => {
  const addresses = {
    home: constructAddressType(object, "home"),
    work: constructAddressType(object, "work"),
  } as Addresses;

  // The work object is optional, so if it's completely empty, just remove it
  // or else we'll get false errors of work fields being empty.
  if (isEmpty(addresses.work)) {
    delete addresses.work;
  }

  return addresses;
};

/**
 * constructProblemDetail
 * Create an error object to be returned by the API endpoints.
 */
const constructProblemDetail = (
  status = 400,
  type = "general-error",
  title = "General Error",
  detail = "There was an error with your request",
  error = null
): ProblemDetail => {
  const pd: ProblemDetail = {
    status,
    type,
    title,
    detail,
  };
  if (error) {
    pd.error = error;
  }
  return pd;
};

/**
 * validateAddressFormData
 * This validates fields in an address object, adds any errors to the object
 * containing any existing errors from other fields, and returns it. The
 * validation is perform on the home and work address, if available. Since the
 * work address is optional, having an empty work address is acceptable.
 */
const validateAddressFormData = (initErrorObj, addresses: Addresses) => {
  let errorObj = { ...initErrorObj };
  // Keep track of the home or work address errors in this larger object.
  const addressErrors = {};

  Object.keys(addresses).forEach((addressType) => {
    // `addressType` can be either "home" or "work".
    const typeObj = addresses[addressType];

    // Now validate each field for that specific address object:
    if (isEmpty(typeObj.line1)) {
      addressErrors[addressType] = {
        ...addressErrors[addressType],
        line1: errorMessages.address.line1,
      };
    } else if (typeObj?.line1?.length + typeObj?.line2?.length > 100) {
      addressErrors[addressType] = {
        ...addressErrors[addressType],
        line1: "Street address fields must not be more than 100 lines.",
      };
    }

    if (isEmpty(typeObj.city)) {
      addressErrors[addressType] = {
        ...addressErrors[addressType],
        city: errorMessages.address.city,
      };
    }

    if (isEmpty(typeObj.state) || typeObj.state.length !== 2) {
      addressErrors[addressType] = {
        ...addressErrors[addressType],
        state: errorMessages.address.state,
      };
    }

    if (isEmpty(typeObj.zip) || !isLength(typeObj.zip, { min: 5, max: 10 })) {
      addressErrors[addressType] = {
        ...addressErrors[addressType],
        zip: errorMessages.address.zip,
      };
    }
  });

  // Now add it back to the original error object as the separate
  // `address` property.
  if (!isEmpty(addressErrors)) {
    errorObj = { ...errorObj, address: addressErrors };
  }

  return errorObj;
};

/**
 * validatePersonalFormData
 */
const validatePersonalFormData = (initErrorObj, data) => {
  let errorObj = { ...initErrorObj };
  const { firstName, lastName, birthdate, ageGate, email, policyType } = data;

  if (isEmpty(firstName)) {
    errorObj = { ...errorObj, firstName: errorMessages.firstName };
  }
  if (isEmpty(lastName)) {
    errorObj = { ...errorObj, lastName: errorMessages.lastName };
  }
  const MAXLENGTHDATE = 10;
  if (policyType === "webApplicant") {
    if (
      isEmpty(birthdate) ||
      (birthdate.length <= MAXLENGTHDATE && !isDate(birthdate))
    ) {
      errorObj = {
        ...errorObj,
        birthdate: errorMessages.birthdate,
      };
    }
  } else if (policyType === "simplye" && !ageGate) {
    errorObj = {
      ...errorObj,
      ageGate: errorMessages.ageGate,
    };
  }
  if (isEmpty(email) || !isEmail(email)) {
    errorObj = { ...errorObj, email: errorMessages.email };
  }

  return errorObj;
};

/**
 * validateAccountFormData
 */
const validateAccountFormData = (initErrorObj, data) => {
  let errorObj = { ...initErrorObj };
  const { username, pin, verifyPin, acceptTerms } = data;

  if (
    isEmpty(username) ||
    !isAlphanumeric(username) ||
    !isLength(username, { min: 5, max: 25 })
  ) {
    errorObj = {
      ...errorObj,
      username: errorMessages.username,
    };
  }

  if (isEmpty(pin) || !isNumeric(pin) || !isLength(pin, { min: 4, max: 4 })) {
    errorObj = { ...errorObj, pin: errorMessages.pin };
  }

  if (isEmpty(verifyPin) || pin !== verifyPin) {
    errorObj = { ...errorObj, verifyPin: errorMessages.verifyPin };
  }
  if (!acceptTerms) {
    errorObj = { ...errorObj, acceptTerms: errorMessages.acceptTerms };
  }

  return errorObj;
};

/**
 * validateFormData
 * Validates the form submission values and returns any errors. Internally, it
 * uses `validateAddressFormData` to validate home and work addresses.
 */
const validateFormData = (data, addresses) => {
  // Initially, there are no errors so the first param is an empty object.
  let errorObj = validatePersonalFormData({}, data);
  errorObj = validateAddressFormData(errorObj, addresses);
  errorObj = validateAccountFormData(errorObj, data);

  return errorObj;
};

/**
 * constructPatronObject
 * Creates an object that can be sent to the Card Creator API. Returns an error
 * object if any fields don't pass their validation requirements.
 */
const constructPatronObject = (
  object: FormInputData
): FormAPISubmission | ProblemDetail => {
  const {
    firstName,
    lastName,
    email,
    birthdate,
    ageGate,
    ecommunicationsPref,
    agencyType,
    policyType,
    username,
    usernameHasBeenValidated,
    pin,
    homeLibraryCode,
    acceptTerms,
  } = object;

  const addresses: Addresses = constructAddresses(object);
  const errors = validateFormData(object, addresses);

  if (!isEmpty(errors)) {
    return constructProblemDetail(
      400,
      "invalid-request",
      "Invalid Request",
      "There was an error with the submitted form values.",
      errors
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
  errorMessages,
  isDate,
  findLibraryCode,
  findLibraryName,
  getPatronAgencyType,
  getLocationValue,
  constructAddresses,
  constructAddressType,
  constructProblemDetail,
  constructPatronObject,
  validateFormData,
  validatePersonalFormData,
  validateAddressFormData,
  validateAccountFormData,
};
