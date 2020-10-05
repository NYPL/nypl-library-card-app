/* eslint-disable @typescript-eslint/camelcase,
@typescript-eslint/no-var-requires */
import {
  constructApiHeaders,
  isTokenExpiring,
  initializeAppAuth,
  axiosAddressPost,
  makeAddressAPICalls,
  validateAddress,
  validateUsername,
  createPatron,
} from "../api";
const axios = require("axios");
import moment from "moment";
import { create } from "domain";

jest.mock("axios");
let mockedReturnedJson = {};
class MockRes {
  status() {
    return this;
  }
  json(obj) {
    mockedReturnedJson = obj;
    return;
  }
}
const mockRes = new MockRes();

describe("constructApiHeaders", () => {
  test("it returns authorization headers object", () => {
    const headers = constructApiHeaders("token");

    expect(headers).toEqual({
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
      timeout: 10000,
    });
  });
});

describe("isTokenExpiring", () => {
  test("returns false if the expiration time won't expire in the default time of 5 minutes", () => {
    // 3600s is one hour and the time returned form the Auth API.
    const expTime = moment().add(3600, "s");
    expect(isTokenExpiring(expTime)).toEqual(false);
  });

  test("returns true if the expiration time will expire soon", () => {
    // 180s is 3mins.
    const expTime = moment().add(180, "s");
    expect(isTokenExpiring(expTime)).toEqual(true);
  });

  test("returns true if the expiration time will expire within 10 minutes", () => {
    // 540s is 9mins.
    const expTime = moment().add(540, "s");
    expect(isTokenExpiring(expTime, 10)).toEqual(true);
  });
});

/**
 * Note: This is hard to test the subsequent call when the token is about to
 * expire. The application-level `app` variable keeps resetting to `{}`
 * although in the real world use-case, the `app` variable contains all the
 * auth response variables. Need to get back to this later.
 */
describe("initializeAppAuth", () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test("it should throw an error if the Auth endpoint returned bad data", async () => {
    const invalidResp = {
      error: "some error",
    };
    axios.post.mockResolvedValue(invalidResp);

    await initializeAppAuth({}, mockRes, {});

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(mockedReturnedJson).toEqual({
      response: {
        details: {
          oauth: "No access_token obtained from OAuth Service.",
        },
        message: "No access_token obtained from OAuth Service.",
        type: "no-access-token",
      },
      status: 400,
    });
  });

  test("calls the Auth API once since there is no access token", async () => {
    const validResp = {
      data: {
        access_token: "someToken",
        expires_in: 3600,
        token_type: "Bearer",
        scope: "openid",
        id_token: "someIdToken",
      },
    };

    axios.post.mockResolvedValue(validResp);
    const result = await initializeAppAuth({}, mockRes, {});

    expect(axios.post).toHaveBeenCalledTimes(1);
    // Nothing is returned from an API call with a valid response.
    // The token is just added to the global level `app` variable.
    expect(result).toEqual(undefined);
  });

  test("shouldn't make an API call since there already is an access token", async () => {
    const validResp = {
      data: {
        access_token: "someToken",
        expires_in: 3600,
        token_type: "Bearer",
        scope: "openid",
        id_token: "someIdToken",
      },
    };
    const appObj = {
      tokenObject: { ["access_token"]: "token" },
      tokenExpTime: moment().add(4000, "s"),
    };

    axios.post.mockResolvedValue(validResp);

    const result = await initializeAppAuth({}, mockRes, appObj);

    expect(axios.post).toHaveBeenCalledTimes(0);
    // Nothing is returned from an API call with a valid response.
    // The token is just added to the global level `app` variable.
    expect(result).toEqual(undefined);
  });

  test("should make an API call if there's an access token but it's about to expire", async () => {
    const validResp = {
      data: {
        access_token: "someToken",
        expires_in: 3600,
        token_type: "Bearer",
        scope: "openid",
        id_token: "someIdToken",
      },
    };
    const appObj = {
      tokenObject: { ["access_token"]: "token" },
      tokenExpTime: moment().add(180, "s"),
    };

    axios.post.mockResolvedValue(validResp);

    const result = await initializeAppAuth({}, mockRes, appObj);

    expect(axios.post).toHaveBeenCalledTimes(1);
    // Nothing is returned from an API call with a valid response.
    // The token is just added to the global level `app` variable.
    expect(result).toEqual(undefined);
  });
});

