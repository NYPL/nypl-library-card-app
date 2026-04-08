import { test, expect } from "@playwright/test";
import { PageManager } from "../../pageobjects/page-manager.page";
import {
  expectNoErrors,
  fillAccountInfo,
  fillAddress,
  fillPersonalInfo,
} from "../../utils/form-helper";
import {
  EXPECTED_BARCODE_PREFIX,
  IP,
  PAGE_ROUTES,
  PATRON_TYPES,
  SPINNER_TIMEOUT,
  TEST_ACCOUNT,
  TEST_NYC_ADDRESS,
  TEST_PATRON,
} from "../../utils/constants";
import {
  deletePatron,
  getPatronID,
  verifyPatronData,
} from "../../utils/sierra-api-utils";

test.describe("E2E: Complete application with Sierra API integration", () => {
  let scrapedBarcode: string | null = null;

  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({
      "x-client-ip": IP.NYC_IP,
      "x-forwarded-for": IP.NYC_IP,
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
      await expectNoErrors(pageManager.personalPage);
    });

    await test.step("enters home address", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await fillAddress(pageManager.addressPage, TEST_NYC_ADDRESS);
      await pageManager.addressPage.nextButton.click();
      await expectNoErrors(pageManager.addressPage);
      await expect(pageManager.addressPage.spinner).not.toBeVisible({
        timeout: SPINNER_TIMEOUT,
      });
    });

    await test.step("displays address verification", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeading
      ).toBeVisible();
      await pageManager.addressVerificationPage
        .getHomeAddressOption(TEST_NYC_ADDRESS.street)
        .click();
      await pageManager.addressVerificationPage.nextButton.click();
      await expect(pageManager.addressVerificationPage.spinner).not.toBeVisible(
        {
          timeout: SPINNER_TIMEOUT,
        }
      );
    });

    await test.step("enters account information", async () => {
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
      await pageManager.accountPage.nextButton.click();
      await expectNoErrors(pageManager.accountPage);
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

    await test.step("displays home address on review page", async () => {
      await expect(
        pageManager.reviewPage.getText(TEST_NYC_ADDRESS.street)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_NYC_ADDRESS.city)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_NYC_ADDRESS.state)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_NYC_ADDRESS.postalCode)
      ).toBeVisible();
    });

    await test.step("displays account information on review page", async () => {
      await expect(
        pageManager.reviewPage.getText(TEST_ACCOUNT.username)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.showPasswordCheckboxLabel
      ).toBeVisible();
      await pageManager.reviewPage.showPasswordCheckboxLabel.click();
      await expect(
        pageManager.reviewPage.getText(TEST_ACCOUNT.password)
      ).toBeVisible();
    });

    await test.step("submits application", async () => {
      await expect(pageManager.reviewPage.submitButton).toBeVisible();
      await pageManager.reviewPage.submitButton.click();
      await expectNoErrors(pageManager.reviewPage);
    });

    await test.step("displays headings and banner on congrats page", async () => {
      await expect(pageManager.congratsPage.mainHeading).toBeVisible();
      await expect(
        pageManager.congratsPage.metroOrNonMetroHeading
      ).toBeVisible();
      await expect(pageManager.congratsPage.readListenLink).toBeVisible();
    });

    await test.step("displays generated library card on congrats page", async () => {
      const fullName = `${TEST_PATRON.firstName} ${TEST_PATRON.lastName}`;
      await expect(pageManager.congratsPage.memberNameHeading).toBeVisible();
      await expect(pageManager.congratsPage.memberName).toHaveText(fullName);
      await expect(pageManager.congratsPage.issuedDateHeading).toBeVisible();
      await expect(pageManager.congratsPage.issuedDate).toBeVisible();
      await expect(pageManager.congratsPage.patronBarcodeNumber).toBeVisible();
      await expect(pageManager.congratsPage.patronBarcodeNumber).toContainText(
        EXPECTED_BARCODE_PREFIX
      );
    });

    await test.step("verifies patron data in Sierra database", async () => {
      scrapedBarcode =
        await pageManager.congratsPage.patronBarcodeNumber.textContent();
      expect(scrapedBarcode).not.toBeNull();
      await verifyPatronData(
        scrapedBarcode,
        TEST_PATRON,
        TEST_NYC_ADDRESS,
        PATRON_TYPES.DIGITAL_METRO
      );
    });
  });
});
