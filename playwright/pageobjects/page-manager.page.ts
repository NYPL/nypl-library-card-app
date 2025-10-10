import { Page } from "@playwright/test";
import { LandingPage } from "./landing.page";
import { PersonalPage } from "./personal.page";
import { AddressPage } from "./address.page";
import { AddressVerificationPage } from "./address-verification.page";
import { AlternateAddressPage } from "./alternate-address.page";
import { AccountPage } from "./account.page";
import { CongratsPage } from "./congrats.page";

export class PageManager {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get landingPage(): LandingPage {
    return new LandingPage(this.page);
  }

  get personalPage(): PersonalPage {
    return new PersonalPage(this.page);
  }

  get addressPage(): AddressPage {
    return new AddressPage(this.page);
  }

  get alternateAddressPage(): AlternateAddressPage {
    return new AlternateAddressPage(this.page);
  }
  get addressVerificationPage(): AddressVerificationPage {
    return new AddressVerificationPage(this.page);
  }

  get accountPage(): AccountPage {
    return new AccountPage(this.page);
  }

  get congratsPage(): CongratsPage {
    return new CongratsPage(this.page);
  }
}