describe("axiosAddressPost", () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test("makes an authenticated API call with the non-work address and gets a valid response", async () => {
    const address = {
      line1: "476 5th Avenue",
      city: "New York",
      state: "NY",
      zip: "10018",
    };
    const isWorkAddress = false;
    axios.post.mockResolvedValue({
      data: {
        status: 200,
        address,
      },
    });
    // );
    const result = await axiosAddressPost(
      address,
      isWorkAddress,
      "token",
      "addressUrl"
    );

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "addressUrl",
      { address, isWorkAddress },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
        timeout: 10000,
      }
    );
    expect(result).toEqual({
      status: 200,
      success: true,
      isWorkAddress,
      address,
    });
  });

  test("makes an authenticated API call with a work address and gets a non-valid response", async () => {
    const address = {
      line1: "476 5th Avenue",
      city: "New York",
      state: "NY",
      zip: "10018",
    };
    const isWorkAddress = true;
    axios.post.mockRejectedValue({
      response: {
        status: 400,
        data: { address },
      },
    });
    const result = await axiosAddressPost(
      address,
      isWorkAddress,
      "token",
      "addressUrl"
    );

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "addressUrl",
      { address, isWorkAddress },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
        timeout: 10000,
      }
    );
    expect(result).toEqual({
      status: 400,
      success: false,
      isWorkAddress,
      address,
    });
  });
});

describe("makeAddressAPICalls", () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test("makes individual API call for each address passed", async () => {
    const homeAddress = {
      address: {
        line1: "111 1st St.",
        city: "New York",
        state: "NY",
        zip: "10018",
      },
      isWorkAddress: false,
    };
    const workAddress = {
      address: {
        line1: "476 5th Ave",
        city: "New York",
        state: "NY",
        zip: "10018",
      },
      isWorkAddress: true,
    };
    const addresses = [homeAddress, workAddress];
    // Mock each API call response in sequence.
    axios.post.mockResolvedValueOnce({
      data: {
        status: 200,
        address: homeAddress.address,
      },
    });
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { address: workAddress.address },
      },
    });

    const result = await makeAddressAPICalls(addresses, "token");

    expect(axios.post).toHaveBeenCalledTimes(2);
    // We expect to have an array of two address response objects
    // (valid or error responses).
    expect(result.length).toEqual(2);
    expect(result).toEqual([
      {
        status: 200,
        success: true,
        isWorkAddress: false,
        address: homeAddress.address,
      },
      {
        status: 400,
        success: false,
        isWorkAddress: true,
        address: workAddress.address,
      },
    ]);
  });
});

describe("validateAddress", () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test("it returns validated address responses from the API calls", async () => {
    const appObj = {
      tokenObject: { ["access_token"]: "token" },
      tokenExpTime: moment().add(4000, "s"),
    };
    const requestBody = {
      body: {
        formData: {
          "home-line1": "111 1st St.",
          "home-city": "New York",
          "home-state": "NY",
          "home-zip": "11018",
          "work-line1": "476 5th Avenue",
          "work-city": "New York",
          "work-state": "NY",
          "work-zip": "11018",
        },
      },
    };
    axios.post.mockResolvedValueOnce({
      data: {
        status: 200,
        type: "valid-address",
        cardType: "standard",
        address: {
          line1: "111 1st St.",
          city: "New York",
          state: "NY",
          zip: "11018",
          isResidential: true,
          hasBeenValidated: true,
        },
        originalAddress: {},
        message: "",
        reason: "",
      },
    });
    axios.post.mockResolvedValueOnce({
      data: {
        status: 200,
        type: "valid-address",
        cardType: "standard",
        address: {
          line1: "476 5th Avenue",
          city: "New York",
          state: "NY",
          zip: "11018",
          isResidential: true,
          hasBeenValidated: true,
        },
        originalAddress: {},
        message: "",
        reason: "",
      },
    });

    await validateAddress(requestBody, mockRes, appObj);

    expect(axios.post).toHaveBeenCalledTimes(2);

    expect(mockedReturnedJson).toEqual({
      status: 200,
      home: {
        address: {
          line1: "111 1st St.",
          city: "New York",
          state: "NY",
          zip: "11018",
          isResidential: true,
          hasBeenValidated: true,
        },
        addresses: undefined,
        message: "",
        reason: "",
      },
      work: {
        address: {
          line1: "476 5th Avenue",
          city: "New York",
          state: "NY",
          zip: "11018",
          isResidential: true,
          hasBeenValidated: true,
        },
        addresses: undefined,
        message: "",
        reason: "",
      },
    });
  });

  test("it does not make an API call without an access token", async () => {
    const requestBody = {
      body: {
        formData: {},
      },
    };
    axios.post.mockResolvedValue({});

    await validateAddress(requestBody, mockRes, {});

    expect(axios.post).toHaveBeenCalledTimes(0);
  });
});

