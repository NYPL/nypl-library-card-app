import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PageManager } from "../../pageobjects/page-manager.page";
import {
  clickNextButton,
  fillAccountInfo,
  fillAddress,
  fillPersonalInfo,
} from "../../utils/form-helper";
import {
  IP,
  PAGE_ROUTES,
  TEST_ACCOUNT,
  TEST_NYC_ADDRESS,
  TEST_PATRON,
} from "../../utils/constants";
import { deletePatron, getPatronID } from "../../utils/sierra-api-utils";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("accessibility tests on congrats page", () => {
  let pageManager: PageManager;
  let scrapedBarcode: string | null = null;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await page.setExtraHTTPHeaders({
      "x-client-ip": IP.NYC_IP,
      "x-forwarded-for": IP.NYC_IP,
    });

    await test.step("enters personal information", async () => {
      await page.goto(PAGE_ROUTES.PERSONAL());
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
      await clickNextButton(
        pageManager.personalPage,
        pageManager.personalPage.nextButton,
        pageManager.addressPage.stepHeading
      );
    });

    await test.step("enters home address", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await fillAddress(pageManager.addressPage, TEST_NYC_ADDRESS);
      await clickNextButton(
        pageManager.addressPage,
        pageManager.addressPage.nextButton,
        pageManager.addressVerificationPage.stepHeading
      );
    });

    await test.step("verifies home address", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeading
      ).toBeVisible();
      await clickNextButton(
        pageManager.addressVerificationPage,
        pageManager.addressVerificationPage.nextButton,
        pageManager.accountPage.stepHeading
      );

      await test.step("enters account information", async () => {
        await expect(pageManager.accountPage.stepHeading).toBeVisible();
        await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
        await clickNextButton(
          pageManager.accountPage,
          pageManager.accountPage.nextButton,
          pageManager.reviewPage.stepHeading
        );
      });

      await test.step("displays review page", async () => {
        await expect(pageManager.reviewPage.stepHeading).toBeVisible();
        await clickNextButton(
          pageManager.reviewPage,
          pageManager.reviewPage.submitButton,
          pageManager.congratsPage.metroOrNonMetroHeading
        );
      });

      await test.step("displays congrats page", async () => {
        await expect(
          pageManager.congratsPage.metroOrNonMetroHeading
        ).toBeVisible();
        scrapedBarcode =
          await pageManager.congratsPage.patronBarcodeNumber.textContent();
        expect(scrapedBarcode).not.toBeNull();
      });
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

  test("does not have accessibility violations on page", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("tabs forward through the page for metro/non-metro patron", async () => {
    const congratsLocators = [
      pageManager.congratsPage.locationsLink,
      pageManager.congratsPage.photoIdAndProofOfAddressLink,
      pageManager.congratsPage.readListenLink,
      pageManager.congratsPage.loginLink,
      pageManager.congratsPage.nyplLocationLink,
      pageManager.congratsPage.findOutLibraryLink,
      pageManager.congratsPage.discoverLink,
    ];
    await expect(pageManager.congratsPage.metroOrNonMetroHeading).toBeFocused();
    for (const locator of congratsLocators) {
      await pageManager.congratsPage.page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
