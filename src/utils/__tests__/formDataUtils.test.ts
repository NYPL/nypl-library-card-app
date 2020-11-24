import {
  errorMessages,
  isDate,
  findLibraryCode,
  findLibraryName,
  getPatronAgencyType,
  getLocationValue,
  constructAddressType,
  constructAddresses,
  constructProblemDetail,
  validateAddressFormData,
  validatePersonalFormData,
  validateAccountFormData,
  validateFormData,
  constructPatronObject,
} from "../formDataUtils";
import { Addresses, FormInputData, FormAPISubmission } from "../../interfaces";

describe("isDate", () => {
  test("it returns false on an empty input", () => {
    expect(isDate("")).toEqual(false);
  });

  test("it returns false if the input is a date but not in the year bounds", () => {
    // The year bounds is 1902 to the current year.
    expect(isDate("01/01/1900")).toEqual(false);
    expect(isDate("01/01/3020")).toEqual(false);
  });

  test("it returns true if the input is a valid date", () => {
    expect(isDate("01/01/1988")).toEqual(true);
    expect(isDate("10/30/1990")).toEqual(true);
  });
});

describe("findLibraryCode", () => {
  // `eb` is the default value describing the "E-Branch" or "SimplyE" library.
  test("it returns `eb` as the default value", () => {
    expect(findLibraryCode()).toEqual("eb");
  });

  test("it returns the value code for a library name", () => {
    // Spot checking random libraries. Check "/src/data/ilLibraryList.ts" for a
    // full mapping of library name to library code.
    expect(findLibraryCode("Melrose Branch")).toEqual("me");
    expect(findLibraryCode("Pelham Bay Branch")).toEqual("pm");
    expect(findLibraryCode("West Farms Branch")).toEqual("wf");
  });
});

describe("findLibraryName", () => {
  // "SimplyE" library is the default.
  test("it returns `eb` as the default value", () => {
    expect(findLibraryName()).toEqual("SimplyE");
  });

  test("it returns the value code for a library name", () => {
    // Spot checking random libraries. Check "/src/data/ilLibraryList.ts" for a
    // full mapping of library code to library name.
    expect(findLibraryName("ew")).toEqual("Edenwald Branch");
    expect(findLibraryName("ht")).toEqual("Countee Cullen Branch");
    expect(findLibraryName("se")).toEqual("Seward Park Branch");
  });
});

describe("getPatronAgencyType", () => {
  test("it returns '198' as the default agency value", () => {
    expect(getPatronAgencyType()).toEqual("198");
  });

  test("it returns the value code for nys", () => {
    expect(getPatronAgencyType("nys")).toEqual("199");
  });
});

describe("getLocationValue", () => {
  test("it returns the string value for the location code", () => {
    expect(getLocationValue("nyc")).toEqual(
      "New York City (All five boroughs)"
    );
    expect(getLocationValue("nys")).toEqual("New York State (Outside NYC)");
    expect(getLocationValue("us")).toEqual("United States (Visiting NYC)");
  });
});

// This is called by `constructAddresses` internally and is tested below.
describe("constructAddressType", () => {
  test("it returns the specific address values requested", () => {
    const formData = {
      "home-line1": "3747 61st St",
      "home-line2": "",
      "home-city": "Woodside",
      "home-state": "NY",
      "home-zip": "11377",
      "work-line1": "476 5th Avenue",
      "work-line2": "",
      "work-city": "New York",
      "work-state": "NY",
      "work-zip": "10018",
    };

    expect(constructAddressType(formData, "home")).toEqual({
      line1: "3747 61st St",
      line2: "",
      city: "Woodside",
      state: "NY",
      zip: "11377",
    });
    expect(constructAddressType(formData, "work")).toEqual({
      line1: "476 5th Avenue",
      line2: "",
      city: "New York",
      state: "NY",
      zip: "10018",
    });
  });
});

describe("constructAddresses", () => {
  test("it returns an empty Addresses object with no input", () => {
    const empty: Addresses = constructAddresses();

    expect(empty).toStrictEqual({ home: {} });
  });

  test("returns an updated home address object property", () => {
    const formData = {
      "home-line1": "3747 61st St",
      "home-line2": "",
      "home-city": "Woodside",
      "home-state": "NY",
      "home-zip": "11377",
    };
    const addresses: Addresses = constructAddresses(formData);

    expect(addresses.home).toEqual({
      line1: "3747 61st St",
      line2: "",
      city: "Woodside",
      state: "NY",
      zip: "11377",
    });
    expect(addresses.work).toEqual(undefined);
  });

  test("returns an updated work address object property", () => {
    const formData = {
      "work-line1": "476 5th Avenue",
      "work-line2": "",
      "work-city": "New York",
      "work-state": "NY",
      "work-zip": "10018",
    };
    const addresses: Addresses = constructAddresses(formData);

    expect(addresses.home).toEqual({});
    expect(addresses.work).toEqual({
      line1: "476 5th Avenue",
      line2: "",
      city: "New York",
      state: "NY",
      zip: "10018",
    });
  });

  test("returns updated home and work addresses objects", () => {
    const formData = {
      "home-line1": "3747 61st St",
      "home-line2": "",
      "home-city": "Woodside",
      "home-state": "NY",
      "home-zip": "11377",
      "work-line1": "476 5th Avenue",
      "work-line2": "",
      "work-city": "New York",
      "work-state": "NY",
      "work-zip": "10018",
    };
    const addresses: Addresses = constructAddresses(formData);

    expect(addresses).toEqual({
      home: {
        line1: "3747 61st St",
        line2: "",
        city: "Woodside",
        state: "NY",
        zip: "11377",
      },
      work: {
        line1: "476 5th Avenue",
        line2: "",
        city: "New York",
        state: "NY",
        zip: "10018",
      },
    });
  });
});

