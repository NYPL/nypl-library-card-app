/* eslint-disable */
import IPLocationAPI from "../IPLocationAPI";
const requestIp = require("request-ip");
const axios = require("axios");

jest.mock("axios");
jest.mock("request-ip");

describe("IPLocationAPI", () => {
  beforeEach(() => {
    axios.mockClear();
    requestIp.getClientIp.mockClear();
  });

  // Check the function to see the NYC bounds coordinates.
  describe("inNYCBounds", () => {
    const { inNYCBounds } = IPLocationAPI;

    it("should return false if the coordinates are outside NYC", () => {
      const userCoords = { lat: 41.111, long: -74.4 };
      expect(inNYCBounds(userCoords)).toEqual(false);
    });

    it("should return true if the coordinates are outside NYC", () => {
      const userCoords = { lat: 40.78, long: -73.81 };
      expect(inNYCBounds(userCoords)).toEqual(true);
    });
  });

  describe("verifyLocation", () => {
    let { verifyLocation } = IPLocationAPI;

    it("returns an object for users outside US", () => {
      const outsideUSResponse = {
        latitude: 44,
        longitude: -76,
        country_name: "Canada",
        region_name: "Ontario",
      };

      expect(verifyLocation(outsideUSResponse)).toEqual({
        inUS: false,
        inNYState: false,
        inNYCity: false,
      });
    });
    it("returns an object for users in US but outside NYS", () => {
      const outsideUSResponse = {
        latitude: 44,
        longitude: -76,
        country_name: "United States",
        region_name: "New Jersey",
      };

      expect(verifyLocation(outsideUSResponse)).toEqual({
        inUS: true,
        inNYState: false,
        inNYCity: false,
      });
    });
    it("returns an object for users in NYC", () => {
      const outsideUSResponse = {
        latitude: 40.78,
        longitude: -73.81,
        country_name: "United States",
        region_name: "New York",
      };

      expect(verifyLocation(outsideUSResponse)).toEqual({
        inUS: true,
        inNYState: true,
        inNYCity: true,
      });
    });
  });

  describe("callIpStackAPI", () => {
    const { callIpStackAPI } = IPLocationAPI;

    it("calls the API with the IP address and secret key", async () => {
      axios.get.mockImplementation(() => Promise.resolve({}));
      const ipAddress = "ip-address";
      await callIpStackAPI(ipAddress);

      // The access_key is defined in `jest.config.js`.
      expect(axios.get).toHaveBeenCalledWith(
        `http://api.ipstack.com/${ipAddress}?access_key=some-key`
      );
    });

    it("returns null if there's an error with the API", async () => {
      axios.get.mockImplementation(() =>
        Promise.reject({ response: "some error" })
      );

      expect(await callIpStackAPI("ip-address")).toEqual(null);
    });

    it("returns null if the API returned an error", async () => {
      axios.get.mockImplementation(() =>
        Promise.resolve({
          success: false,
          error: {
            code: 101,
            type: "missing_access_key",
            info:
              "You have not supplied an API Access Key. [Required format: access_key=YOUR_ACCESS_KEY]",
          },
        })
      );

      expect(await callIpStackAPI("ip-address")).toEqual(null);
    });

    it("returns null if the API returned a response with no data type", async () => {
      axios.get.mockImplementation(() => Promise.resolve({ type: undefined }));

      expect(await callIpStackAPI("ip-address")).toEqual(null);
    });

    it("returns data on a successful response", async () => {
      const validResponse = {
        data: {
          type: "ipv4",
          success: true,
          latitude: 40.78,
          longitude: -73.81,
          country_name: "United States",
          region_name: "New York",
          city: "New York",
          zip: "10018",
        },
      };
      axios.get.mockImplementation(() => Promise.resolve(validResponse));

      expect(await callIpStackAPI("ip-address")).toEqual(validResponse.data);
    });
  });

  describe("getLocationFromIP", () => {
    const { getLocationFromIP } = IPLocationAPI;

    it("should return null if the API call failed", async () => {
      requestIp.getClientIp.mockImplementation(() => "ip-address");
      axios.get.mockImplementation(() =>
        Promise.reject({ response: "some error" })
      );

      const userLocation = await getLocationFromIP({ req: {} } as any);
      expect(userLocation).toEqual(undefined);
    });

    it("should return the updated user location object", async () => {
      requestIp.getClientIp.mockImplementation(() => "ip-address");
      const validResponse = {
        data: {
          type: "ipv4",
          success: true,
          latitude: 40.78,
          longitude: -73.81,
          country_name: "United States",
          region_name: "New York",
          city: "New York",
          zip: "10018",
        },
      };
      axios.get.mockImplementation(() => Promise.resolve(validResponse));
      // In the real world, the `ctx.req` object has headers and multiple
      // ways to get the IP address.
      const userLocation = await getLocationFromIP({ req: {} } as any);
      expect(userLocation).toEqual({
        inUS: true,
        inNYState: true,
        inNYCity: true,
      });
    });
  });
});
