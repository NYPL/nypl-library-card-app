import * as utils from "../utils";

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
