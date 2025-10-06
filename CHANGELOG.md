## CHANGE LOG

### Unreleased

- Add Playwright tests to confirm elements on account page [SWIS-69](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-69)
- Changed the baseUrl in playwright.config.ts [SWIS-87](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-87)
- Add Playwright tests to confirm invalid value errors on address page [SWIS-63](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-63)
- Add Playwright test to confirm address verification page [SWIS-54](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-54)
- Add Playwright tests to confirm errors display on account page [SWIS-72](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-72)
- Add Playwright test to input patron's personal info [SWIS-85](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-85)
- Add Playwright test to confirm congrats page [SWIS-86](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-86)
- Prettier updates [SWIS-96](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-96)
- Remove duplicate Playwright files testing the address page
- Add Playwright test to confirm user input on alternate address page [SWIS-91](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-91)
- Add Playwright assertions to confirm headings display on personal information page [SWIS-99](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-99)
- Add Playwright test to confirm user input for address verification page [SWIS-90](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-90)
- Add Playwright test to confirm alternative form and location link on personal page [SWIS-102](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-102)
- Add Playwright test to confirm user input on home address page [SWIS-89](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-89)
- Enable eslint 9 [SWIS-94](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-94)
- Add Playwright util to fill in forms [SWIS-115](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-115)

### 1.2.6

- Playwright test for Step 1: Personal Information and error validation [SWIS-40](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-40)
- Add Playwright tests to confirm elements on landing page [SWIS-39](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-39)
- Add Playwright tests to confirm elements on location page and error validation [SWIS-42](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-42)
- Add Prettier job to CI workflow [SWIS-61](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-61)
- Clean up Playwright tests and folders [SWIS-56](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-56)
- Upgrade nextjs to v14 [SWIS-33](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-33)
- Upgrade nextjs to v15 [SWIS-55](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-55)
- Add Playwright tests to confirm elements on alternate address page [SWIS-58](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-58)
- Remove SimplyE reference on Success Page [SWIS-68](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-68)

### 1.2.5

