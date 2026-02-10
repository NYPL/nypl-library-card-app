import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import { fillAccountInfo, fillAddress } from "../utils/form-helper";
import {
  TEST_ACCOUNT,
  TEST_EDITED_ACCOUNT,
  TEST_NYC_ADDRESS,
} from "../utils/constants";

test("displays error when address is too long", async ({ page }) => {
  const pageManager = new PageManager(page);
  const invalidStreet = "A".repeat(100);

  await test.step("enters invalid home address", async () => {
    await page.goto("/library-card/location?newCard=true");
    await expect(pageManager.addressPage.stepHeading).toBeVisible();
    await fillAddress(pageManager.addressPage, {
      street: invalidStreet,
      apartmentSuite: "1",
      city: "City",
      state: "NY",
      postalCode: "12345",
    });
    await pageManager.addressPage.nextButton.click();
  });

  await test.step("skips alternate address", async () => {
    await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
    await pageManager.alternateAddressPage.nextButton.click();
  });

  await test.step("confirms address verification", async () => {
    await expect(pageManager.addressVerificationPage.stepHeading).toBeVisible();
    await pageManager.addressVerificationPage
      .getHomeAddressOption(invalidStreet)
      .check();
    await pageManager.addressVerificationPage.nextButton.click();
  });

  await test.step("enters account information", async () => {
    await expect(pageManager.accountPage.stepHeading).toBeVisible();
    await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
    await pageManager.accountPage.nextButton.click();
  });

  await test.step("displays error on review page", async () => {
    await expect(pageManager.reviewPage.stepHeading).toBeVisible();
    await pageManager.reviewPage.submitButton.click();
    await expect(pageManager.reviewPage.streetAddressError).toBeVisible();
  });
});

test("confirms changes made on `account` page via editing addresses display on `review` page", async ({
  page,
}) => {
  const pageManager = new PageManager(page);

  await test.step("enters account information", async () => {
    await page.goto("/library-card/account?newCard=true");
    await expect(pageManager.accountPage.stepHeading).toBeVisible();
    await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
    await pageManager.accountPage.nextButton.click();
  });

  await test.step("displays review page", async () => {
    await expect(pageManager.reviewPage.stepHeading).toBeVisible();
    await pageManager.reviewPage.editAddressButton.click();
  });

  await test.step("enters home address", async () => {
    await expect(pageManager.addressPage.stepHeading).toBeVisible();
    await fillAddress(pageManager.addressPage, TEST_NYC_ADDRESS);
    await pageManager.addressPage.nextButton.click();
  });

  await test.step("skips alternate address", async () => {
    await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
    await pageManager.alternateAddressPage.nextButton.click();
  });

  await test.step("confirms address verification", async () => {
    await expect(pageManager.addressVerificationPage.stepHeading).toBeVisible();
    await pageManager.addressVerificationPage
      .getHomeAddressOption(TEST_NYC_ADDRESS.street)
      .check();
    await pageManager.addressVerificationPage.nextButton.click();
  });

  await test.step("edits account information", async () => {
    await expect(pageManager.accountPage.stepHeading).toBeVisible();
    await fillAccountInfo(pageManager.accountPage, TEST_EDITED_ACCOUNT);
    await pageManager.accountPage.nextButton.click();
  });

  await test.step("displays updated account info on review page", async () => {
    await expect(pageManager.reviewPage.stepHeading).toBeVisible();
    await expect(
      pageManager.reviewPage.getText(TEST_EDITED_ACCOUNT.username)
    ).toBeVisible();
    await pageManager.reviewPage.showPasswordCheckbox.check();
    await expect(
      pageManager.reviewPage.getText(TEST_EDITED_ACCOUNT.password)
    ).toBeVisible();
    await expect(
      pageManager.reviewPage.getText(TEST_EDITED_ACCOUNT.homeLibrary)
    ).toBeVisible();
  });
});
