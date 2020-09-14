/* eslint-disable @typescript-eslint/camelcase */
import requestIp from "request-ip";
import axios from "axios";
import appConfig from "../../appConfig";

class IPLocationAPI {
  inNYCBounds({ lat, long }) {
    // NYC Boundary based on:
    // https://www1.nyc.gov/assets/planning/download/pdf/data-maps/open-data/nybb_metadata.pdf?ver=18c
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
  }

  async callIpStack(ipAddress) {
    const { ipStackKey } = appConfig;

    return axios
      .get(`http://api.ipstack.com/${ipAddress}?access_key=${ipStackKey}`)
      .then((response) => {
        // Successful call but no response was returned.
        if (!response.data.type) {
          return null;
        }
        // The API returned an error response. Something happened with the
        // call.
        if (response.data?.success === false) {
          // { success: false,
          //   error:
          //    { code: 101,
          //      type: 'missing_access_key',
          //      info:
          //       'You have not supplied an API Access Key.
          //       [Required format: access_key=YOUR_ACCESS_KEY]' } }
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
  }

  verifyLocation(response) {
    const {
      latitude,
      longitude,
      country_name,
      region_name,
      // city,
      // zip,
    } = response;
    const userPoint = { lat: latitude, long: longitude };
    const inUS = country_name === "United States";
    const inNYState = region_name === "New York";
    const inNYCBounds = this.inNYCBounds(userPoint);

    return {
      inUS,
      inNYState,
      inNYCBounds,
    };
  }

  async getLocationFromIP(ctx) {
    const ipAddress = requestIp.getClientIp(ctx.req);
    let userLocation;

    if (ipAddress) {
      const locationResponse = await this.callIpStack(ipAddress);
      if (locationResponse) {
        userLocation = this.verifyLocation(locationResponse);
      }
    }

    return userLocation;
  }
}

export default new IPLocationAPI();
