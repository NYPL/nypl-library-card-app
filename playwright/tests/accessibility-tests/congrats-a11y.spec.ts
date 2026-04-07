import { AxeBuilder } from "@axe-core/playwright";
import { CongratsPage } from "../../pageobjects/congrats.page";
import { test, expect } from "@playwright/test";
import { PageManager } from "../../pageobjects/page-manager.page";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

import {
  fillPersonalInfo,
  fillAddress,
  fillAccountInfo,
} from "../../utils/form-helper";
import {
  PAGE_ROUTES,
  PROGRESS_BAR_TIMEOUT,
  SPINNER_TIMEOUT,
  TEST_ACCOUNT,
  TEST_PATRON,
  TEST_NYC_ADDRESS,
  IP,
} from "../../utils/constants";
import { deletePatron, getPatronID } from "../../utils/sierra-api-utils";

test.describe("Accessibility tests on Congrats Page", () => {
  let scrapedBarcode: string | null = null;

  test.beforeEach(async ({ page, context }, testInfo) => {
    await context.clearCookies();
    await page.setExtraHTTPHeaders({
      "x-client-ip": IP.NYC_IP,
      "x-forwarded-for": IP.NYC_IP,
    });

    const accountForThisTest = {
      ...TEST_ACCOUNT,
      username: `qa${Date.now()}w${testInfo.workerIndex}${Math.floor(Math.random() * 1000)}`,
    };

    await test.step("Pre-test database cleanup", async () => {
      try {
        const id = await getPatronID(accountForThisTest.username);
        if (id) await deletePatron(id);
      } catch {
        // ignore not found errors
      }
    });

    const pageManager = new PageManager(page);
    await test.step("filling personal information", async () => {
      await page.goto(PAGE_ROUTES.PERSONAL);
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
      await pageManager.personalPage.nextButton.click();
    });

    await test.step("filling address information", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await fillAddress(pageManager.addressPage, TEST_NYC_ADDRESS);
      await pageManager.addressPage.nextButton.click();
      await expect(pageManager.addressPage.spinner).not.toBeVisible({
        timeout: SPINNER_TIMEOUT,
      });
    });

    await test.step("address verification page", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeading
      ).toBeVisible();
      await pageManager.addressVerificationPage.nextButton.click();
      await expect(pageManager.addressVerificationPage.spinner).not.toBeVisible(
        { timeout: SPINNER_TIMEOUT }
      );
    });

    await test.step("filling account information", async () => {
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage, accountForThisTest);
      await pageManager.accountPage.nextButton.click();
    });

    await test.step("review page", async () => {
      await expect(pageManager.reviewPage.stepHeading).toBeVisible();
      await expect(pageManager.reviewPage.submitButton).toBeEnabled();

      await pageManager.reviewPage.submitButton.click();
      await expect(pageManager.reviewPage.progressBar).toBeVisible();
      await expect(pageManager.reviewPage.progressBar).not.toBeVisible({
        timeout: PROGRESS_BAR_TIMEOUT,
      });
    });

    await test.step("congrats page", async () => {
      await expect(
        pageManager.congratsPage.metroOrNonMetroHeading
      ).toBeVisible();
      scrapedBarcode =
        await pageManager.congratsPage.patronBarcodeNumber.textContent();
      expect(scrapedBarcode).not.toBeNull();
    });
  });

  test.afterEach("deletes patron", async () => {
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

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("it should support keyboard navigation", async ({ page }) => {
    const congratsPage = new CongratsPage(page);

    const locators = [
      congratsPage.locationsLink,
      congratsPage.photoIdAndProofOfAddressLink,
      congratsPage.readListenLink,
      congratsPage.loginLink,
      congratsPage.nyplLocationLink,
      congratsPage.findOutLibraryLink,
      congratsPage.discoverLink,
    ];

    await expect(congratsPage.metroOrNonMetroHeading).toBeFocused();

    for (const locator of locators) {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
