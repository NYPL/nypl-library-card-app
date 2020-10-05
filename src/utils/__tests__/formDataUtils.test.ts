import {
  findLibraryCode,
  findLibraryName,
  getPatronAgencyType,
  getLocationValue,
  constructAddresses,
  constructErrorObject,
  constructPatronObject,
} from "../formDataUtils";
import { Addresses, FormInputData, FormAPISubmission } from "../../interfaces";

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

describe("constructAddresses", () => {
  test("it returns an empty AddressType object with no input", () => {
    const empty: Addresses = constructAddresses();

    expect(empty).toStrictEqual({ home: {}, work: {} });
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

describe("constructErrorObject", () => {
  test("returns an object with default values", () => {
    expect(constructErrorObject()).toEqual({
      status: 400,
      response: {
        type: "general-error",
        message: "There was an error with your request",
      },
    });
  });

  test("returns an object along with details", () => {
    expect(
      constructErrorObject("error", "invalid request", 500, {
        error: "details",
      })
    ).toEqual({
      status: 500,
      response: {
        type: "error",
        message: "invalid request",
        details: {
          error: "details",
        },
      },
    });
  });
});

describe("constructPatronObject", () => {
  test("returns an ErrorResponse with missing values in the details", () => {
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
      acceptTerms: true,
    };
    expect(constructPatronObject(patronFormValuesMissingValues)).toEqual({
      status: 400,
      response: {
        type: "server-validation-error",
        message: "server side validation error",
        details: {
          lastName: "Last Name field is empty.",
          email: "Email field is empty.",
          city: "City field is empty.",
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
    };

    expect(constructPatronObject(patronFormValues)).toEqual(
      patronRequestObject
    );
  });
});
