import { test, expect } from "@playwright/test";
import appContent from "../../../public/locales/es/common.json";

export const ADDRESS_VERIFICATION_ES = {
  MAIN_HEADING: appContent.banner.title,
  STEP_HEADING: appContent.verifyAddress.title,
  DESCRIPTION: appContent.verifyAddress.description,
  HOME_ADDRESS_HEADING: appContent.verifyAddress.homeAddress,
  ALTERNATE_ADDRESS_HEADING: appContent.verifyAddress.workAddress,
  PREVIOUS_BUTTON: appContent.button.previous,
  NEXT_BUTTON: appContent.button.next,
};

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/address-verification?&newCard=true&lang=es");
});

test("snapshot test on Address Verification page", async ({ page }) => {
  await expect(
    page.getByTestId("ds-hero-content").getByTestId("ds-heading")
  ).toMatchAriaSnapshot(
    `- heading "${ADDRESS_VERIFICATION_ES.MAIN_HEADING}" [level=1]`
  );
  await expect(page.locator("#mainContent")).toMatchAriaSnapshot(`
    - main:
      - 'heading "${ADDRESS_VERIFICATION_ES.STEP_HEADING}" [level=2]'
      - text: ${ADDRESS_VERIFICATION_ES.DESCRIPTION}
      - heading "${ADDRESS_VERIFICATION_ES.HOME_ADDRESS_HEADING}" [level=3]
      - link "${ADDRESS_VERIFICATION_ES.PREVIOUS_BUTTON}"
      - button "${ADDRESS_VERIFICATION_ES.NEXT_BUTTON}"
    `);
});

test("displays translated elements on Address Verification page", async ({
  page,
}) => {
  await expect(
    page.getByText(ADDRESS_VERIFICATION_ES.MAIN_HEADING)
  ).toBeVisible();
  await expect(
    page.getByText(ADDRESS_VERIFICATION_ES.STEP_HEADING)
  ).toBeVisible();
  await expect(
    page.getByText(ADDRESS_VERIFICATION_ES.HOME_ADDRESS_HEADING)
  ).toBeVisible();
  // await expect(page.getByText(ADDRESS_VERIFICATION_ES.ALTERNATE_ADDRESS_HEADING)).toBeVisible();
  await expect(
    page.getByText(ADDRESS_VERIFICATION_ES.PREVIOUS_BUTTON)
  ).toBeVisible();
  await expect(
    page.getByText(ADDRESS_VERIFICATION_ES.NEXT_BUTTON)
  ).toBeVisible();
});
