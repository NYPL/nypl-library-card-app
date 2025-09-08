import {Page, Locator} from '@playwright/test';

export class AddressVerificationPage {
    readonly page: Page;
    readonly mainHeader: Locator;
    readonly subHeader: Locator;
    readonly homeAddressHeader: Locator;
    readonly addressInput: Locator;
    readonly verifyButton: Locator;
    readonly nextButton: Locator;
    readonly previousButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mainHeader = page.locator('h1');
        this.subHeader = page.locator('h2');
        this.homeAddressHeader = page.locator('h3');
        this.addressInput = page.locator('#address');
        this.verifyButton = page.getByRole('radio', { name: 'Verify Address' });
        this.previousButton = this.page.getByRole('link', { name: 'Previous' });
        this.nextButton = this.page.getByRole('button', { name: 'Next' });

    }

  
}