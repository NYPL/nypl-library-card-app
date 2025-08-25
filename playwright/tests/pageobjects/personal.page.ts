
import {Page, Locator} from '@playwright/test';

export class PersonalPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly dateOfBirthInput: Locator;
    readonly checkBox: Locator;
    readonly previousButton: Locator;
    readonly nextButton: Locator;
    

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = this.page.getByLabel(/First Name/i);
    this.lastNameInput = this.page.getByLabel(/Last Name/i);
    this.dateOfBirthInput = this.page.getByLabel(/Date of Birth/i);
    this.emailInput = this.page.getByLabel(/Email/i);
    this.checkBox = this.page.getByRole('checkbox', { name: "ecommunicationsPref" });
    this.previousButton = this.page.getByRole('link', { name: 'Previous' });
    this.nextButton = this.page.getByRole('button', { name: 'Next' });



}
}