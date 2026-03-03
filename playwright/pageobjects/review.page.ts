import { Page, Locator } from "@playwright/test";

export class ReviewPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;

  // Personal Information section
  readonly personalInfoHeading: Locator;
  readonly firstNameHeading: Locator;
  readonly firstNameInputHeading: Locator;
  readonly firstNameInput: Locator;
  readonly firstNameError: Locator;
  readonly lastNameHeading: Locator;
  readonly lastNameInputHeading: Locator;
  readonly lastNameInput: Locator;
  readonly lastNameError: Locator;
  readonly dateOfBirthHeading: Locator;
  readonly dateOfBirthInputHeading: Locator;
  readonly dateOfBirthInput: Locator;
  readonly dateOfBirthInvalid: Locator;
  readonly dateOfBirthError: Locator;
  readonly emailHeading: Locator;
  readonly emailInputHeading: Locator;
  readonly emailInput: Locator;
  readonly emailError: Locator;
  readonly receiveInfoHeading: Locator;
  readonly receiveInfoChoice: Locator;
  readonly receiveInfoCheckbox: Locator;
  readonly alternateFormLink: Locator;
  readonly locationsLink: Locator;
  readonly editPersonalInfoButton: Locator;

  // Address section
  readonly addressHeading: Locator;
  readonly streetHeading: Locator;
  readonly streetAddressInvalid: Locator;
  readonly streetAddressError: Locator;
  readonly cityHeading: Locator;
  readonly cityError: Locator;
  readonly stateHeading: Locator;
  readonly stateError: Locator;
  readonly postalCodeHeading: Locator;
  readonly postalCodeError: Locator;
  readonly editAddressButton: Locator;

  // Account section
  readonly createYourAccountHeading: Locator;
  readonly usernameHeading: Locator;
  readonly usernameInputHeading: Locator;
  readonly usernameInput: Locator;
  readonly usernameError: Locator;
  readonly availableUsernameButton: Locator;
  readonly availableUsernameMessage: Locator;
  readonly unavailableUsernameMessage: Locator;
  readonly passwordHeading: Locator;
  readonly passwordInputHeading: Locator;
  readonly passwordInput: Locator;
  readonly passwordError: Locator;
  readonly verifyPasswordInputHeading: Locator;
  readonly verifyPasswordInput: Locator;
  readonly verifyPasswordError: Locator;
  readonly showPasswordLabel: Locator;
  readonly homeLibraryHeading: Locator;
  readonly selectHomeLibrary: Locator;
  readonly homeLibraryError: Locator;
  readonly cardholderTermsLink: Locator;
  readonly rulesRegulationsLink: Locator;
  readonly privacyPolicyLink: Locator;
  readonly acceptTermsLabel: Locator;
  readonly acceptTermsError: Locator;
  readonly editAccountButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page, appContent?: any) {
    this.page = page;

    const required = appContent?.required || "required";
    const withRequired = (label: string) => `${label} (${required})`;
    const edit = appContent?.button?.edit || "Edit";
    const withEdit = (label: string) => `${edit} ${label}`;

    this.mainHeading = page.getByRole("heading", {
      name: appContent?.banner?.title || "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = page.getByRole("heading", {
      name:
        appContent?.review?.title || "Step 5 of 5: Confirm your information",
      level: 2,
      exact: true,
    });

    // Personal Information section
    this.personalInfoHeading = page.getByRole("heading", {
      name: appContent?.review?.section?.personal || "Personal information",
      level: 3,
    });
    this.firstNameHeading = page.getByText(
      appContent?.personal?.firstName?.label || "First name",
      { exact: true }
    );
    this.firstNameInputHeading = page.getByText(
      withRequired(appContent?.personal?.firstName?.label || "First name"),
      {
        exact: true,
      }
    );
    this.firstNameInput = page.getByRole("textbox", {
      name: withRequired(
        appContent?.personal?.firstName?.label || "First name"
      ),
      exact: true,
    });
    this.firstNameError = page.getByText(
      appContent?.personal?.errorMessage?.firstName ||
        "There was a problem. Please enter a valid first name."
    );
    this.lastNameHeading = page.getByText(
      appContent?.personal?.lastName?.label || "Last name",
      { exact: true }
    );
    this.lastNameInputHeading = page.getByText(
      withRequired(appContent?.personal?.lastName?.label || "Last name"),
      {
        exact: true,
      }
    );
    this.lastNameInput = page.getByRole("textbox", {
      name: withRequired(appContent?.personal?.lastName?.label || "Last name"),
      exact: true,
    });
    this.lastNameError = page.getByText(
      appContent?.personal?.errorMessage?.lastName ||
        "There was a problem. Please enter a valid last name."
    );
    this.dateOfBirthHeading = page.getByText(
      appContent?.personal?.birthdate?.label || "Date of birth",
      { exact: true }
    );
    this.dateOfBirthInputHeading = page.getByText(
      withRequired(appContent?.personal?.birthdate?.label || "Date of birth"),
      {
        exact: true,
      }
    );
    this.dateOfBirthInput = page.getByRole("textbox", {
      name: withRequired(
        appContent?.personal?.birthdate?.label || "Date of birth"
      ),
      exact: true,
    });
    this.dateOfBirthInvalid = this.page.getByText(
      appContent?.personal?.errorMessage?.birthdate ||
        "There was a problem. Please enter a valid date, MM/DD/YYYY, including slashes."
    );
    this.dateOfBirthError = this.page.getByText(
      appContent?.personal?.errorMessage?.ageGate ||
        "There was a problem. Date of birth is below the minimum age of 13."
    );
    this.emailHeading = page.getByText(
      appContent?.personal?.email?.label || "Email address",
      { exact: true }
    );
    this.emailInputHeading = page.getByText(
      withRequired(appContent?.personal?.email?.label || "Email address"),
      {
        exact: true,
      }
    );
    this.emailInput = page.getByRole("textbox", {
      name: withRequired(appContent?.personal?.email?.label || "Email address"),
      exact: true,
    });
    this.emailError = page.getByText(
      appContent?.personal?.errorMessage?.email ||
        "There was a problem. Please enter a valid email address."
    );
    this.receiveInfoHeading = page.getByText(
      appContent?.review?.receiveNewsletter ||
        "Receive information about NYPL's programs and services",
      { exact: true }
    );
    this.receiveInfoChoice = page.getByText(appContent?.review?.yes || "Yes", {
      exact: true,
    });
    this.receiveInfoCheckbox = page.getByText(
      appContent?.personal?.eCommunications?.labelText ||
        "Yes, I would like to receive information about NYPL's programs and services",
      { exact: true }
    );
    this.alternateFormLink = this.page.getByRole("link", {
      name: appContent?.personal?.email?.alternateForm || "alternate form",
    });
    this.locationsLink = this.page.locator("#mainContent").getByRole("link", {
      name: appContent?.personal?.email?.locations || "locations",
    });
    this.editPersonalInfoButton = page.getByRole("button", {
      name: withEdit(
        appContent?.review?.section?.personal || "Edit Personal information"
      ),
      exact: true,
    });

    // Address section
    this.addressHeading = page.getByRole("heading", {
      name: appContent?.review?.section?.address?.label || "Address",
      level: 3,
      exact: true,
    });
    this.streetHeading = page.getByText(
      appContent?.location?.address?.line1?.label || "Street address",
      { exact: true }
    );
    this.streetAddressInvalid = page.getByText(
      "There was a problem. Please enter a valid home street address."
    ); // ref other translation file
    this.streetAddressError = page.getByText(
      "Street address fields must not be more than 100 lines."
    ); // ref other translation file
    this.cityHeading = page.getByText(
      appContent?.location?.address?.city?.label || "City",
      { exact: true }
    );
    this.cityError = page.getByText(
      "There was a problem. Please enter a valid home city."
    ); // ref other translation file
    this.stateHeading = page.getByText(
      appContent?.location?.address?.state?.label || "State",
      { exact: true }
    );
    this.stateError = page.getByText(
      "There was a problem. Please enter a 2-character home state abbreviation."
    ); // ref other translation file
    this.postalCodeHeading = page.getByText(
      appContent?.location?.address?.postalCode?.label || "Postal code",
      { exact: true }
    );
    this.postalCodeError = page.getByText(
      "There was a problem. Please enter a 5 or 9-digit home postal code."
    ); // ref other translation file
    this.editAddressButton = page.getByRole("button", {
      name: withEdit(appContent?.review?.section?.address?.label || "Address"),
      exact: true,
    });

    // Account section
    this.createYourAccountHeading = page.getByRole("heading", {
      name: appContent?.review?.createAccount || "Create your account",
      level: 3,
    });
    this.usernameHeading = page.getByText(
      appContent?.account?.username?.label || "Username",
      { exact: true }
    );
    this.usernameInputHeading = page.getByText(
      withRequired(appContent?.account?.username?.label || "Username"),
      {
        exact: true,
      }
    );
    this.usernameInput = page.getByRole("textbox", {
      name: withRequired(appContent?.account?.username?.label || "Username"),
      exact: true,
    });
    this.usernameError = page.getByText(
      appContent?.account?.errorMessage?.username ||
        "There was a problem. Username must be between 5-25 alphanumeric characters."
    );
    this.availableUsernameButton = page.getByRole("button", {
      name:
        appContent?.account?.username?.checkButton ||
        "Check if username is available",
      exact: true,
    });
    this.availableUsernameMessage = page
      .getByText("El nombre de usuario está disponible.") // update with translation when available
      .or(page.getByText("This username is available."));
    this.unavailableUsernameMessage = page
      .getByText("Este nombre de usuario no está disponible. Pruebe con otro.") // update with translation when available
      .or(page.getByText("This username is unavailable. Please try another."));
    this.passwordHeading = page.getByText(
      appContent?.account?.password?.label || "Password",
      { exact: true }
    );
    this.passwordInputHeading = page.getByText(
      withRequired(appContent?.account?.password?.label || "Password"),
      {
        exact: true,
      }
    );
    this.passwordInput = page.getByRole("textbox", {
      name: withRequired(appContent?.account?.password?.label || "Password"),
      exact: true,
    });
    this.passwordError = page.getByText(
      appContent?.account?.errorMessage?.password ||
        "There was a problem. Your password must be at least 8 characters, include a mixture of both uppercase and lowercase letters, include a mixture of letters and numbers, and have at least one special character except period (.)"
    );
    this.verifyPasswordInputHeading = page.getByText(
      withRequired(
        appContent?.account?.verifyPassword?.label || "Verify password"
      ),
      {
        exact: true,
      }
    );
    this.verifyPasswordInput = page.getByRole("textbox", {
      name: withRequired(
        appContent?.account?.verifyPassword?.label || "Verify password"
      ),
      exact: true,
    });
    this.verifyPasswordError = page.getByText(
      appContent?.account?.errorMessage?.verifyPassword ||
        "There was a problem. The two passwords don't match."
    );
    this.showPasswordLabel = page.getByText(
      appContent?.account?.showPassword || "Show password",
      {
        exact: true,
      }
    );
    this.homeLibraryHeading = page.getByText(
      appContent?.account?.library?.title || "Home library",
      { exact: true }
    );
    this.selectHomeLibrary = page.getByLabel(
      appContent?.account?.library?.selectLibrary || "Select a home library:"
    );
    this.homeLibraryError = page.getByText(
      appContent?.account?.errorMessage?.homeLibraryCode ||
        "There was a problem. Please select a home library."
    );
    this.cardholderTermsLink = page.getByRole("link", {
      name:
        appContent?.account?.termsAndCondition?.termsConditions ||
        "Cardholder Terms and Conditions",
    });
    this.rulesRegulationsLink = page.getByRole("link", {
      name:
        appContent?.account?.termsAndCondition?.rulesRegulations ||
        "Rules and Regulations",
    });
    this.privacyPolicyLink = page.locator("#mainContent").getByRole("link", {
      name:
        appContent?.account?.termsAndCondition?.privacyPolicy ||
        "Privacy Policy",
    });
    this.acceptTermsLabel = page.getByText(
      appContent?.account?.termsAndCondition?.label ||
        "Yes, I accept the terms and conditions.",
      {
        exact: true,
      }
    );
    this.acceptTermsError = page.getByText(
      appContent?.account?.errorMessage?.acceptTerms ||
        "There was a problem. The Terms and Conditions must be checked."
    );
    this.editAccountButton = page.getByRole("button", {
      name: withEdit(
        appContent?.review?.createAccount || "Create your account"
      ),
      exact: true,
    });
    this.submitButton = page.getByRole("button", {
      name: appContent?.button?.submit || "Submit",
      exact: true,
    });
  }

  getText(expected: string) {
    return this.page.getByText(expected, { exact: true });
  }
}
