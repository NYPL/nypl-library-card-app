import isEmpty from "lodash/isEmpty";

import ilsLibraryList from "../data/ilsLibraryList";
import config from "../../appConfig";

/**
 * findLibraryCode
 * Find the code for a library by searching for its name in the `ilsLibraryList`
 * array. If no object is found, return the default value of "eb" for
 * "e-branch" or "simplye" (interchangeable names);
 * @param libraryName Name of library to find in the list.
 */
function findLibraryCode(libraryName?: string) {
  const library = ilsLibraryList.find(
    (library) => library.label === libraryName
  );
  return library?.value || "eb";
}

/**
 * findLibraryName
 * Find the name for a library by searching for its code in the `ilsLibraryList`
 * array. If no object is found, return the default value of "eb" for
 * "e-branch" or "simplye" (interchangeable names);
 * @param libraryCode Name of library to find in the list.
 */
function findLibraryName(libraryCode?: string) {
  const library = ilsLibraryList.find(
    (library) => library.value === libraryCode
  );
  return library?.label || "SimplyE";
}

const getPatronAgencyType = (agencyTypeParam) => {
  const { agencyType } = config;
  return !isEmpty(agencyTypeParam) && agencyTypeParam.toLowerCase() === "nys"
    ? agencyType.nys
    : agencyType.default;
};

const getLocationValue = (location: string): string => {
  const locationMap = {
    nyc: "New York City (All five boroughs)",
    nys: "New York State (Outside NYC)",
    us: "United States (Visiting NYC)",
  };
  return locationMap[location];
};

export {
  findLibraryCode,
  findLibraryName,
  getPatronAgencyType,
  getLocationValue,
};
