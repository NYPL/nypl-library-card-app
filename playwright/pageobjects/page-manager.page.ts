import { Page } from "@playwright/test";
import { LandingPage } from "./landing.page";
import { PersonalPage } from "./personal.page";
import { AddressPage } from "./address.page";
import { AddressVerificationPage } from "./address-verification.page";
import { AlternateAddressPage } from "./alternate-address.page";
import { AccountPage } from "./account.page";
import { ReviewPage } from "./review.page";
import { CongratsPage } from "./congrats.page";
import { GlobalComponentsPage } from "./global-components.page";

export class PageManager {
  readonly page: Page;
  readonly appContent: any;

  constructor(page: Page, appContent?: any) {
    this.page = page;
    this.appContent = appContent;
  }

  get landingPage(): LandingPage {
    return new LandingPage(this.page, this.appContent);
  }

  get personalPage(): PersonalPage {
    return new PersonalPage(this.page, this.appContent);
  }

  get addressPage(): AddressPage {
    return new AddressPage(this.page, this.appContent);
  }

  get alternateAddressPage(): AlternateAddressPage {
    return new AlternateAddressPage(this.page, this.appContent);
  }

  get addressVerificationPage(): AddressVerificationPage {
    return new AddressVerificationPage(this.page, this.appContent);
  }

  get accountPage(): AccountPage {
    return new AccountPage(this.page);
  }

  get reviewPage(): ReviewPage {
    return new ReviewPage(this.page);
  }

  get congratsPage(): CongratsPage {
    return new CongratsPage(this.page);
  }
  get globalComponents(): GlobalComponentsPage {
    return new GlobalComponentsPage(this.page);
  }
}
