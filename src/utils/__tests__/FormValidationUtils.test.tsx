import { findLibraryCode, findLibraryName } from "../formDataUtils";

describe("findLibraryCode", () => {
  // `eb` is the default value describing the "E-Branch" or "SimplyE" library.
  test("it returns `eb` as the default value", () => {
    expect(findLibraryCode()).toEqual("eb");
  });

  test("it returns the value code for a library name", () => {
    // Spot checking random libraries. Check "/src/data/ilLibraryList.ts" for a
    // full mapping of library name to library code.
    expect(findLibraryCode("Melrose Branch")).toEqual("me");
    expect(findLibraryCode("Pelham Bay Branch")).toEqual("pm");
    expect(findLibraryCode("West Farms Branch")).toEqual("wf");
  });
});

describe("findLibraryName", () => {
  // "SimplyE" library is the default.
  test("it returns `eb` as the default value", () => {
    expect(findLibraryName()).toEqual("SimplyE");
  });

  test("it returns the value code for a library name", () => {
    // Spot checking random libraries. Check "/src/data/ilLibraryList.ts" for a
    // full mapping of library code to library name.
    expect(findLibraryName("ew")).toEqual("Edenwald Branch");
    expect(findLibraryName("ht")).toEqual("Countee Cullen Branch");
    expect(findLibraryName("se")).toEqual("Seward Park Branch");
  });
});
