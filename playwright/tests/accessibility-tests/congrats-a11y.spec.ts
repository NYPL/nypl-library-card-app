import { AxeBuilder } from "@axe-core/playwright";
import { CongratsPage } from "../../pageobjects/congrats.page";
import { test, expect } from "@playwright/test";
import { randomBytes } from "crypto";
import { PageManager } from "../../pageobjects/page-manager.page";
import {
  A11Y_GUIDELINES,
  validateA11yCoverage,
  pressTab,
} from "../../utils/a11y-utils";
import { navigateToCongratsPage } from "../../utils/a11y-helper";

import {
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
      username: `qa${Date.now()}w${testInfo.workerIndex}${randomBytes(4).toString("hex")}`,
    };

    const pageManager = new PageManager(page);
    await test.step("Setup: Navigate to Congrats", async () => {
      await navigateToCongratsPage({
        page,
        pageManager,
        patronData: TEST_PATRON,
        addressData: TEST_NYC_ADDRESS,
        accountData: accountForThisTest,
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

  test("it should support keyboard navigation", async ({
    page,
    browserName,
  }) => {
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
      await pressTab(page, browserName);
      await expect(locator).toBeFocused();
    }
  });
});
