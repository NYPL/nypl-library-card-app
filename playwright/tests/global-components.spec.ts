import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";

test.describe("Verify breadcrumbs on every page", () => {
  const routes = [
    { name: "Landing Page", path: "/library-card/new?newCard=true" },
    { name: "Personal Page", path: "/library-card/personal?newCard=true" },
    { name: "Address Page", path: "/library-card/location?newCard=true" },
    {
      name: "Alternate Address Page",
      path: "/library-card/alternate-address?newCard=true",
    },
    {
      name: "Address Verification Page",
      path: "/library-card/address-verification?newCard=true",
    },
    { name: "Account Page", path: "/library-card/account?newCard=true" },
    { name: "Review Page", path: "/library-card/review?newCard=true" },
    { name: "Congrats Page", path: "/library-card/congrats?newCard=true" },
  ];

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
      await expect(page).toHaveTitle(/^New York Public Library$/);
    });
  }
});