describe("validateUsername", () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test("it should not make an API call if there is no oauth token", async () => {
    const requestBody = {
      body: {
        username: "tomnook42",
      },
    };
    axios.post.mockResolvedValue({
      data: {
        status: 200,
        type: "available-username",
        cardType: "standard",
        message: "This username is available.",
      },
    });
    await validateUsername(requestBody, mockRes, "url", {});

    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  test("it should make an API call and return the data from a successful call", async () => {
    const appObj = {
      tokenObject: { ["access_token"]: "token" },
      tokenExpTime: moment().add(4000, "s"),
    };
    const requestBody = {
      body: {
        username: "tomnook42",
      },
    };
    axios.post.mockResolvedValue({
      data: {
        status: 200,
        type: "available-username",
        cardType: "standard",
        message: "This username is available.",
      },
    });

    await validateUsername(requestBody, mockRes, "url", appObj);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "url",
      { username: "tomnook42" },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
        timeout: 10000,
      }
    );
    expect(mockedReturnedJson).toEqual({
      status: 200,
      type: "available-username",
      cardType: "standard",
      message: "This username is available.",
    });
  });

  test("it should make an API call and return data from an unsuccessful call", async () => {
    const appObj = {
      tokenObject: { ["access_token"]: "token" },
      tokenExpTime: moment().add(4000, "s"),
    };
    const requestBody = {
      body: {
        username: "tomnook42",
      },
    };
    axios.post.mockRejectedValue({
      response: {
        status: 400,
        data: {
          type: "unavailable-username",
          cardType: null,
          message: "This username is unavailable. Please try another.",
          detail: {},
        },
      },
    });

    await validateUsername(requestBody, mockRes, "url", appObj);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "url",
      { username: "tomnook42" },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
        timeout: 10000,
      }
    );
    expect(mockedReturnedJson).toEqual({
      type: "unavailable-username",
      cardType: null,
      message: "This username is unavailable. Please try another.",
      detail: {},
    });
  });
});

describe("createPatron", () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test("it should not make an API call if there is no oauth token", async () => {
    const requestBody = {};
    axios.post.mockResolvedValue({});
    await validateUsername(requestBody, mockRes, "url", {});

    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  test("it should make an API call and return the data from a successful call", async () => {
    const appObj = {
      tokenObject: { ["access_token"]: "token" },
      tokenExpTime: moment().add(4000, "s"),
    };
    const requestBody = {
      body: {
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
      },
    };
    axios.post.mockResolvedValue({
      data: {
        status: 200,
        type: "card-granted",
        link: "https://link.com/to/ils/1234567",
        barcode: "111122222222345",
        username: "tomnook42",
        pin: "1234",
        temporary: true,
        message: "The library card will be a standard library card.",
      },
    });

    await createPatron(requestBody, mockRes, "url", appObj);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "url",
      // Note: the following is the result of passing `requestBody.body` into
      // the `constructPatronObject` function which is tested in
      // `formDataUtils.test.ts`.
      {
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
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
        timeout: 10000,
      }
    );
    expect(mockedReturnedJson).toEqual({
      status: 200,
      name: "Tom Nook",
      type: "card-granted",
      link: "https://link.com/to/ils/1234567",
      barcode: "111122222222345",
      username: "tomnook42",
      pin: "1234",
      temporary: true,
      message: "The library card will be a standard library card.",
    });
  });
});
