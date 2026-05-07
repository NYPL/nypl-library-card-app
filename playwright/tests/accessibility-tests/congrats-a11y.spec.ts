import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PageManager } from "../../pageobjects/page-manager.page";
import { clickNextButton } from "../../utils/form-helper";
import {
  PAGE_ROUTES,
  PATRON_TYPES,
  TEST_BARCODE_NUMBER,
  TEST_PATRON,
} from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";
import { mockCreatePatronApi } from "../../utils/mock-api";

test.describe("accessibility tests on congrats page", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
  });

  test("does not have accessibility violations on page", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("tabs forward through the page for metro/non-metro patron", async () => {
    await test.step("submits mocked application", async () => {
      await pageManager.page.goto(PAGE_ROUTES.REVIEW());
      await mockCreatePatronApi(
        pageManager.congratsPage.page,
        `${TEST_PATRON.firstName} ${TEST_PATRON.lastName}`,
        TEST_BARCODE_NUMBER,
        PATRON_TYPES.DIGITAL_METRO
      );
      await clickNextButton(
        pageManager.reviewPage,
        pageManager.reviewPage.submitButton,
        pageManager.congratsPage.metroOrNonMetroHeading
      );
    });

    await test.step("tabs forward through the page ", async () => {
      const congratsLocators = [
        pageManager.congratsPage.locationsLink,
        pageManager.congratsPage.photoIdAndProofOfAddressLink,
        pageManager.congratsPage.readListenLink,
        pageManager.congratsPage.loginLink,
        pageManager.congratsPage.nyplLocationLink,
        pageManager.congratsPage.findOutLibraryLink,
        pageManager.congratsPage.discoverLink,
      ];
      await expect(
        pageManager.congratsPage.metroOrNonMetroHeading
      ).toBeFocused();
      for (const locator of congratsLocators) {
        await pageManager.congratsPage.page.keyboard.press("Tab");
        await expect(locator).toBeFocused();
      }
    });
  });
});
