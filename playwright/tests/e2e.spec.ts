import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import {
  fillPersonalInfo,
  fillHomeAddress,
  fillAlternateAddress,
  fillAccountInfo,
} from "../utils/form-helper";
import {
  TEST_ALTERNATE_ADDRESS,
  TEST_CUSTOMIZE_ACCOUNT,
  TEST_HOME_ADDRESS,
  TEST_PATRON_INFO,
} from "../utils/constants";

import {
  getPatronID,
  getPatronData,
  deletePatron,
} from "../utils/sierra-api-utils";

import { createFuzzyMatcher, formatSierraDate } from "../utils/formatter";

test.describe("E2E: Complete application with Sierra API integration", () => {
  let scrapedBarcode: string | null = null;

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
      await page.goto("/library-card/new?newCard=true");
      await expect(pageManager.landingPage.applyHeading).toBeVisible();
      await pageManager.landingPage.getStartedButton.click();
    });

    await test.step("enters personal information", async () => {
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await fillPersonalInfo(pageManager.personalPage);
      await pageManager.personalPage.nextButton.click();
    });

    await test.step("enters home address", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await fillHomeAddress(pageManager.addressPage);
      await pageManager.addressPage.nextButton.click();
    });

    await test.step("enters alternate address", async () => {
      await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
      await fillAlternateAddress(pageManager.alternateAddressPage);
      await pageManager.alternateAddressPage.nextButton.click();
    });

    await test.step("selects home and alternate addresses", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeading
      ).toBeVisible();
      await pageManager.addressVerificationPage
        .getHomeAddressOption(TEST_HOME_ADDRESS.street)
        .check();
      await pageManager.addressVerificationPage
        .getAlternateAddressOption(TEST_ALTERNATE_ADDRESS.street)
        .check();
      await pageManager.addressVerificationPage.nextButton.click();
    });

    await test.step("enters account information", async () => {
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage);
      await pageManager.accountPage.nextButton.click();
    });

    await test.step("displays personal information on review page", async () => {
      await expect(pageManager.reviewPage.stepHeading).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_PATRON_INFO.firstName)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_PATRON_INFO.lastName)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_PATRON_INFO.dateOfBirth)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_PATRON_INFO.email)
      ).toBeVisible();
      await expect(pageManager.reviewPage.receiveInfoChoice).toHaveText("Yes");
    });

    await test.step("displays home and alternate addresses on review page", async () => {
      await expect(
        pageManager.reviewPage.getText(TEST_HOME_ADDRESS.street)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_HOME_ADDRESS.city)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_HOME_ADDRESS.state)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_HOME_ADDRESS.postalCode)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_ALTERNATE_ADDRESS.street)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_ALTERNATE_ADDRESS.city)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_ALTERNATE_ADDRESS.state)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_ALTERNATE_ADDRESS.postalCode)
      ).toBeVisible();
    });

    await test.step("displays account information on review page", async () => {
      await expect(
        pageManager.reviewPage.getText(TEST_CUSTOMIZE_ACCOUNT.username)
      ).toBeVisible();
      await expect(pageManager.reviewPage.showPasswordCheckbox).toBeVisible();
      await pageManager.reviewPage.showPasswordCheckbox.check();
      await expect(
        pageManager.reviewPage.getText(TEST_CUSTOMIZE_ACCOUNT.password)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_CUSTOMIZE_ACCOUNT.defaultLibrary)
      ).toBeVisible();
    });

    await test.step("submits application", async () => {
      await expect(pageManager.reviewPage.submitButton).toBeVisible();
      await pageManager.reviewPage.submitButton.click();
    });

    await test.step("displays generated library card on congrats page", async () => {
      const fullName = `${TEST_PATRON_INFO.firstName} ${TEST_PATRON_INFO.lastName}`;
      await expect(pageManager.congratsPage.stepHeading).toBeVisible();
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
        })
      );

      expect(
        patronData.names.length,
        "Names array should not be empty"
      ).toBeGreaterThan(0);
      expect(
        patronData.emails.length,
        "Emails array should not be empty"
      ).toBeGreaterThan(0);
      expect(
        patronData.addresses.length,
        "Addresses array should not be empty"
      ).toBeGreaterThan(0);

      const expectedName =
        `${TEST_PATRON_INFO.lastName}, ${TEST_PATRON_INFO.firstName}`.toUpperCase();
      const expectedDOB = formatSierraDate(TEST_PATRON_INFO.dateOfBirth);
      const expectedEmail = TEST_PATRON_INFO.email.toLowerCase();
      const patronEmails = patronData.emails?.map((email) =>
        email.toLowerCase()
      );

      const expectedAddress = createFuzzyMatcher([
        TEST_HOME_ADDRESS.street,
        TEST_HOME_ADDRESS.apartmentSuite,
        TEST_HOME_ADDRESS.city,
        TEST_HOME_ADDRESS.state,
        TEST_HOME_ADDRESS.postalCode,
      ]);

      const actualAddressText = (patronData.addresses?.[0]?.lines || []).join(
        " "
      );
      const actualName = patronData.names?.[0].toUpperCase();

      expect(actualName).toContain(expectedName);
      expect(patronData.birthDate).toBe(expectedDOB);
      expect(actualAddressText).toMatch(expectedAddress);
      expect(patronEmails).toContain(expectedEmail);
    });
  });
});
