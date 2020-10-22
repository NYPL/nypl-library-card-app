import { getPageTitles } from "../utils";

describe("getPageTiles", () => {
  test("it returns text saying there are 5 steps if the user is in nyc", () => {
    const userLocation = "nyc";

    expect(getPageTitles(userLocation)).toEqual({
      personal: "Step 1 of 5: Personal Information",
      address: "Step 2 of 5: Location",
      workAddress: "",
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
