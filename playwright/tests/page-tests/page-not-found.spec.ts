import { test, expect } from "@playwright/test";
import { PageNotFoundPage } from "../../pageobjects/page-not-found.page";
import { PAGE_ROUTES } from "../../utils/constants";

test.describe("page not found (404)", () => {
  let pageNotFoundPage: PageNotFoundPage;

  test.beforeEach(async ({ page }) => {
    pageNotFoundPage = new PageNotFoundPage(page);
    await page.goto(PAGE_ROUTES.NOT_FOUND());
  });

  test("displays breadcrumbs", async () => {
    await expect(pageNotFoundPage.homeBreadcrumb).toBeVisible();
    await expect(pageNotFoundPage.getALibarayCardBreadcrumb).toBeVisible();
  });

  test("display icon, error title, error message, and links", async () => {
    await expect(pageNotFoundPage.errorIcon).toBeVisible();
    await expect(pageNotFoundPage.errorTitle).toBeVisible();
    await expect(pageNotFoundPage.errorMessage).toBeVisible();
    await expect(pageNotFoundPage.newApplicationLink).toBeVisible();
    await expect(pageNotFoundPage.contactUsLink).toBeVisible();
  });

  test("home breadcrumb navigates to the expected destination", async ({
    page,
  }) => {
    await pageNotFoundPage.homeBreadcrumb.click();
    await expect(page).toHaveURL(/nypl\.org\/?$/);
  });

  test("get a library card breadcrumb navigates to the expected destination", async ({
    page,
  }) => {
    await pageNotFoundPage.getALibarayCardBreadcrumb.click();
    await expect(page).toHaveURL(/\/library-card\/new/);
  });

  test("new application link navigates to the expected desitination", async ({
    page,
  }) => {
    await pageNotFoundPage.newApplicationLink.click();
    await expect(page).toHaveURL(/\library-card\/new/);
  });

  test("contact us link navigates to the expected destination", async ({
    page,
  }) => {
    await pageNotFoundPage.contactUsLink.click();
    await expect(page).toHaveURL(/.*contact.*/);
  });
});
