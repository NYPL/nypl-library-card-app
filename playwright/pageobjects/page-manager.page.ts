import { Page } from "@playwright/test";
import { LandingPage } from "./landing.page";
import { PersonalPage } from "./personal.page";
import { AddressPage } from "./address.page";
import { AlternateAddressPage } from "./alternate-address.page";
import { AccountPage } from "./account.page";
import { CongratsPage } from "./congrats.page";

export class PageManager {
  readonly page: Page;
  readonly landingPage: LandingPage;
  readonly personalPage: PersonalPage;
  readonly accountPage: AccountPage;
  readonly addressPage: AddressPage;
  readonly alternateAddressPage: AlternateAddressPage;
  readonly congratsPage: CongratsPage;

  constructor(page: Page) {
    this.page = page;
    this.landingPage = new LandingPage(page);
    this.accountPage = new AccountPage(page);
    this.addressPage = new AddressPage(page);
    this.alternateAddressPage = new AlternateAddressPage(page);
    this.personalPage = new PersonalPage(page);
    this.congratsPage = new CongratsPage(page);
  }
}
