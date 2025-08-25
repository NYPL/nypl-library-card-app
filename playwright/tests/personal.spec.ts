import {test, expect} from '@playwright/test';
import {PersonalPage} from './pageobjects/personal.page';


test.beforeEach(async ({page}) => {
  
  await page.goto("/library-card/personal?newCard=true");

});

test('Personal information form', async ({page}) => {
  const personalPage = new PersonalPage(page);
  await expect(personalPage.firstNameInput).toBeVisible();
  await expect(personalPage.lastNameInput).toBeVisible();
  await expect(personalPage.emailInput).toBeVisible();
  await expect(personalPage.dateOfBirthInput).toBeVisible();
  //await expect(personalPage.checkBox).toBeVisible();
  await expect(personalPage.previousButton).toBeVisible();
  await expect(personalPage.nextButton).toBeVisible();
});
