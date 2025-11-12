import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import { TEST_BARCODE_NUMBER, TEST_PATRON_INFO } from "../utils/constants";
import { mockCreatePatronApi } from "../utils/mock-api";

test.describe("navigates from Review page to Congrats page", () => {
  test("mocks create patron API", async ({ page }) => {
    const pageManager = new PageManager(page);
    const fullName = `${TEST_PATRON_INFO.firstName} ${TEST_PATRON_INFO.lastName}`;

    await test.step("submits application", async () => {
      await mockCreatePatronApi(page, fullName, TEST_BARCODE_NUMBER);
      await page.goto("/library-card/review?newCard=true");

      await expect(pageManager.reviewPage.submitButton).toBeVisible();
      await pageManager.reviewPage.submitButton.click();
    });

    await test.step("displays variable elements on Congrats page", async () => {
      await expect(pageManager.congratsPage.memberNameHeading).toBeVisible();
      await expect(pageManager.congratsPage.memberName).toHaveText(fullName);
      await expect(pageManager.congratsPage.barcodeNumber).toHaveText(
        TEST_BARCODE_NUMBER
      );
    });
  });
});
