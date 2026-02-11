import { test, expect } from "@playwright/test";
import { CongratsPage } from "../pageobjects/congrats.page";
//import { OUTSIDE_NY_GEOLOCATION, TEST_NYC_ADDRESS, TEST_OOS_ADDRESS} from "../utils/constants";
import { PageManager } from "../pageobjects/page-manager.page";
import {
  fillPersonalInfo,
  fillAddress,
  fillAccountInfo,
} from "../utils/form-helper";
import { getPatronID, deletePatron } from "../utils/sierra-api-utils";

/*test.use({
  geolocation: OUTSIDE_NY_GEOLOCATION,
  permissions: ["geolocation"],
});*/
test.describe("E2E: Temporary Card - displays temporary card message on Congrats page", () => {
  let scrapedBarcode: string | null = null;

  test.afterAll("deletes patron", async () => {
    if (scrapedBarcode) {
      try {
        const patronID = await getPatronID(scrapedBarcode);
        if (patronID) await deletePatron(patronID);
      } catch (error) {
        console.error("Error during patron deletion:", error);
      }
    }
  });

  test("Get started with temporary card flow", async ({ page }) => {
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
      await fillAddress(pageManager.addressPage, TEST_OOS_ADDRESS);
      await pageManager.addressPage.nextButton.click();
    });

    await test.step("enter alternate address", async () => {
      await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
      await fillAddress(pageManager.alternateAddressPage, TEST_NYC_ADDRESS);
      await pageManager.alternateAddressPage.nextButton.click();
    });

    await test.step("address verification", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeading
      ).toBeVisible();
      await pageManager.addressVerificationPage.nextButton.click();
    });
    await test.step("enters account information", async () => {
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage);
      await pageManager.accountPage.nextButton.click();
    });

    await test.step("reviews and submits application", async () => {
      await expect(pageManager.reviewPage.stepHeading).toBeVisible();
      await pageManager.reviewPage.submitButton.click();
    });

    await test.step("displays Congrats page", async () => {
      await expect(pageManager.congratsPage.stepHeading).toBeVisible();
      // Set scrapedBarcode after reaching Congrats page
      scrapedBarcode =
        await pageManager.congratsPage.patronBarcodeNumber.textContent();
    });
    test.step("displays temporary card message on Congrats page", async () => {
      const congratsPage = new CongratsPage(page);

      await expect(congratsPage.temporaryHeading).toBeVisible();
      await expect(congratsPage.temporaryCardBanner).toBeVisible();
      await expect(congratsPage.learnMoreLink).toBeVisible();
      await expect(congratsPage.emailLink).toBeVisible();
    });
  });
});
