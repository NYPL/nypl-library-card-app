import { NextPageContext } from "next";
import requestIp from "request-ip";
import axios from "axios";
import * as appConfig from "../../appConfig";
import { LocationResponse } from "../interfaces";
import logger from "../logger";

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
      console.warn("No IP_STACK_KEY environment variable set");
      return null;
    }

    return axios
      .get(`http://api.ipstack.com/${ipAddress}?access_key=${ipStackKey}`)
      .then((response) => {
        if (!response.data.type) {
          logger.warning("IP Stack returned no data", { ipAddress });
          return null;
        }
        if (response.data?.success === false) {
          logger.error("IP Stack returned an error response", {
            info: response.data?.error?.info,
          });
          return null;
        }
        return response.data;
      })
      .catch((error) => {
        logger.error("IP Stack API request failed", {
          message: error instanceof Error ? error.message : String(error),
        });
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
   * getLocationString
   * Converts a user location response from geolocating their location based on
   * their IP address, to a value to use in the UI. The logic branches out from
   * NYC to the larger US area. The default is just an empty string to signify
   * that no UI option should be pre-selected.
   */
  const getLocationString = (
    userLocationResponse: Partial<LocationResponse>
  ) => {
    // For a user in NYC, the location response sets "true" for all the
    // properties, since if you're in NYC then you must be in NYS and in US. So
    // it's possible to not be in NYC but be in NYS and in US. This logic
    // branches out so it returns the most detailed location first.
    if (userLocationResponse?.inNYCity) {
      return "nyc";
    } else if (userLocationResponse?.inNYState) {
      return "nys";
    } else if (userLocationResponse?.inUS) {
      return "us";
    }
    // The default value is an empty string so that
    // no option is selected by default.
    return "";
  };

  /**
   * getLocationFromIP
   * Use the `requestIp` package to get a user's IP address through different
   * request header properties. If there's an ipAddress, then call the
   * IP/location API to get a user's geolocation and condense it to an
   * app-friendly object.
   */
  const getLocationFromIP = async (ctx: NextPageContext): Promise<string> => {
    logger.info("Getting location from IP");
    const ipAddress: string = requestIp.getClientIp(ctx.req);

    if (!ipAddress) {
      logger.warning("No IP address found in request");
      return "";
    }

    const locationResponse = await callIpStackAPI(ipAddress);
    if (!locationResponse) {
      logger.warning("No location response from IP Stack API", { ipAddress });
      return "";
    }

    const userLocationObject = verifyLocation(locationResponse);
    const userLocation = getLocationString(userLocationObject);

    logger.info("Returning user location from IP Stack", { userLocation });
    return userLocation;
  };

  return {
    getLocationFromIP,
    getLocationString,
    verifyLocation,
    inNYCBounds,
    callIpStackAPI,
  };
};

export default IPLocationAPI();
