import * as utils from "../utils";

jest.mock("../CookieUtils", () => {
  return {
    ...jest.requireActual("../CookieUtils.ts"),
    set: jest.fn(),
  };
});
jest.mock("crypto", () => {
  return {
    createHash: jest.fn().mockReturnValue({
      update: () => ({
        digest: () => "666"
      }),
    }),
  };
});
describe("getPageTiles", () => {
  test("it returns text saying there are 5 steps", () => {
    expect(utils.getPageTitles()).toEqual({
      personal: "Step 1 of 5: Personal Information",
      address: "Step 2 of 5: Address",
      workAddress: "Alternate Address",
      verification: "Step 3 of 5: Address Verification",
      account: "Step 4 of 5: Customize Your Account",
      review: "Step 5 of 5: Confirm Your Information",
    });
  });
});

describe("createQueryParams", () => {
  test("it should return an empty string with an empty object", () => {
    expect(utils.createQueryParams({})).toEqual("");
  });

  test("it should return a url query string", () => {
    const data = {
      key1: "value1",
      key2: "value2",
      key3: "value3",
    };
    expect(utils.createQueryParams(data)).toEqual(
      "&key1=value1&key2=value2&key3=value3"
    );
  });
});

describe("createNestedQueryParams", () => {
  test("it should return an empty string with an empty string or type argument", () => {
    expect(utils.createNestedQueryParams({}, "key")).toEqual("");
    expect(utils.createNestedQueryParams({ key: "somevalue" }, "")).toEqual("");
  });

  test("it should return a nested url query string", () => {
    const data = {
      key1: "value1",
      key2: "value2",
      key3: "value3",
    };
    expect(utils.createNestedQueryParams(data, "results")).toEqual(
      `&results=${JSON.stringify(data)}`
    );

    expect(utils.createNestedQueryParams(data, "errors")).toEqual(
      `&errors=${JSON.stringify(data)}`
    );
  });
});

describe("validateCsrfToken", () => {
  test("it returns invalid when no token is set", () => {
    const { csrfToken, csrfTokenValid } = utils.validateCsrfToken({
      cookies: {},
    });
    // We don't really care what it is, just that it's there.
    expect(csrfToken).not.toBeDefined();
    expect(csrfTokenValid).toEqual(false);
  });

  test("it returns token valid when request token matches cookie token", () => {
    const firstCall = utils.validateCsrfToken({
      method: "POST",
      body: { csrfToken: "12345" },
      cookies: {
        "next-auth.csrf-token": "12345|666",
      },
    });
    expect(firstCall.csrfToken).toBeDefined();
    expect(firstCall.csrfTokenValid).toEqual(true);
  });

  test("it returns token invalid when request token does not match cookie token", () => {
    const firstCall = utils.validateCsrfToken({
      method: "POST",
      body: { csrfToken: "12345" },
      cookies: {
        "next-auth.csrf-token": "12345|789",
      },
    });
    expect(firstCall.csrfToken).not.toBeDefined();
    expect(firstCall.csrfTokenValid).toEqual(false);
  });
  //   const second = utils.validateCsrfToken({
  //     cookies: { "next-auth.csrf-token": "wrong-token!" },
  //   });

  //   // The first token should not be reused.
  //   expect(second.csrfToken === firstCall.csrfToken).toEqual(false);
  //   expect(second.csrfTokenValid).toEqual(false);
  // });
});
