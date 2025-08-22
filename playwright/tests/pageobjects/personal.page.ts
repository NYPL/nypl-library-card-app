
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
    this.firstNameInput = this.page.locator('input[name="firstName"]');
    this.lastNameInput = this.page.locator('input[name="lastName"]');
    this.dateOfBirthInput = this.page.locator('input[name="birthdate"]');
    this.emailInput = this.page.locator('input[name="email"]');
    this.checkBox = this.page.locator('input[type="checkbox"]');
    this.previousButton = this.page.getByLabel("Previous");
    this.nextButton = this.page.getByLabel("Next");


}
}