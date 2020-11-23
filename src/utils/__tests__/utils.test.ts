import {
  getPageTitles,
  createQueryParams,
  createNestedQueryParams,
  getCsrfToken,
} from "../utils";
import cookieUtils from "../CookieUtils";

jest.mock("../CookieUtils");

describe("getPageTiles", () => {
  test("it returns text saying there are 5 steps if the user is in nyc", () => {
    const userLocation = "nyc";

    expect(getPageTitles(userLocation)).toEqual({
      personal: "Step 1 of 5: Personal Information",
      address: "Step 2 of 5: Location",
      workAddress: "Work Address",
      verification: "Step 3 of 5: Address Verification",
      account: "Step 4 of 5: Create Your Account",
      review: "Step 5 of 5: Review Your Information",
    });
  });

  test("it returns text saying there are 6 steps if the user is not in nyc", () => {
    const sixStepTitles = {
      personal: "Step 1 of 6: Personal Information",
      address: "Step 2 of 6: Location",
      workAddress: "Step 3 of 6: Work Address",
      verification: "Step 4 of 6: Address Verification",
      account: "Step 5 of 6: Create Your Account",
      review: "Step 6 of 6: Review Your Information",
    };
    const userLocationEmpty = "";
    const userLocationUS = "us";
    const userLocationNYS = "nys";

    expect(getPageTitles(userLocationEmpty)).toEqual(sixStepTitles);
    expect(getPageTitles(userLocationUS)).toEqual(sixStepTitles);
    expect(getPageTitles(userLocationNYS)).toEqual(sixStepTitles);
  });
});

describe("createQueryParams", () => {
  test("it should return an empty string with an empty object", () => {
    expect(createQueryParams({})).toEqual("");
  });

  test("it should return a url query string", () => {
    const data = {
      key1: "value1",
      key2: "value2",
      key3: "value3",
    };
    expect(createQueryParams(data)).toEqual(
      "&key1=value1&key2=value2&key3=value3"
    );
  });
});

describe("createNestedQueryParams", () => {
  test("it should return an empty string with an empty string or type argument", () => {
    expect(createNestedQueryParams({}, "key")).toEqual("");
    expect(createNestedQueryParams({ key: "somevalue" }, "")).toEqual("");
  });

  test("it should return a nested url query string", () => {
    const data = {
      key1: "value1",
      key2: "value2",
      key3: "value3",
    };
    expect(createNestedQueryParams(data, "results")).toEqual(
      `&results=${JSON.stringify(data)}`
    );

    expect(createNestedQueryParams(data, "errors")).toEqual(
      `&errors=${JSON.stringify(data)}`
    );
  });
});

describe("getCsrfToken", () => {
  beforeAll(() => {
    // We don't actually want to set any cookies so mock this.
    cookieUtils.set = jest.fn(() => "ok");
  });

  test("it returns a new token which is not valid since it's new and not compared to an existing token", () => {
    const { csrfToken, csrfTokenValid } = getCsrfToken({ cookies: {} }, {});
    // We don't really care what it is, just that it's there.
    expect(csrfToken).toBeDefined();
    expect(csrfTokenValid).toEqual(false);
  });

  // TODO: it's hard to test when the true case happens because the secret is
  // private in the function, by design and security.
  test("it returns a false token validation", () => {
    const firstCall = getCsrfToken({ cookies: {} }, {});

    expect(firstCall.csrfToken).toBeDefined();
    expect(firstCall.csrfTokenValid).toEqual(false);

    const second = getCsrfToken(
      {
        cookies: { "next-auth.csrf-token": "wrong-token!" },
      },
      {}
    );

    // The first token should not be reused.
    expect(second.csrfToken === firstCall.csrfToken).toEqual(false);
    expect(second.csrfTokenValid).toEqual(false);
  });
});
