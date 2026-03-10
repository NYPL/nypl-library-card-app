import { test, expect } from "@playwright/test";
import { CongratsPage } from "../pageobjects/congrats.page";
import { PageManager } from "../pageobjects/page-manager.page";
import {
  PAGE_ROUTES,
  PATRON_TYPES,
  TEST_BARCODE_NUMBER,
  TEST_PATRON,
} from "../utils/constants";
import { mockCreatePatronApi } from "../utils/mock-api";

test.describe("displays congrats page", () => {
  let congratsPage: CongratsPage;
  let pageManager: PageManager;
  let fullName: string;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    congratsPage = new CongratsPage(page);
    fullName = `${TEST_PATRON.firstName} ${TEST_PATRON.lastName}`;
    await page.goto(PAGE_ROUTES.REVIEW());
  });

  test("displays library card on congrats page", async ({ page }) => {
    await test.step("submits mocked application", async () => {
      await mockCreatePatronApi(page, fullName, TEST_BARCODE_NUMBER); // defaults to temporary patron type
      await pageManager.reviewPage.submitButton.click();
    });

    await test.step("displays library card", async () => {
      await expect(congratsPage.memberNameHeading).toBeVisible();
      await expect(congratsPage.memberName).toHaveText(fullName);
      await expect(congratsPage.issuedDateHeading).toBeVisible();
      await expect(congratsPage.issuedDate).toBeVisible();
      await expect(congratsPage.libraryCardBackground).toBeVisible();
    });
  });

  test("displays congrats page for NYC patron", async ({ page }) => {
    await test.step("submits mocked application", async () => {
      await mockCreatePatronApi(
        page,
        fullName,
        TEST_BARCODE_NUMBER,
        PATRON_TYPES.DIGITAL_METRO
      );
      await pageManager.reviewPage.submitButton.click();
    });

    await test.step("displays metro card headings and links", async () => {
      await expect(congratsPage.mainHeading).toBeVisible();
      await expect(congratsPage.metroOrNonMetroHeading).toBeVisible();
      await expect(congratsPage.locationsLink).toBeVisible();
      await expect(congratsPage.photoIdAndProofOfAddressLink).toBeVisible();
      await expect(congratsPage.getStartedHeading).toBeVisible();
      await expect(congratsPage.readListenLink).toBeVisible();
      await expect(congratsPage.loginLink).toBeVisible();
      await expect(congratsPage.nyplLocationLink).toBeVisible();
      await expect(congratsPage.findOutLibraryLink).toBeVisible();
      await expect(congratsPage.discoverLink).toBeVisible();
    });

    await test.step("confirms links open in new tab", async () => {
      const links = [
        congratsPage.locationsLink,
        congratsPage.photoIdAndProofOfAddressLink,
        congratsPage.readListenLink,
        congratsPage.loginLink,
        congratsPage.nyplLocationLink,
        congratsPage.findOutLibraryLink,
        congratsPage.discoverLink,
      ];
      for (const link of links) {
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute(
          "rel",
          "nofollow noopener noreferrer"
        );
      }
    });
  });

  test("displays congrats page for NYS patron", async ({ page }) => {
    await test.step("submits mocked application", async () => {
      await mockCreatePatronApi(
        page,
        fullName,
        TEST_BARCODE_NUMBER,
        PATRON_TYPES.DIGITAL_NON_METRO
      );
      await pageManager.reviewPage.submitButton.click();
    });

    await test.step("displays metro card headings and links", async () => {
      await expect(congratsPage.mainHeading).toBeVisible();
      await expect(congratsPage.metroOrNonMetroHeading).toBeVisible();
      await expect(congratsPage.locationsLink).toBeVisible();
      await expect(congratsPage.photoIdAndProofOfAddressLink).toBeVisible();
      await expect(congratsPage.getStartedHeading).toBeVisible();
      await expect(congratsPage.readListenLink).toBeVisible();
      await expect(congratsPage.loginLink).toBeVisible();
      await expect(congratsPage.nyplLocationLink).toBeVisible();
      await expect(congratsPage.findOutLibraryLink).toBeVisible();
      await expect(congratsPage.discoverLink).toBeVisible();
    });

    await test.step("confirms links open in new tab", async () => {
      const links = [
        congratsPage.locationsLink,
        congratsPage.photoIdAndProofOfAddressLink,
        congratsPage.readListenLink,
        congratsPage.loginLink,
        congratsPage.nyplLocationLink,
        congratsPage.findOutLibraryLink,
        congratsPage.discoverLink,
      ];
      for (const link of links) {
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute(
          "rel",
          "nofollow noopener noreferrer"
        );
      }
    });
  });

  test("displays congrats page for OOS patron", async ({ page }) => {
    await test.step("submits mocked application", async () => {
      await mockCreatePatronApi(
        page,
        fullName,
        TEST_BARCODE_NUMBER,
        PATRON_TYPES.DIGITAL_TEMPORARY
      );
      await pageManager.reviewPage.submitButton.click();
    });

    await test.step("displays temporary card headings and links", async () => {
      await expect(congratsPage.mainHeading).toBeVisible();
      await expect(congratsPage.temporaryHeading).toBeVisible();
      await expect(congratsPage.locationsLink).toBeVisible();
      await expect(congratsPage.photoIdAndProofOfAddressLink).toBeVisible();
      await expect(congratsPage.temporaryCardBanner).toBeVisible();
      await expect(congratsPage.learnMoreLink).toBeVisible();
      await expect(congratsPage.getHelpEmailLink).toBeVisible();
      await expect(congratsPage.getStartedHeading).toBeVisible();
      await expect(congratsPage.loginLink).toBeVisible();
      await expect(congratsPage.nyplLocationLink).toBeVisible();
      await expect(congratsPage.findOutLibraryLink).toBeVisible();
      await expect(congratsPage.discoverLink).toBeVisible();
    });

    await test.step("confirms links open in new tab", async () => {
      const links = [
        congratsPage.locationsLink,
        congratsPage.photoIdAndProofOfAddressLink,
        congratsPage.learnMoreLink,
        congratsPage.getHelpEmailLink,
        congratsPage.loginLink,
        congratsPage.nyplLocationLink,
        congratsPage.findOutLibraryLink,
        congratsPage.discoverLink,
      ];
      for (const link of links) {
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute(
          "rel",
          "nofollow noopener noreferrer"
        );
      }
    });
  });
});
