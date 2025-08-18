import { test, expect } from "@playwright/test";
import { NewPage } from "../pages/new.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("displays the heading", async ({ page }) => {
  const newPage = new NewPage(page);
  await expect(newPage.applyHeading).toBeVisible();
});

test("displays get started button", async ({ page }) => {
  const newPage = new NewPage(page);
  await expect(newPage.getStartedButton).toBeVisible();
});
