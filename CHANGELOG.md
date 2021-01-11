## CHANGE LOG

### v0.6.4

#### Fixed

- Fixed the styling for the confirmation page `/library-card/congrats` that allows patrons to be able to use the printed barcode graphic.

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
