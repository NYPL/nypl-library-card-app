import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";

import {
  fillPersonalInfo,
  fillAddress,
  fillAccountInfo,
} from "../utils/form-helper";
import {
  SPINNER_TIMEOUT,
  TEST_ACCOUNT,
  TEST_NYS_ADDRESS,
  TEST_PATRON,
  PAGE_ROUTES,
  PATRON_TYPES,
} from "../utils/constants";
import {
  getPatronID,
  getPatronData,
  deletePatron,
} from "../utils/sierra-api-utils";
import { createFuzzyMatcher, formatSierraDate } from "../utils/formatter";

test.describe("E2E: Complete application with Sierra API integration", () => {
  let scrapedBarcode: string | null = null;

  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({
      "x-client-ip": "65.209.66.130",
      "x-forwarded-for": "65.209.66.130",
    });
  });

  test.afterAll("deletes patron", async () => {
    if (scrapedBarcode) {
      try {
        const patronID = await getPatronID(scrapedBarcode);

        if (patronID) {
          await deletePatron(patronID);
        }
      } catch (error) {
        console.error("Error during patron deletion:", error);
      }
    }
  });

  test("displays patron information on congrats page", async ({ page }) => {
    const pageManager = new PageManager(page);

    await test.step("begins at landing", async () => {
      await page.goto(PAGE_ROUTES.LANDING);
      await expect(pageManager.landingPage.applyHeading).toBeVisible();
      await pageManager.landingPage.getStartedButton.click();
    });

    await test.step("enters personal information", async () => {
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
      await pageManager.personalPage.nextButton.click();
    });

    await test.step("enters home address", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await fillAddress(pageManager.addressPage, TEST_NYS_ADDRESS);
      await pageManager.addressPage.nextButton.click();
      await expect(pageManager.addressPage.spinner).not.toBeVisible({
        timeout: SPINNER_TIMEOUT,
      });
    });

    await test.step("enters alternate address", async () => {
      await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
      await pageManager.alternateAddressPage.nextButton.click();
      await expect(pageManager.alternateAddressPage.spinner).not.toBeVisible({
        timeout: SPINNER_TIMEOUT,
      });
    });

    await test.step("address verfication", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeading
      ).toBeVisible();
      await pageManager.addressVerificationPage.nextButton.click();
    });
    await test.step("enters account information", async () => {
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
      await pageManager.accountPage.nextButton.click();
    });

    await test.step("displays personal information on review page", async () => {
      await expect(pageManager.reviewPage.stepHeading).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_PATRON.firstName)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_PATRON.lastName)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_PATRON.dateOfBirth)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_PATRON.email)
      ).toBeVisible();
      await expect(pageManager.reviewPage.receiveInfoChoice).toHaveText("Yes");
    });

    await test.step("displays home on review page", async () => {
      await expect(
        pageManager.reviewPage.getText(TEST_NYS_ADDRESS.street)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_NYS_ADDRESS.city)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_NYS_ADDRESS.state)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_NYS_ADDRESS.postalCode)
      ).toBeVisible();
    });

    await test.step("displays account information on review page", async () => {
      await expect(
        pageManager.reviewPage.getText(TEST_ACCOUNT.username)
      ).toBeVisible();
      await expect(pageManager.reviewPage.showPasswordLabel).toBeVisible();
      await pageManager.reviewPage.showPasswordLabel.check();
      await expect(
        pageManager.reviewPage.getText(TEST_ACCOUNT.password)
      ).toBeVisible();
    });

    await test.step("submits application", async () => {
      await expect(pageManager.reviewPage.submitButton).toBeVisible();
      await pageManager.reviewPage.submitButton.click();
    });

    await test.step("displays headings and banner on congrats page", async () => {
      await expect(pageManager.congratsPage.mainHeading).toBeVisible();
      await expect(pageManager.congratsPage.stepHeading).toBeVisible();
      await expect(pageManager.congratsPage.locationsLink).toBeVisible();
      await expect(
        pageManager.congratsPage.photoIdAndProofOfAddressLink
      ).toBeVisible();
      await expect(pageManager.congratsPage.readOrListenOnGo).toBeVisible();
      await expect(pageManager.congratsPage.loginLink).toBeVisible();
      await expect(pageManager.congratsPage.nyplLocationLink).toBeVisible();
      await expect(pageManager.congratsPage.findOutLibraryLink).toBeVisible();
      await expect(pageManager.congratsPage.discoverLink).toBeVisible();
    });

    await test.step("displays generated library card on congrats page", async () => {
      const fullName = `${TEST_PATRON.firstName} ${TEST_PATRON.lastName}`;
      await expect(pageManager.congratsPage.memberNameHeading).toBeVisible();
      await expect(pageManager.congratsPage.memberName).toHaveText(fullName);
      await expect(pageManager.congratsPage.issuedDateHeading).toBeVisible();
      await expect(pageManager.congratsPage.issuedDate).toBeVisible();
      await expect(pageManager.congratsPage.patronBarcodeNumber).toBeVisible();
      await expect(pageManager.congratsPage.patronBarcodeNumber).toContainText(
        pageManager.congratsPage.EXPECTED_BARCODE_PREFIX
      );
    });

    await test.step("retrieves barcode from congrats page", async () => {
      scrapedBarcode =
        await pageManager.congratsPage.patronBarcodeNumber.textContent();
      expect(scrapedBarcode).not.toBeNull();
    });

    await test.step("verify patron data on sierra database", async () => {
      const patronID = await getPatronID(scrapedBarcode);
      const patronData = await getPatronData(patronID);

      expect(patronData, "API response must be a valid object").toEqual(
        expect.objectContaining({
          names: expect.any(Array),
          emails: expect.any(Array),
          addresses: expect.any(Array),
          birthDate: expect.any(String),
          patronType: expect.any(Number),
        })
      );

      expect(
        patronData.names.length,
        "Names array should not be empty"
      ).toBeGreaterThan(0);
      expect(
        patronData.birthDate,
        "Birthdate should not be empty"
      ).toBeTruthy();
      expect(
        patronData.emails.length,
        "Emails array should not be empty"
      ).toBeGreaterThan(0);
      expect(
        patronData.addresses.length,
        "Addresses array should not be empty"
      ).toBeGreaterThan(0);

      const expectedName =
        `${TEST_PATRON.lastName}, ${TEST_PATRON.firstName}`.toUpperCase();
      const expectedDOB = formatSierraDate(TEST_PATRON.dateOfBirth);
      const expectedEmail = TEST_PATRON.email.toLowerCase();
      const patronEmails = patronData.emails?.map((email) =>
        email.toLowerCase()
      );

      const expectedAddress = createFuzzyMatcher([
        TEST_NYS_ADDRESS.street,
        TEST_NYS_ADDRESS.apartmentSuite,
        TEST_NYS_ADDRESS.city,
        TEST_NYS_ADDRESS.state,
        TEST_NYS_ADDRESS.postalCode,
      ]);

      const actualAddressText = (patronData.addresses?.[0]?.lines || []).join(
        " "
      );
      const actualName = patronData.names?.[0].toUpperCase();

      expect(actualName).toContain(expectedName);
      expect(patronData.birthDate).toBe(expectedDOB);
      expect(actualAddressText).toMatch(expectedAddress);
      expect(patronEmails).toContain(expectedEmail);
      expect(patronData.patronType).toBe(PATRON_TYPES.PATRON_TYPE_8);
    });
  });
});
