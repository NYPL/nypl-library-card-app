import {
  errorMessages,
  isDate,
  findLibraryCode,
  findLibraryName,
  getPatronAgencyType,
  getLocationValue,
  constructAddressType,
  constructAddresses,
  validateAddressFormData,
  validatePersonalFormData,
  validateAccountFormData,
  validateFormData,
  constructPatronObject,
} from "../formDataUtils";
import { Addresses, FormInputData, FormAPISubmission } from "../../interfaces";

// Mock t function that returns the key as-is
const t = (key: string) => key;

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
  test("it returns the value code for a library name", () => {
    // Spot checking random libraries. Check "/src/data/ilLibraryList.ts" for a
    // full mapping of library name to library code.
    expect(findLibraryCode("Virtual")).toEqual("vr");
    expect(findLibraryCode("Melrose Library")).toEqual("me");
    expect(findLibraryCode("Pelham Bay Library")).toEqual("pm");
    expect(findLibraryCode("West Farms Library")).toEqual("wf");
  });
});

describe("findLibraryName", () => {
  test("it returns the value code for a library name", () => {
    // Spot checking random libraries. Check "/src/data/ilLibraryList.ts" for a
    // full mapping of library code to library name.
    expect(findLibraryName("vr")).toEqual("Virtual");
    expect(findLibraryName("ew")).toEqual("Edenwald Library");
    expect(findLibraryName("ht")).toEqual("Countee Cullen Library");
    expect(findLibraryName("se")).toEqual("Seward Park Library");
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
    expect(validateAddressFormData(errorObj, noAddresses, t)).toEqual({
      firstName: "uhoh!",
    });
  });

  test("it returns any errors from the address", () => {
    const errorObj = { firstName: "uhoh!" };
    const addresses = { home: { ...homeAddress, city: "", zip: "" } };
    expect(validateAddressFormData(errorObj, addresses, t)).toEqual({
      firstName: "uhoh!",
      address: {
        home: {
          city: errorMessages(t).address.city,
          zip: errorMessages(t).address.zip,
        },
      },
    });
  });

  test("it returns error for the work address if it was added", () => {
    const errorObj = { firstName: "uhoh!" };
    const addresses = {
      home: { ...homeAddress, state: "New York" },
      work: { ...workAddress, city: "", zip: "111111111111" },
    };
    expect(validateAddressFormData(errorObj, addresses, t)).toEqual({
      firstName: "uhoh!",
      address: {
        home: { state: errorMessages(t).address.state },
        work: {
          city: errorMessages(t).address.city,
          zip: errorMessages(t).address.zip,
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
    } as unknown as FormInputData;
    expect(validatePersonalFormData({}, data, t)).toEqual({
      firstName: errorMessages(t).firstName,
      lastName: errorMessages(t).lastName,
      email: errorMessages(t).email,
      birthdate: errorMessages(t).birthdate,
    });
  });

  test("it should return an empty object since there are no errors", () => {
    const data = {
      firstName: "Tom",
      lastName: "Nook",
      birthdate: "01/01/1999",
      email: "tomnook@acnh.com",
      policyType: "webApplicant",
    } as unknown as FormInputData;
    expect(validatePersonalFormData({}, data, t)).toEqual({});
  });

  test("it should add errors to the existing error object", () => {
    const errors = { someKey: "some value" };
    const data = {
      firstName: "",
      lastName: "Nook",
      birthdate: "01/01/1999",
      email: "tomnook@acnh.com",
      policyType: "webApplicant",
    } as unknown as FormInputData;
    expect(validatePersonalFormData(errors, data, t)).toEqual({
      ...errors,
      firstName: errorMessages(t).firstName,
    });
  });
});

describe("validateAccountFormData", () => {
  test("it should return errors for all bad fields", () => {
    const data = {
      username: "",
      password: "",
      verifyPassword: "",
      acceptTerms: "",
      homeLibraryCode: "non-existent-code",
    } as unknown as FormInputData;
    expect(validateAccountFormData({}, data, t)).toEqual({
      username: errorMessages(t).username,
      password: errorMessages(t).password,
      verifyPassword: errorMessages(t).verifyPassword,
      acceptTerms: errorMessages(t).acceptTerms,
      homeLibraryCode: errorMessages(t).homeLibraryCode,
    });
  });

  test("it should return an empty object since there are no errors", () => {
    const data = {
      username: "tomnook",
      password: "MyLib1731@!",
      verifyPassword: "MyLib1731@!",
      acceptTerms: true,
      homeLibraryCode: "vr",
    } as unknown as FormInputData;
    expect(validateAccountFormData({}, data, t)).toEqual({});
  });

  test("it should add errors to the existing error object", () => {
    const errors = { someKey: "some value" };
    const data = {
      username: "",
      password: "MyLib1731@!",
      verifyPassword: "MyLib1731@!",
      acceptTerms: true,
      homeLibraryCode: "vr",
    } as unknown as FormInputData;
    expect(validateAccountFormData(errors, data, t)).toEqual({
      ...errors,
      username: errorMessages(t).username,
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
    password: "MyLib1731@!",
    verifyPassword: "NotTheSamePassword",
    acceptTerms: false,
    location: "",
  } as unknown as FormInputData;

  test("it should return errors for all bad fields", () => {
    const addresses = { home: { ...homeAddress, city: "" } };
    expect(validateFormData(dataObj, addresses, t)).toEqual({
      firstName: errorMessages(t).firstName,
      email: errorMessages(t).email,
      birthdate: errorMessages(t).birthdate,
      username: errorMessages(t).username,
      verifyPassword: errorMessages(t).verifyPassword,
      homeLibraryCode: errorMessages(t).homeLibraryCode,
      acceptTerms: errorMessages(t).acceptTerms,
      address: {
        home: { city: errorMessages(t).address.city },
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
      verifyPassword: "MyLib1731@!",
      homeLibraryCode: "vr",
      acceptTerms: true,
      location: "nyc",
    };
    expect(validateFormData(patron, addresses, t)).toEqual({});
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
      password: "MyLib1731@!",
      verifyPassword: "MyLib1731@!",
      acceptTerms: true,
    };
    expect(constructPatronObject(patronFormValuesMissingValues, t)).toEqual({
      status: 400,
      type: "invalid-request",
      title: "Invalid Request",
      detail: "There was an error with the submitted form values.",
      error: {
        lastName: "There was a problem. Please enter a valid last name.",
        email: "There was a problem. Please enter a valid email address.",
        address: {
          home: {
            city: "There was a problem. Please enter a valid city.",
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
      password: "MyLib1731@!",
      verifyPassword: "MyLib1731@!",
      acceptTerms: true,
    };
    const patronRequestObject: FormAPISubmission = {
      firstName: "Tom",
      lastName: "Nook",
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
      password: "MyLib1731@!",
      ecommunicationsPref: true,
      agencyType: "198",
      policyType: "webApplicant",
      homeLibraryCode: "ch",
      acceptTerms: true,
      location: "nyc",
    };
    const t = (key: string) => key;

    expect(constructPatronObject(patronFormValues, t)).toEqual(
      patronRequestObject
    );
  });
});
