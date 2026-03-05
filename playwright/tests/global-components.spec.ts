import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import { PAGE_ROUTES } from "../utils/constants";

const routes = [
  { name: "Landing Page", path: PAGE_ROUTES.LANDING() },
  { name: "Personal Page", path: PAGE_ROUTES.PERSONAL() },
  { name: "Address Page", path: PAGE_ROUTES.ADDRESS() },
  {
    name: "Alternate Address Page",
    path: PAGE_ROUTES.ALTERNATE_ADDRESS(),
  },
  {
    name: "Address Verification Page",
    path: PAGE_ROUTES.ADDRESS_VERIFICATION(),
  },
  { name: "Account Page", path: PAGE_ROUTES.ACCOUNT() },
  { name: "Review Page", path: PAGE_ROUTES.REVIEW() },
  { name: "Congrats Page", path: PAGE_ROUTES.CONGRATS() },
];

test.describe("Verify breadcrumbs on every page", () => {
  for (const route of routes) {
    test(`displays breadcrumb navigation on ${route.name}`, async ({
      page,
    }) => {
      const pm = new PageManager(page);
      await page.goto(route.path);

      await expect(pm.globalComponents.homeBreadcrumb).toBeVisible();
      await expect(pm.globalComponents.getLibraryCardBreadcrumb).toBeVisible();
    });
  }

  for (const route of routes) {
    test(`get a library card breadcrumb navigates to landing page from ${route.name}`, async ({
      page,
    }) => {
      const pm = new PageManager(page);
      await page.goto(route.path);

      await pm.globalComponents.getLibraryCardBreadcrumb.click();
      await expect(page).toHaveURL(/\/library-card\/new/);
      await expect(pm.landingPage.applyHeading).toBeVisible();
    });
  }

  for (const route of routes) {
    test(`home breadcrumb navigates to nypl home page ${route.name}`, async ({
      page,
    }) => {
      const pm = new PageManager(page);
      await page.goto(route.path);

      await pm.globalComponents.homeBreadcrumb.click();
      await expect(page).toHaveURL(
        /^(https:\/\/www\.nypl\.org\/|https:\/\/qa-www\.nypl\.org\/)$/
      );
      await expect(page).toHaveTitle(/^The New York Public Library$/);
    });
  }
});