describe("constructProblemDetail", () => {
  test("returns an object with default values", () => {
    expect(constructProblemDetail()).toEqual({
      status: 400,
      type: "general-error",
      title: "General Error",
      detail: "There was an error with your request",
    });
  });

  test("returns an object along with details", () => {
    expect(
      constructProblemDetail(500, "invalid-request", "Invalid Request", "", {
        field: "uhoh",
      })
    ).toEqual({
      status: 500,
      type: "invalid-request",
      title: "Invalid Request",
      detail: "",
      error: { field: "uhoh" },
    });
  });
});

describe("validateAddressFormData", () => {
  const homeAddress = {
    line1: "111 1st St",
    city: "Queens",
    state: "NY",
    zip: "11368",
  };
  const workAddress = {
    line1: "476 5th Ave",
    city: "New York",
    state: "NY",
    zip: "10018",
  };

  test("it returns the original error object if the address has no errors", () => {
    const errorObj = { firstName: "uhoh!" };
    const noAddresses = { home: homeAddress };
    expect(validateAddressFormData(errorObj, noAddresses)).toEqual({
      firstName: "uhoh!",
    });
  });

  test("it returns any errors from the address", () => {
    const errorObj = { firstName: "uhoh!" };
    // Purposely setting "city" and "zip" to bad values.
    const addresses = { home: { ...homeAddress, city: "", zip: "" } };
    expect(validateAddressFormData(errorObj, addresses)).toEqual({
      firstName: "uhoh!",
      address: {
        home: {
          city: errorMessages.address.city,
          zip: errorMessages.address.zip,
        },
      },
    });
  });

  test("it returns error for the work address if it was added", () => {
    const errorObj = { firstName: "uhoh!" };
    // Purposely setting "city" and "zip" to bad values.
    const addresses = {
      home: { ...homeAddress, state: "New York" },
      work: { ...workAddress, city: "", zip: "111111111111" },
    };
    expect(validateAddressFormData(errorObj, addresses)).toEqual({
      firstName: "uhoh!",
      address: {
        home: {
          state: errorMessages.address.state,
        },
        work: {
          city: errorMessages.address.city,
          zip: errorMessages.address.zip,
        },
      },
    });
  });
});

describe("validatePersonalFormData", () => {
  test("it should return errors for all bad fields", () => {
    const data = {
      firstName: "",
      lastName: "",
      birthdate: "",
      email: "",
      policyType: "webApplicant",
    };

    expect(validatePersonalFormData({}, data)).toEqual({
      firstName: errorMessages.firstName,
      lastName: errorMessages.lastName,
      email: errorMessages.email,
      birthdate: errorMessages.birthdate,
    });
  });

  test("it should return an empty object since there are no errors", () => {
    const data = {
      firstName: "Tom",
      lastName: "Nook",
      birthdate: "01/01/1999",
      email: "tomnook@acnh.com",
      policyType: "webApplicant",
    };

    expect(validatePersonalFormData({}, data)).toEqual({});
  });

  test("it should add erros to the existing error object", () => {
    const errors = { someKey: "some value" };
    const data = {
      firstName: "",
      lastName: "Nook",
      birthdate: "01/01/1999",
      email: "tomnook@acnh.com",
      policyType: "webApplicant",
    };

    expect(validatePersonalFormData(errors, data)).toEqual({
      ...errors,
      firstName: errorMessages.firstName,
    });
  });
});

describe("validateAccountFormData", () => {
  test("it should return errors for all bad fields", () => {
    const data = {
      username: "",
      pin: "",
      verifyPin: "",
      acceptTerms: "",
    };

    expect(validateAccountFormData({}, data)).toEqual({
      username: errorMessages.username,
      pin: errorMessages.pin,
      verifyPin: errorMessages.verifyPin,
      acceptTerms: errorMessages.acceptTerms,
    });
  });

  test("it should return an empty object since there are no errors", () => {
    const data = {
      username: "tomnook",
      pin: "1234",
      verifyPin: "1234",
      acceptTerms: true,
    };

    expect(validateAccountFormData({}, data)).toEqual({});
  });

  test("it should add erros to the existing error object", () => {
    const errors = { someKey: "some value" };
    const data = {
      username: "",
      pin: "1234",
      verifyPin: "1234",
      acceptTerms: true,
    };

    expect(validateAccountFormData(errors, data)).toEqual({
      ...errors,
      username: errorMessages.username,
    });
  });
});

