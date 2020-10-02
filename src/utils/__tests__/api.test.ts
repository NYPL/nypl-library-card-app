import { constructApiHeaders } from "../api";

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
