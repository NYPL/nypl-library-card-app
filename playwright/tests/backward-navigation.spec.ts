// import { test, expect } from "@playwright/test";
// import { PageManager } from "../pageobjects/page-manager.page";
// import { fillAddress, fillPersonalInfo } from "../utils/form-helper";
// import {
//   SPINNER_TIMEOUT,
//   SUPPORTED_LANGUAGES,
//   TEST_NYC_ADDRESS,
//   TEST_OOS_ADDRESS,
//   TEST_PATRON_INFO,
// } from "../utils/constants";

// for (const { lang, name } of SUPPORTED_LANGUAGES) {
//   test.describe(`E2E: Navigate backward in application in ${name} (${lang})`, () => {
//     let pageManager: PageManager;
//     let appContent: any;

// test("navigates backward to landing without entering info", async ({
//   page,
// }) => {
//   appContent = require(`../../public/locales/${lang}/common.json`);
//   pageManager = new PageManager(page, appContent);

//   await test.step("begins at account page", async () => {
//     await page.goto(`/library-card/account?newCard=true&lang=${lang}`);
//     await expect(pageManager.accountPage.stepHeading).toBeVisible();
//     await expect(pageManager.accountPage.previousButton).toBeVisible();
//     await pageManager.accountPage.previousButton.click();
//   });

//   await test.step("displays address verification page", async () => {
//     await expect(
//       pageManager.addressVerificationPage.stepHeading
//     ).toBeVisible();
//     await expect(
//       pageManager.addressVerificationPage.previousButton
//     ).toBeVisible();
//     await pageManager.addressVerificationPage.previousButton.click();
//   });

//   await test.step("displays address page", async () => {
//     await expect(pageManager.addressPage.stepHeading).toBeVisible();
//     await expect(pageManager.addressPage.previousButton).toBeVisible();
//     await pageManager.addressPage.previousButton.click();
//   });

//   await test.step("displays personal information page", async () => {
//     await expect(pageManager.personalPage.stepHeading).toBeVisible();
//     await expect(pageManager.personalPage.previousButton).toBeVisible();
//     await pageManager.personalPage.previousButton.click();
//   });

//   await test.step("displays landing page", async () => {
//     await expect(pageManager.landingPage.applyHeading).toBeVisible();
//   });
// });

// test(`retains user-entered info when navigating backward (${lang})`, async ({
//   page,
// }) => {
//   appContent = require(`../../public/locales/${lang}/common.json`);
//   pageManager = new PageManager(page, appContent);

//   await test.step("enters personal information", async () => {
//     await page.goto("/library-card/personal?newCard=true");
//     await expect(pageManager.personalPage.stepHeading).toBeVisible();
//     await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
//     await pageManager.personalPage.receiveInfoCheckbox.click();
//     await pageManager.personalPage.nextButton.click();
//   });

//   await test.step("enters home address", async () => {
//     await expect(pageManager.addressPage.stepHeading).toBeVisible();
//     await fillAddress(pageManager.addressPage, TEST_OOS_ADDRESS);
//     await pageManager.addressPage.nextButton.click();
//   });

//   await test.step("enters alternate address", async () => {
//     await expect(
//       pageManager.alternateAddressPage.stepHeading
//     ).toBeVisible();
//     await fillAddress(pageManager.alternateAddressPage, TEST_NYC_ADDRESS);
//     await pageManager.alternateAddressPage.nextButton.click();
//     await expect(pageManager.alternateAddressPage.spinner).not.toBeVisible({
//       timeout: SPINNER_TIMEOUT,
//     });
//   });

//   await test.step("confirms address verification", async () => {
//     await expect(
//       pageManager.addressVerificationPage.stepHeading
//     ).toBeVisible();
//     await pageManager.addressVerificationPage
//       .getHomeAddressOption(TEST_OOS_ADDRESS.street)
//       .check();
//     await pageManager.addressVerificationPage
//       .getAlternateAddressOption(TEST_NYC_ADDRESS.street)
//       .check();
//     await pageManager.addressVerificationPage.nextButton.click();
//     await expect(
//       pageManager.addressVerificationPage.spinner
//     ).not.toBeVisible({ timeout: SPINNER_TIMEOUT });
//   });

//   await test.step("displays account page", async () => {
//     await expect(pageManager.accountPage.stepHeading).toBeVisible();
//     await pageManager.accountPage.previousButton.click();
//   });

//   await test.step("displays user-entered info on address verification page", async () => {
//     await expect(
//       pageManager.addressVerificationPage.stepHeading
//     ).toBeVisible();
//     await expect(
//       pageManager.addressVerificationPage.getHomeAddressOption(
//         TEST_OOS_ADDRESS.street
//       )
//     ).toBeChecked();
//     await expect(
//       pageManager.addressVerificationPage.getAlternateAddressOption(
//         TEST_NYC_ADDRESS.street
//       )
//     ).toBeChecked();
//     await pageManager.addressVerificationPage.previousButton.click();
//   });

//   await test.step("displays user-entered info on address page", async () => {
//     await expect(pageManager.addressPage.stepHeading).toBeVisible();
//     await expect(pageManager.addressPage.streetAddressInput).toHaveValue(
//       TEST_OOS_ADDRESS.street
//     );
//     await expect(pageManager.addressPage.apartmentSuiteInput).toHaveValue(
//       TEST_OOS_ADDRESS.apartmentSuite
//     );
//     await expect(pageManager.addressPage.cityInput).toHaveValue(
//       TEST_OOS_ADDRESS.city
//     );
//     await expect(pageManager.addressPage.stateInput).toHaveValue(
//       TEST_OOS_ADDRESS.state
//     );
//     await expect(pageManager.addressPage.postalCodeInput).toHaveValue(
//       TEST_OOS_ADDRESS.postalCode
//     );
//     await pageManager.addressPage.previousButton.click();
//   });

//   await test.step("displays user-entered info on personal information page", async () => {
//     await expect(pageManager.personalPage.stepHeading).toBeVisible();
//     await expect(pageManager.personalPage.firstNameInput).toHaveValue(
//       TEST_PATRON.firstName
//     );
//     await expect(pageManager.personalPage.lastNameInput).toHaveValue(
//       TEST_PATRON.lastName
//     );
//     await expect(pageManager.personalPage.dateOfBirthInput).toHaveValue(
//       TEST_PATRON.dateOfBirth
//     );
//     await expect(pageManager.personalPage.emailInput).toHaveValue(
//       TEST_PATRON.email
//     );
//     await expect(
//       pageManager.personalPage.receiveInfoCheckbox
//     ).not.toBeChecked();
//   });
// });
//   });
// }