- Updates to confirmation barcode layout [SWIS-12](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-12)
- Add New Relic setup [SWIS-13](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-13)
- Install Playwright [SWIS-38](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-38)
- Set up GitHub Actions workflow with Playwright tests [SWIS-41](https://newyorkpubliclibrary.atlassian.net/browse/SWIS-41)

### 1.2.4

- replace home library free text input with select drop down[SCC-4660](https://newyorkpubliclibrary.atlassian.net/browse/SCC-4660)
- revert verify password match to original state
- update auth url [SCC-4657](https://newyorkpubliclibrary.atlassian.net/browse/SCC-4657)
- replace SimplyE label with EBranch [SCC-4659](https://newyorkpubliclibrary.atlassian.net/browse/SCC-4659)

### 1.2.3 Fix PIN translation errors

- use password instructions for "PIN is trivial" error translation
- add id's to facilitate QA testing in other languages

### 1.2.2 CSRF and resubmission bugs

- remove csrf token from reducer state, instead pass in as prop
- add more descriptive server logs for csrf token debugging
- use react-hook-form data in final post request
- remove double submit buttons from form submission after error response. See [this pr description](https://github.com/NYPL/nypl-library-card-app/pull/289) for more info
- update next version
- fix passwords do not match bug in ReviewFormContainer

### 1.2.1 Mask PIN error message

- Transform Sierra error message "PIN is trivial" to something more legible to users

### v1.2.0 GTM Update (3/27)

- Adds new GTM code snippet and removes older GA code.
- Adds GTM event tracking for form submission.
- More logs for debugging CSRF issues.

### 1.1.2 Hot fix 3/20

- Updating the legacy catalog library card form link to `https://on.nypl.org/internationalresearch`.

### v1.1.1 Fix CSRF regression

- Ensure that CSRF headers are not overwritten by nyplUserHasRegistered headers
- Refactor CSRF utils

### v1.1.0 Duplicate patron bug fixes

- Add cookie-based redirect back to congrats page from any page after success
- Remove hasUsernameBeenValidated flag and hidden input field
- Update loading layer to remain until navigation away from submission page
- Remove password display from congrats graphic

### v1.0.0 Remediation Project (security) update

- Switch deployment to GitHub Actions
- Remove EB related code and language, move to ECS
- Update node version to 20
- Update next version to 12
- Updates to dependencies to match
- Add script to package.json for clearing the test cache (this is just a convenience since I was updating so frequently, can be removed)
- Update a bunch of packages related to testing (@testing-library/jest-dom, @testing-library/react, @types/jest, @types/jest-axe, jest, jest-axe)
- Specify the testEnvironment as jsdom
- Add package jest-environment-jsdom since this is not included automatically anymore
- Replace @testing-library/jest-dom/extend-expect with @testing-library/jest-dom since this is now included
- The only real substantive change is updating next to 12, which is as high as it can go without breaking anything

### v0.9.4 - New DS Header/Footer

---

- Update the Header and Footer scripts to use the new Design System Header/Footer: [#194](https://github.com/NYPL/nypl-library-card-app/pull/194)
- Add new security provisioning script: [#197](https://github.com/NYPL/nypl-library-card-app/pull/197)
- Hot Fix Remove Setting of location field in formData: [#199](https://github.com/NYPL/nypl-library-card-app/pull/199)

---

### v0.9.3 - Adobe Analytics

#### Added

- Added Adobe Analytics initial script
- Added Adobe Analytics for event tracking

### v0.9.2

#### Added

- Banner text translations

### v0.9.1

#### Updated

- Updated Russian translations

### v0.9.0 - Multilingual support

#### Added

- Added the `next-i18next` package for internationalization support in Nextjs and React.
- Added ten (1) new languages to the app through translated JSON files: Arabic, Bengali, Chinese (Simplified), French, Haitian Creole, Korean, Polish, Russian, Spanish, and Urdu.

#### Updated

- Updated Nextjs configuration for multilingual support through its own `i18n` feature.
- Updated all static text to use the `next-i18next` package's `useTranslation` hook to translate text in a selected language.
- Updated the `html` element's `lang` attribute to be dynamic based on the selected language and the `dir` attribute to be dynamic based on the selected language's direction.
- Moves the embedded NYPL `Header` and the `Footer` component from `_app` to `_document` for better rendering.

### v0.8.0

#### Updated

- Updates React to version 17.
- Minor updates to other packages such as `react-hook-form`, `react-test-renderer`, and `babel-jest`.

### v0.7.11

#### Updated

- Adds LOG_LEVEL variable set to "warn" for qa and production
- Reduces log retention to 14 days
- Adds file system requirement of 16GB
- Increases swap space to 4GB
- Updates security suite to v6.33
- Updated the account page so that passwords no longer allow periods and related messaging for information and errors.

### v0.7.10

#### Updated

- Security Update: change CDN URL to point to ux-static.nypl.org.

### v0.7.9

#### Updated

- Updated the expiration date message for temporary cards from 30 to 14 days.

### v0.7.8

#### Fixed

- Fixed the logic check for passwords to check for a string that is 8 to 32 characters in length. The previous requirements were just strong encouragements for patrons to use.

### v0.7.7

#### Fixed

- Minor copy updates for pin/password update.

### v0.7.6

#### Updated

- Temporarily using the embedded NYPL Header.

### v0.7.5

#### Updated

- Updated npm packages to be stable and not point to bitbucket (for the NYPL Header).

### v0.7.4

#### Updated

- Updated the "pin" name attribute to "password" throughout the codebase and UI.

### v0.7.3

#### Updated

- Updated npm packages to fix security issues.

### v0.7.2

#### Fixed

- Fixed CSS issue where the colors on the "Get Started" and "Previous" buttons were not right. The larger issue might be CSS file ordering.

### v0.7.1

#### Updated

- Updated some components with accessibility enhancements.

### v0.7.0

#### Updated

- Updated Nextjs to version 10.
- Updated the Dockerfile in preparation to use with AWS ECS.
- Updated location for correct installation of npm packages.
- Updated the `react-axe` package to `@axe-core/react` since the former is deprecated.

### v0.6.7

#### Updated

- Updating how the first and last names are being sent to the Card Creator API so names include middle names and multiple (if any) last names.
- Updating how and when react-axe is called to reduce bundle size.

### v0.6.6

#### Updated

- Updating version to fix AWS deployment.

### v0.6.5

#### Updated

- Updated when the Location API, the service that converts an IP address into a geolocation object, is called in the application flow.
- Updated NYPL Design System to v0.19.1.

### v0.6.4

#### Fixed

- Fixed the styling for the confirmation page `/library-card/congrats` that allows patrons to be able to use the printed barcode graphic.

### v0.6.3

#### Added

- Added Dockerfile and docker-compose.yml files to build this application using Docker. This update is the first step in the longer process to use AWS ECS to build and deploy this application.
- Added instructions for building and running the app with https on localhost.

### v0.6.2

#### Updated

- Updated the Work/Alternate Address page to appear if the device location is in NYS but the Home Address is not in NYC.
- Updated Design System to v0.18.6.
- Updated copy to clarify the Work Address page and form fields.

### v0.6.1

#### Fixes

- Added a temporary static BUILD_ID variable for Nextjs to build in production.
- Removed CSRF token validation for now.
- Updated the work address page to not be required.
- Updated favicon.
- Fixed "edit" button in Review page for the Address fields.
- Updated the list of library names.
- Fixed issue rendering non-object error messages in the `ApiErrors` component.
- Fixed multiple calls for the IP address location lookup.

### v0.6.0

#### Updated

- Updated to use Nextjs for the server and updated app and api routes accordingly.
- Replaced Mocha with Jest, but still using Enzyme to test React components.
- Updated the API endpoints and the error/response objects from the API endpoint that the front-end will use.
- Updated the app's code structure, specifically in the `/src` folder.
- Updated environment variables to use Next's convention and removed the `dotenv` package.
- Updated internal API errors to be structured as problem details.
- Updated how API request errors are displayed to the user.
- Updated how Google Analytics tracks page views and events.

#### Removed

- Removed the `@nypl/design-toolkit` package.

#### Added

- Added Typescript for development.
- Added `react-hook-form` for processing the whole app's form.
- Added the NYPL Design System for react components.
- Added `react-testing-library` for UI testing.
- Added the `UsernameValidationForm` component to check for username availability in the ILS right away instead of waiting for the complete form to be submitted.
- Added the `LibraryListForm` component which renders a drop down list of libraries for patrons to select their home library.
- Added IP address server-side lookup and an API call to IP Stack to verify the user's location.
- Set up a `basePath` name for reverse proxy rules.

### v0.5.0

#### Updated

- Updated several packages, including Webpack, to the most recent versions possible.
- Updated to React 16.
- Added react-axe for accessibility review while doing development.

#### Added

- Implemented nodemon for local development.

### v0.4.27

- Updating @nypl/dgx-react-footer to 0.5.6.

### v0.4.26

- Updating @nypl/dgx-react-footer to 0.5.5.
- Updating Falcon Crowdstrike sensor to 5.29.

### v0.4.25

- Updating @nypl/dgx-react-footer to 0.5.4.

### v0.4.27

- Updating @nypl/dgx-react-footer to 0.5.6.

### v0.4.26

- Updating @nypl/dgx-react-footer to 0.5.5.
- Updating Falcon Crowdstrike sensor to 5.29.

### v0.4.25

- Updating @nypl/dgx-react-footer to 0.5.4.

### v0.4.24

#### Added

- Updated @nypl/dgx-header-component to 2.6.0.

### v0.4.23

#### Added

- Updated @nypl/dgx-header-component to 2.5.8.

### v0.4.22

#### Added

- Updated @nypl/dgx-header-component to 2.5.6.

### v0.4.21

#### Added

- Added the documents for QA not working.

### v0.4.20

#### Updated

- Updated the error message for the youngest age to get a library card online from 13 to 12.
- Installs Falcon Crowdstrike only on new Elastic Beanstalk instances.

### v0.4.19

#### Added

- Added Falcon Crowdstrike sensor to the operating system.

### v0.4.18

- Updating @nypl/dgx-react-footer to 0.5.2.

### v0.4.17

- Updating @nypl/dgx-header-component to 2.4.19.

### v0.4.16

- Updating @nypl/dgx-header-component to 2.4.15 and checking for QA in APP_ENV.

### v0.4.15

- Updating @nypl/dgx-header-component to 2.4.14 and setting APP_ENV.

### v0.4.14

- Updating @nypl/dgx-header-component to 2.4.13.

### v0.4.13

- Updating @nypl/dgx-header-component to 2.4.12.

### v0.4.12

- Update to use green from Design Toolkit

### v0.4.11

- Updates to form: add radio button, change ptype selection logic from query parameter to radio button
- Copy updates
- Bump Design Toolkit to latest version

### v0.4.10

- Updating @nypl/dgx-react-footer version to 0.5.1 and @nypl/dgx-header-component to 2.4.11.

### v0.4.9

- Updating @nypl/dgx-react-footer version to 0.5.0 and @nypl/dgx-header-component to 2.4.8.

### v0.4.8

#### Updated

- Remove patron information from redirect URL

### v0.4.7

#### Updated

- Add Google Analytics pageview event.

### v0.4.6

#### Updated

- Updated README to reflect new deployment strategies.

#### Added

- Added Travis CI for deployment to AWS Elastic Beanstalk.
- Added CHANGELOG as a separate file.
- Improved CHANGELOG format

### v0.4.5

#### Updated

- Updated the Header component to 2.4.7.
- Added OptinMonster for advocacy 2018.

### v0.4.4

#### Updated

- Updated the Header component to 2.4.5.

### v0.4.3

#### Updated

- Updated the Header component to 2.4.2 and Footer component to 0.4.1.

### v0.4.1

#### Updated

- Updated Header component version to 2.4.0.

### v0.4.1

#### Updated

- Updated header to v2.3.0 -- Includes FundraisingBanner integration

### v0.4.0

#### Added

- Initialized GA.

#### Updated

- Updated header to 2.2.0.

### v0.3.3

#### Updated

- Updated header to 2.1.1.

### v0.3.2

#### Updated

- Updated header to 2.1.0.
- Removed email as a required field.

### v0.3.1

### v0.3.0

### v0.2.1

#### Added

- Added support for NYS agency_type via URL parameter.

#### Updated

- Updated Patron Model to handle default and NYS agency type ID's.

### v0.2.0

#### Added

- Added react-router to the application for handling multiple pages.
- Added tests for <BarcodeContainer- and it's related functions.
- Added related functions for the email validation from server side.

#### Updated

- Updated the client side input field validation to be activated on blur.
- Updated the route for barcode service. It is commented out for current release.
- Updated server side validation, server error messages will be displayed in <ErrorBox- if client side validations fails.
