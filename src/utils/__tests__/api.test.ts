/* eslint-disable @typescript-eslint/no-var-requires */
import {
  constructApiHeaders,
  isTokenExpiring,
  initializeAppAuth,
  axiosAddressPost,
  validateAddress,
  validateUsername,
  callPatronAPI,
} from "../api";
const axios = require("axios");
import moment from "moment";

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
      status: 400,
      type: "no-access-token",
      title: "No Access Token",
      detail: "No access_token obtained from OAuth Service.",
      error: {
        oauth: "No access_token obtained from OAuth Service.",
      },
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
    const addressRequest = { address, isWorkAddress };
    axios.post.mockResolvedValue({
      data: {
        status: 200,
        address,
      },
    });

    const result = await axiosAddressPost(
      addressRequest,
      "token",
      "addressUrl"
    );

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("addressUrl", addressRequest, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
      timeout: 10000,
    });
    expect(result).toEqual({
      status: 200,
      success: true,
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
    const addressRequest = { address, isWorkAddress };
    axios.post.mockRejectedValue({
      response: {
        status: 400,
        data: { address },
      },
    });
    const result = await axiosAddressPost(
      addressRequest,
      "token",
      "addressUrl"
    );

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("addressUrl", addressRequest, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
      timeout: 10000,
    });
    expect(result).toEqual({
      status: 400,
      success: false,
      address,
    });
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
    const req = {
      body: {
        address: {
          line1: "111 1st St.",
          city: "New York",
          state: "NY",
          zip: "11018",
        },
        isWorkAddress: false,
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
        message: "This will result in a standard card.",
        reason: "",
      },
    });

    await validateAddress(req, mockRes, appObj);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(mockedReturnedJson).toEqual({
      address: {
        line1: "111 1st St.",
        city: "New York",
        state: "NY",
        zip: "11018",
        isResidential: true,
        hasBeenValidated: true,
      },
      addresses: undefined,
      detail: "This will result in a standard card.",
      reason: "",
      success: true,
      cardType: "standard",
    });
  });

  test("it does not make an API call without an access token", async () => {
    const req = {
      body: {
        formData: {},
      },
    };
    axios.post.mockResolvedValue({});

    await validateAddress(req, mockRes, {});

    expect(axios.post).toHaveBeenCalledTimes(0);
  });
});

describe("validateUsername", () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test("it should not make an API call if there is no oauth token", async () => {
    const req = {
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
    await validateUsername(req, mockRes, "url", {});

    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  test("it should make an API call and return the data from a successful call", async () => {
    const appObj = {
      tokenObject: { ["access_token"]: "token" },
      tokenExpTime: moment().add(4000, "s"),
    };
    const req = {
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

    await validateUsername(req, mockRes, "url", appObj);

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
    const req = {
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

    await validateUsername(req, mockRes, "url", appObj);

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
      status: 400,
      type: "unavailable-username",
      cardType: null,
      message: "This username is unavailable. Please try another.",
      detail: {},
    });
  });
});

describe("callPatronAPI", () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test("it should not make an API call if there is no oauth token", async () => {
    const req = {};
    axios.post.mockResolvedValue({});

    try {
      await callPatronAPI(req, "url", {});
    } catch (error) {
      expect(error.type).toEqual("no-access-token");
      expect(error.detail).toEqual(
        "The access token could not be generated before calling the Card Creator API."
      );
    }

    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  test("it should make an API call and return the data from a successful call", async () => {
    const appObj = {
      tokenObject: { ["access_token"]: "token" },
      tokenExpTime: moment().add(4000, "s"),
    };
    const requestData = {
      ecommunicationsPref: true,
      policyType: "webApplicant",
      firstName: "Tom",
      lastName: "Nook",
      birthdate: "01/01/1988",
      email: "tomnook@nypl.org",
      preferredLanguage: "en",
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
    axios.post.mockResolvedValue({
      data: {
        status: 200,
        type: "card-granted",
        link: "https://link.com/to/ils/1234567",
        barcode: "111122222222345",
        username: "tomnook42",
        password: "MyLib1731@!",
        temporary: true,
        message: "The library card will be a standard library card.",
      },
    });

    const response = await callPatronAPI(requestData, "url", appObj);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "url",
      // Note: the following is the result of passing `req.body` into
      // the `constructPatronObject` function which is tested in
      // `formDataUtils.test.ts`.
      {
        firstName: "Tom",
        lastName: "Nook",
        email: "tomnook@nypl.org",
        birthdate: "01/01/1988",
        ageGate: undefined,
        preferredLanguage: "en",
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
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
        timeout: 10000,
      }
    );
    expect(response).toEqual({
      status: 200,
      name: "Tom Nook",
      type: "card-granted",
      link: "https://link.com/to/ils/1234567",
      barcode: "111122222222345",
      username: "tomnook42",
      password: "MyLib1731@!",
      temporary: true,
      message: "The library card will be a standard library card.",
    });
  });
});
