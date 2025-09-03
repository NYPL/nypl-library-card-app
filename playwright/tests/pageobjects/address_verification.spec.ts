import {test,expect} from '@playwright/test';
import { AddressVerificationPage } from '../../pageobjects/address_verification.page';


test.beforeEach(async ({ page }) => {
   
    await page.goto('/library-card/address-verification?&newCard=true');
});

test('should display the correct headers', async ({page}) => {
    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.mainHeader).toHaveText('Apply for a Library Card Online');
    await expect(addressVerificationPage.subHeader).toHaveText('Step 3 of 5: Address Verification');
    await expect(addressVerificationPage.homeAddressHeader).toHaveText('Home Address');
});

test('should allow user to verify address', async ({page}) => {
    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.addressInput).toBeVisible();
    await expect(addressVerificationPage.verifyButton).toBeVisible();
    await expect(addressVerificationPage.previousButton).toBeVisible();
    await expect(addressVerificationPage.nextButton).toBeVisible();
});

