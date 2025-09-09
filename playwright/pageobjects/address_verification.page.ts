import {Page, Locator} from '@playwright/test';

export class AddressVerificationPage {
    readonly page: Page;
    readonly mainHeader: Locator;
    readonly subHeader: Locator;
    readonly homeAddressHeader: Locator;
    readonly addressDisplayed: Locator;
    readonly verifyRadioButton: Locator;
    readonly nextButton: Locator;
    readonly previousButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mainHeader = page.locator('h1');
        this.subHeader = page.locator('h2');
        this.homeAddressHeader = page.locator('h3');
        this.addressDisplayed = page.getByText(/^(\d+)\s+([A-Za-z0-9\s#.\-&,']{2,})\s+([A-Za-z\s]{2,}),\s+([A-Z]{2})\s+([0-9]{5}(?:-[0-9]{4})?)$/);
        this.verifyRadioButton = page.locator('span.radio-input[aria-hidden="true"]');
        this.previousButton = this.page.getByRole('link', { name: 'Previous' });
        this.nextButton =  this.page.getByRole('button', { name: 'Next', exact: true })

    }

  
}