/*import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import {
  fillPersonalInfo,
  fillAddress,
  fillAccountInfo,
} from "../utils/form-helper";
import {
  SPINNER_TIMEOUT,
  TEST_ACCOUNT,
  TEST_PATRON,
  PAGE_ROUTES,
  //PATRON_TYPES,
  TEST_NYS_ADDRESS,
} from "../utils/constants";
import {
  getPatronID,
  getPatronData,
  deletePatron,
} from "../utils/sierra-api-utils";
import { createFuzzyMatcher, formatSierraDate } from "../utils/formatter";

test.describe("E2E: Complete application with Sierra API integration", () => {
  let scrapedBarcode: string | null = null;

  test.afterAll("deletes patron", async () => {
    if (scrapedBarcode) {
      try {
        const patronID = await getPatronID(scrapedBarcode);

        if (patronID) {
          await deletePatron(patronID);
        }
      } catch (error) {
        console.error("Error during patron deletion:", error);
      }   
    }
  });  
   
    
   test("displays patron information on congrats page", async ({page}) => {
    const pageManager = new PageManager(page);

    await test.step("begins at landing", async () => {
      await page.goto(PAGE_ROUTES.LANDING);
      await expect(pageManager.landingPage.applyHeading).toBeVisible();
      await pageManager.landingPage.getStartedButton.click();
    });

    await test.step("enters personal information", async () => {
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
      await pageManager.personalPage.nextButton.click();
    });

    await test.step("enters home address", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await fillAddress(pageManager.addressPage, TEST_NYS_ADDRESS);
      await pageManager.addressPage.nextButton.click();
      await expect(pageManager.addressPage.spinner).not.toBeVisible({
        timeout: SPINNER_TIMEOUT,
      });
    });

     await test.step("address verification page", async () =>{
      await expect(pageManager.addressVerificationPage.stepHeading).toBeVisible();
      await pageManager.addressVerificationPage.nextButton.click();
    })
    await test.step("enters account information", async () => {
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
      await pageManager.accountPage.nextButton.click();
    });

    await test.step("review page", async () =>{
      await expect(pageManager.reviewPage.stepHeading).toBeVisible();
      await pageManager.reviewPage.submitButton.click();
    });

    await test.step("congrats page", async ()=>{
   
   });



    
  
    

  });
});
*/
