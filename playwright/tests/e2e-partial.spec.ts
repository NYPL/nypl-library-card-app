// import { test, expect } from "@playwright/test";
// import { PageManager } from "../pageobjects/page-manager.page";
// import { fillAccountInfo, fillAddress } from "../utils/form-helper";

// test("displays error when address is too long", async ({ page }) => {
//   const pageManager = new PageManager(page);
//   const invalidStreet = "A".repeat(100);

//   await test.step("enters invalid home address", async () => {
//     await page.goto("/library-card/location?newCard=true");
//     await expect(pageManager.addressPage.stepHeading).toBeVisible();
//     await fillAddress(pageManager.addressPage, {
//       street: invalidStreet,
//       apartmentSuite: "1",
//       city: "City",
//       state: "NY",
//       postalCode: "12345",
//     });
//     await pageManager.addressPage.nextButton.click();
//   });

//   await test.step("skips alternate address", async () => {
//     await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
//     await pageManager.alternateAddressPage.nextButton.click();
//   });

//   await test.step("confirms address verification", async () => {
//     await expect(pageManager.addressVerificationPage.stepHeading).toBeVisible();
//     await pageManager.addressVerificationPage
//       .getHomeAddressOption(invalidStreet)
//       .check();
//     await pageManager.addressVerificationPage.nextButton.click();
//   });

//   await test.step("enters account information", async () => {
//     await expect(pageManager.accountPage.stepHeading).toBeVisible();
//     await fillAccountInfo(pageManager.accountPage);
//     await pageManager.accountPage.nextButton.click();
//   });

//   await test.step("displays error on review page", async () => {
//     await expect(pageManager.reviewPage.stepHeading).toBeVisible();
//     await pageManager.reviewPage.submitButton.click();
//     await expect(pageManager.reviewPage.streetAddressError).toBeVisible();
//   });
// });
