import * as csrfUtils from "../csrfUtils";

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
        digest: () => "666",
      }),
    }),
  };
});

describe("validateCsrfToken", () => {
  test("it returns invalid when no token is set", () => {
    const csrfTokenValid = csrfUtils.validateCsrfToken({
      cookies: {},
    });
    // We don't really care what it is, just that it's there.
    expect(csrfTokenValid).toEqual(false);
  });

  test("it returns token valid when request token matches cookie token", () => {
    const isValid = csrfUtils.validateCsrfToken({
      method: "POST",
      body: { csrfToken: "12345" },
      cookies: {
        "nypl.csrf-token": "12345|666",
      },
    });

    expect(isValid).toEqual(true);
  });

  test("it returns token invalid when request token does not match cookie token", () => {
    const isValid = csrfUtils.validateCsrfToken({
      method: "POST",
      body: { csrfToken: "12345" },
      cookies: {
        "nypl.csrf-token": "12345|789",
      },
    });

    expect(isValid).toEqual(false);
  });
});
