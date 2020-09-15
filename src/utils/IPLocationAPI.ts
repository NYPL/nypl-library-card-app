/* eslint-disable @typescript-eslint/camelcase */
import { NextPageContext } from "next";
import requestIp from "request-ip";
import axios from "axios";
import appConfig from "../../appConfig";
import { LocationResponse } from "../interfaces";

interface LocationPoint {
  lat: number;
  long: number;
}

/**
 * IPLocationAPI
 * A class that calls an IP-to-geolocation API and returns a
 * `LocationResponse` object for the app to use.
 */
const IPLocationAPI = () => {
  /**
   * inNYCBounds
   * Check if the user's latitude and longitude coordinate is within the NYC
   * latitude and longitude coordinate bounds.
   * NYC Boundary based on:
   * https://www1.nyc.gov/assets/planning/download/pdf/data-maps/open-data/nybb_metadata.pdf?ver=18c
   */
  const inNYCBounds = ({ lat, long }: LocationPoint): boolean => {
    const bounds = {
      east: -73.699215,
      west: -74.257159,
      north: 40.915568,
      south: 40.495992,
    };
    const eastBound = long < bounds.east;
    const westBound = long > bounds.west;
    let inLong;

    if (bounds.east < bounds.west) {
      inLong = eastBound || westBound;
    } else {
      inLong = eastBound && westBound;
    }

    const inLat = lat > bounds.south && lat < bounds.north;
    return inLat && inLong;
  };

  /**
   * callIpStackAPI
   * Call the IP Stack API with an IP address and get back an object with the
   * user's basic location information.
   */
  const callIpStackAPI = async (ipAddress: string) => {
    const { ipStackKey } = appConfig;
    if (!ipStackKey) {
      throw new Error("No IP_STACK_KEY environment variable set");
    }

    return axios
      .get(`http://api.ipstack.com/${ipAddress}?access_key=${ipStackKey}`)
      .then((response) => {
        // Successful call but no response was returned.
        if (!response.data.type) {
          return null;
        }
        // The API returned an invalid request error response. It returns this
        // instead of returning 404s.
        if (response.data?.success === false) {
          console.log("IP Stack error. Returning `null`.");
          console.log(`Error info: ${response.data?.error.info}`);
          return null;
        }
        return response.data;
      })
      .catch((error) => {
        console.log(`There was an error with the API: ${error.response}`);
        return null;
      });
  };

  /**
   * verifyLocation
   * Verifies that the IP Stack's response object says that the user's IP
   * address is in NYS/NYC.
   */
  const verifyLocation = (response): LocationResponse => {
    const { latitude, longitude, country_name, region_name } = response;
    const userPoint: LocationPoint = { lat: latitude, long: longitude };
    const inUS = country_name === "United States";
    const inNYState = region_name === "New York";
    const inNYCity = inNYCBounds(userPoint);

    return {
      inUS,
      inNYState,
      inNYCity,
    };
  };

  /**
   * getLocationFromIP
   * Use the `requestIp` package to get a user's IP address through different
   * request header properties. If there's an ipAddress, then call the
   * IP/location API to get a user's geolocation and condense it to an
   * app-friendly object.
   */
  const getLocationFromIP = async (
    ctx: NextPageContext
  ): Promise<LocationResponse | undefined> => {
    const ipAddress: string = requestIp.getClientIp(ctx.req);
    let userLocation;

    if (ipAddress) {
      // This is specifically calling IP Stack but any other API can
      // be used here instead.
      const locationResponse = await callIpStackAPI(ipAddress);
      // We received a valid response from the IP/geolocation API but let's
      // condense the response and validate that the user is in NYC/NYS.
      if (locationResponse) {
        userLocation = verifyLocation(locationResponse);
      }
    }

    return userLocation;
  };

  return {
    getLocationFromIP,
    verifyLocation,
    inNYCBounds,
    callIpStackAPI,
  };
};

export default IPLocationAPI();