describe("validateFormData", () => {
  const homeAddress = {
    line1: "111 1st St",
    city: "Queens",
    state: "NY",
    zip: "11368",
  };
  const dataObj = {
    firstName: "",
    lastName: "Nook",
    email: "",
    birthdate: "01/01/1900",
    policyType: "webApplicant",
    username: "",
    pin: "1234",
    verifyPin: "1235",
    acceptTerms: false,
    location: "",
  };

  test("it should return errors for all bad fields", () => {
    const addresses = { home: { ...homeAddress, city: "" } };

    expect(validateFormData(dataObj, addresses)).toEqual({
      firstName: errorMessages.firstName,
      email: errorMessages.email,
      birthdate: errorMessages.birthdate,
      username: errorMessages.username,
      verifyPin: errorMessages.verifyPin,
      acceptTerms: errorMessages.acceptTerms,
      address: {
        home: { city: errorMessages.address.city },
      },
    });
  });

  test("it should return an empty object since there are no errors", () => {
    const addresses = { home: homeAddress };
    const patron = {
      ...dataObj,
      firstName: "Tom",
      birthdate: "01/01/1999",
      email: "tomnook@acnh.com",
      username: "tomnook",
      verifyPin: "1234",
      acceptTerms: true,
      location: "nyc",
    };

    expect(validateFormData(patron, addresses)).toEqual({});
  });
});

describe("constructPatronObject", () => {
  test("returns a ProblemDetail with missing values in the details", () => {
    const patronFormValuesMissingValues: FormInputData = {
      ecommunicationsPref: true,
      policyType: "webApplicant",
      firstName: "Tom",
      lastName: "",
      birthdate: "01/01/1988",
      email: "",
      location: "nyc",
      homeLibraryCode: "ch",
      "home-line1": "111 1st St",
      "home-line2": "",
      "home-city": "",
      "home-state": "NY",
      "home-zip": "10018-2788",
      username: "tomnook42",
      pin: "1234",
      verifyPin: "1234",
      acceptTerms: true,
    };
    expect(constructPatronObject(patronFormValuesMissingValues)).toEqual({
      status: 400,
      type: "invalid-request",
      title: "Invalid Request",
      detail: "There was an error with the submitted form values.",
      error: {
        lastName: "Please enter a valid last name.",
        email: "Please enter a valid email address.",
        address: {
          home: {
            city: "Please enter a valid city.",
          },
        },
      },
    });
  });

  test("returns an object with expected structure for the Card Creator request", () => {
    const patronFormValues: FormInputData = {
      ecommunicationsPref: true,
      policyType: "webApplicant",
      firstName: "Tom",
      lastName: "Nook",
      birthdate: "01/01/1988",
      email: "tomnook@nypl.org",
      location: "nyc",
      homeLibraryCode: "ch",
      "home-line1": "111 1st St",
      "home-line2": "",
      "home-city": "New York",
      "home-state": "NY",
      "home-zip": "10018-2788",
      "work-line1": "476 5th Ave",
      "work-line2": "",
      "work-city": "New York",
      "work-state": "NY",
      "work-zip": "10018-2788",
      "home-county": "New York",
      "home-isResidential": true,
      "home-hasBeenValidated": true,
      "work-county": "New York",
      "work-isResidential": false,
      "work-hasBeenValidated": true,
      username: "tomnook42",
      pin: "1234",
      verifyPin: "1234",
      acceptTerms: true,
    };
    const patronRequestObject: FormAPISubmission = {
      name: "Tom Nook",
      email: "tomnook@nypl.org",
      birthdate: "01/01/1988",
      ageGate: undefined,
      address: {
        line1: "111 1st St",
        line2: "",
        city: "New York",
        state: "NY",
        zip: "10018-2788",
        county: "New York",
        isResidential: true,
        hasBeenValidated: true,
      },
      workAddress: {
        line1: "476 5th Ave",
        line2: "",
        city: "New York",
        state: "NY",
        zip: "10018-2788",
        county: "New York",
        isResidential: false,
        hasBeenValidated: true,
      },
      username: "tomnook42",
      pin: "1234",
      ecommunicationsPref: true,
      agencyType: "198",
      usernameHasBeenValidated: undefined,
      policyType: "webApplicant",
      homeLibraryCode: "ch",
      acceptTerms: true,
      location: "nyc",
    };

    expect(constructPatronObject(patronFormValues)).toEqual(
      patronRequestObject
    );
  });
});
