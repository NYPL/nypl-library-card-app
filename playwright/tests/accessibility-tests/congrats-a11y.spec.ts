import { AxeBuilder } from "@axe-core/playwright";
import { CongratsPage } from "../../pageobjects/congrats.page";
import { test, expect } from "@playwright/test";
import { PageManager } from "../../pageobjects/page-manager.page";
import {
  fillPersonalInfo,
  fillAddress,
  fillAccountInfo,
} from "../../utils/form-helper";
import {
  PAGE_ROUTES,
  SPINNER_TIMEOUT,
  TEST_ACCOUNT,
  TEST_PATRON,
  TEST_NYC_ADDRESS,
  IP,
} from "../../utils/constants";
import { deletePatron, getPatronID } from "../../utils/sierra-api-utils";

test.describe("Accessibility tests on Congrats Page", () => {
  let scrapedBarcode: string | null = null;
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.setExtraHTTPHeaders({
      "x-client-ip": IP.NYC_IP,
      "x-forwarded-for": IP.NYC_IP,
    });

    const pageManager = new PageManager(page);

    //personal page
    await page.goto(PAGE_ROUTES.PERSONAL);
    await expect(pageManager.personalPage.stepHeading).toBeVisible();
    await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
    await pageManager.personalPage.nextButton.click();

    //address page
    await expect(pageManager.addressPage.stepHeading).toBeVisible();
    await fillAddress(pageManager.addressPage, TEST_NYC_ADDRESS);
    await pageManager.addressPage.nextButton.click();
    await expect(pageManager.addressPage.spinner).not.toBeVisible({
      timeout: 10000,
    });

    //address verification page
    await expect(pageManager.addressVerificationPage.stepHeading).toBeVisible();
    await pageManager.addressVerificationPage.nextButton.click();
    await expect(pageManager.addressVerificationPage.spinner).not.toBeVisible({
      timeout: SPINNER_TIMEOUT,
    });
    //account page
    await expect(pageManager.accountPage.stepHeading).toBeVisible();
    await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
    await pageManager.accountPage.nextButton.click();

    //review page

    await expect(pageManager.reviewPage.stepHeading).toBeVisible();
    await pageManager.reviewPage.submitButton.click();

    //congrats page
    await expect(pageManager.congratsPage.metroOrNonMetroHeading).toBeVisible();
    scrapedBarcode =
      await pageManager.congratsPage.patronBarcodeNumber.textContent();
    expect(scrapedBarcode).not.toBeNull();
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

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag21aa", "wcag22aa"])
      .analyze();
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
