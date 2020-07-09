import React from 'react';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import forIn from 'lodash/forIn';
import { isEmail, isLength, isAlphanumeric } from 'validator';
import { isDate } from '../../utils/FormValidationUtils';
import FormField from '../FormField/FormField';
import ApiErrors from '../ApiErrors/ApiErrors';
import config from '../../../appConfig';

interface LibraryCardFormState {
  agencyType: string;
  csrfToken: string;
  focusOnResult: boolean;
  formProcessing: boolean;
  formEntrySuccessful: boolean,
  apiResults: any;
  fieldErrors: any;
  patronFields: any;
}

class LibraryCardForm extends React.Component<{}, LibraryCardFormState> {
  dynamicSection = React.createRef<HTMLDivElement>();
  stateName = React.createRef<any>();
  firstName = React.createRef<any>();
  lastName = React.createRef<any>();
  dateOfBirth = React.createRef<any>();
  email = React.createRef<any>();
  line1 = React.createRef<any>();
  zip = React.createRef<any>();
  city = React.createRef<any>();
  username = React.createRef<any>();
  pin = React.createRef<any>();

  constructor(props) {
    super(props);
    this.state = {
      agencyType: '',
      csrfToken: '',
      formEntrySuccessful: false,
      focusOnResult: false,
      formProcessing: false,
      apiResults: {},
      fieldErrors: {},
      patronFields: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
        username: '',
        pin: '',
        ecommunicationsPref: true,
        location: '',
      },
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }


  componentDidMount() {
    const csrfToken = this.getMetaTagContent('name=csrf-token');
    if (csrfToken) {
      const patronFields = Object.assign(
        this.state.patronFields,
        {
          location: this.getUrlParameter('form_type') || 'nyc',
        });

      this.setState({ csrfToken, patronFields });
    }
  }

  componentDidUpdate() {
    if (this.state.focusOnResult) {
      this.focusOnApiResponse();
      if (document && document.title !== '') {
        document.title = 'Form Submission Error | NYPL';
      }
    }
  }

  getMetaTagContent(tag) {
    return document.head.querySelector(`[${tag}]`).textContent;
  }

  getUrlParameter(name) {
    if (typeof location === 'undefined') return '';

    const paramName = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${paramName}=([^&#]*)`);
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  getPatronAgencyType(agencyTypeParam) {
    const { agencyType } = config;
    return (!isEmpty(agencyTypeParam) && agencyTypeParam.toLowerCase() === 'nys')
      ? agencyType.nys : agencyType.default;
  }

  getFullName() {
    const {
      firstName,
      lastName,
    } = this.state.patronFields;

    return (!isEmpty(firstName) && !isEmpty(lastName)) ? (
      `${firstName.trim()} ${lastName.trim()}`
    ) : null;
  }

  focusOnApiResponse() {
    setTimeout(() => {
      if (this.dynamicSection) {
        this.dynamicSection.current.focus();
        this.setState({ focusOnResult: false });
      }
    }, 1000);
  }

  validateField(fieldName, value) {
    const { fieldErrors } = this.state;
    let currentErrors = {};

    switch (fieldName) {
      case 'dateOfBirth':
        if (!isDate(value)) {
          fieldErrors[fieldName] = 'Please enter a valid date, MM/DD/YYYY, including slashes.';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'email':
        if (value.trim().length > 0 && !isEmail(value)) {
          fieldErrors[fieldName] = 'Please enter a valid email address.';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'username':
        if (!isLength(value, { min: 5, max: 25 })) {
          fieldErrors[fieldName] = 'Username must be between 5-25 alphanumeric characters.';
          currentErrors = fieldErrors;
        } else if (!isAlphanumeric(value)) {
          fieldErrors[fieldName] = 'Only alphanumeric characters are allowed.';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'pin':
        if (value.length !== 4 || isNaN(value)) {
          fieldErrors[fieldName] = 'Please enter a 4-digit PIN.';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'firstName':
        if (isEmpty(value)) {
          fieldErrors[fieldName] = 'Please enter a valid first name.';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'lastName':
        if (isEmpty(value)) {
          fieldErrors[fieldName] = 'Please enter a valid last name.';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'location':
        if (isEmpty(value)) {
          fieldErrors[fieldName] = 'Please select an address option.';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'line1':
        if (isEmpty(value)) {
          fieldErrors[fieldName] = 'Please enter a valid street address.';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'city':
        if (isEmpty(value)) {
          fieldErrors[fieldName] = 'Please enter a valid city.';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'state':
        if (isEmpty(value) || !isLength(value, { min: 2, max: 2 })) {
          fieldErrors[fieldName] = 'Please enter a 2-character state abbreviation.';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'zip':
        if (isEmpty(value) || isNaN(value) || !isLength(value, { min: 5, max: 5 })) {
          fieldErrors[fieldName] = 'Please enter a 5-digit postal code.';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'line2':
        currentErrors = fieldErrors;
        break;
      case 'ecommunicationsPref':
        currentErrors = fieldErrors;
        break;
      default:
        break;
    }

    this.setState({ fieldErrors: currentErrors });
  }

  focusOnErrorElement() {
    // Handle focusing on first element in the object that contains an error
    Object.keys(this.state.fieldErrors).some((key) => {
      if (this.state.fieldErrors[key]) {
        // the keyword state is reserved in React, therefore the reference to the State field
        // is renamed to stateName
        if (key === 'state') {
          this.stateName.current.focus();
          return true;
        }

        this[key] && this[key].current.focus();
        return true;
      }
      return true;
    });
  }

  handleInputChange(property) {
    return (event) => {
      const target = event.target;
      const value = (target.type === 'checkbox') ? target.checked : target.value;
      const newState = assign({}, this.state.patronFields, { [property]: value });
      this.setState({ patronFields: newState });
    };
  }

  handleOnBlur(property) {
    return (event) => {
      const target = event.target;
      const value = target.value;

      this.validateField(property, value);
    };
  }

  handleSubmit(event) {
    // Clearing server side errors for re-submission.
    this.setState({ apiResults: {} });
    event.preventDefault();

    // Iterate through patron fields and ensure all fields are valid
    forIn(this.state.patronFields, (value, key) => {
      this.validateField(key, value);
    });

    // Has client-side errors, stop processing
    if (!isEmpty(this.state.fieldErrors)) {
      // A required form field contains an error, focus on the first error field
      this.focusOnErrorElement();
    } else {
      // No client-side errors, form is now processing
      this.setState({ formProcessing: true });

      const {
        firstName,
        lastName,
        email,
        dateOfBirth,
        line1,
        line2,
        city,
        state,
        zip,
        username,
        pin,
        ecommunicationsPref,
      } = this.state.patronFields;
      const agencyType = this.getPatronAgencyType(this.state.patronFields.location);

      // The new and simplier endpoint:
      axios.post('/api/create-patron', {
        firstName,
        lastName,
        email,
        dateOfBirth,
        line1,
        line2,
        city,
        state,
        zip,
        username,
        pin,
        ecommunicationsPref,
        agencyType,
      }, {
        headers: { 'csrf-token': this.state.csrfToken },
      })
      .then((response) => {
        this.setState({
          formProcessing: false,
          formEntrySuccessful: false,
          apiResults: response.data,
        });
        // TODO: Waiting on whether we will make a redirect in the app
        // or in Drupal.
        // window.location.href = window.confirmationURL;
      })
      .catch((error) => {
        this.setState({ formProcessing: false, focusOnResult: true });
        if (error.response && error.response.data) {
          // The request was made, but the server responded with a status code
          // that falls out of the range of 2xx
          this.setState({ apiResults: error.response.data });
        }
      });
    }
  }

  renderLoader() {
    const { formProcessing } = this.state;
    return formProcessing ? <div className="loading" /> : null;
  }

  renderApiErrors(errorObj) {
    if (!isEmpty(errorObj) && errorObj.status >= 400) {
      return (
        <ApiErrors
          ref={this.dynamicSection}
          apiResults={errorObj}
        />
      );
    }

    return null;
  }

  renderFormFields() {
    return (
      <form className="nypl-library-card-form" onSubmit={this.handleSubmit}>
        <h2>Please enter the following information</h2>
        <h3>Personal Information</h3>
        <div className="nypl-name-field">
          <FormField
            id="patronFirstName"
            type="text"
            label="First Name"
            fieldName="firstName"
            isRequired
            value={this.state.patronFields.firstName}
            handleOnChange={this.handleInputChange('firstName')}
            errorState={this.state.fieldErrors}
            onBlur={this.handleOnBlur('firstName')}
            childRef={this.firstName}
          />
          <FormField
            id="patronLastName"
            type="text"
            label="Last Name"
            fieldName="lastName"
            isRequired
            value={this.state.patronFields.lastName}
            handleOnChange={this.handleInputChange('lastName')}
            errorState={this.state.fieldErrors}
            onBlur={this.handleOnBlur('lastName')}
            childRef={this.lastName}
          />
        </div>
        <FormField
          id="patronDob"
          className="nypl-date-field"
          type="text"
          instructionText="MM/DD/YYYY, including slashes"
          label="Date of Birth"
          fieldName="dateOfBirth"
          isRequired
          value={this.state.patronFields.dateOfBirth}
          handleOnChange={this.handleInputChange('dateOfBirth')}
          errorState={this.state.fieldErrors}
          maxLength={10}
          onBlur={this.handleOnBlur('dateOfBirth')}
          childRef={this.dateOfBirth}
        />
        <FormField
          id="patronEmail"
          className="nypl-text-field"
          type="text"
          label="E-mail"
          fieldName="email"
          value={this.state.patronFields.email}
          handleOnChange={this.handleInputChange('email')}
          errorState={this.state.fieldErrors}
          onBlur={this.handleOnBlur('email')}
          childRef={this.email}
        />
        <FormField
          id="patronECommunications"
          className={this.state.patronFields.ecommunicationsPref ? 'nypl-terms-checkbox checked' :
            'nypl-terms-checkbox'}
          type="checkbox"
          label="Receive emails"
          fieldName="ecommunicationsPref"
          instructionText={'Yes, I would like to receive information about NYPL\'s programs ' +
          'and services.'}
          handleOnChange={this.handleInputChange('ecommunicationsPref')}
          value={this.state.patronFields.ecommunicationsPref}
          checked={this.state.patronFields.ecommunicationsPref}
        />
        <h3>Address</h3>

        <div className="nypl-radiobutton-field">
          <fieldset>
            <legend id="radiobutton-location">
              I live, work, go to school, or pay property taxes at an address in: <span className="nypl-required-field"> Required</span>
            </legend>
            <label id="radiobutton-location_nyc" htmlFor="location-nyc">
              <input
                aria-labelledby="radiobutton-location radiobutton-location_nyc"
                id="location-nyc"
                type="radio"
                name="location"
                value="nyc"
                checked={this.state.patronFields.location === 'nyc'}
                onChange={this.handleInputChange('location')}
              />
              New York City (All five boroughs)
            </label>
            <label id="radiobutton-location_nys" htmlFor="location-nys">
              <input
                aria-labelledby="radiobutton-location radiobutton-location_nys"
                id="location-nys"
                type="radio"
                name="location"
                value="nys"
                checked={this.state.patronFields.location === 'nys'}
                onChange={this.handleInputChange('location')}
              />
              New York State (Outside NYC)
            </label>
            <label id="radiobutton-location_us" htmlFor="location-us">
              <input
                aria-labelledby="radiobutton-location radiobutton-location_us"
                id="location-us"
                type="radio"
                name="location"
                value="us"
                checked={this.state.patronFields.location === 'us'}
                onChange={this.handleInputChange('location')}
              />
              United States (Visiting NYC)
            </label>
          </fieldset>
        </div>

        <p className="nypl-address-note">
          If your address is outside the United States, please use our <a href="https://catalog.nypl.org/selfreg/patonsite">alternate form</a>.
        </p>

        <FormField
          id="patronStreet1"
          className="nypl-text-field"
          type="text"
          label="Street Address"
          fieldName="line1"
          isRequired
          value={this.state.patronFields.line1}
          handleOnChange={this.handleInputChange('line1')}
          errorState={this.state.fieldErrors}
          onBlur={this.handleOnBlur('line1')}
          childRef={this.line1}
        />
        <FormField
          id="patronStreet2"
          className="nypl-text-field"
          type="text"
          label="Apartment / Suite"
          fieldName="line2"
          value={this.state.patronFields.line2}
          handleOnChange={this.handleInputChange('line2')}
          onBlur={this.handleOnBlur('line2')}
        />
        <FormField
          id="patronCity"
          className="nypl-text-field"
          type="text"
          label="City"
          fieldName="city"
          value={this.state.patronFields.city}
          isRequired
          handleOnChange={this.handleInputChange('city')}
          errorState={this.state.fieldErrors}
          onBlur={this.handleOnBlur('city')}
          childRef={this.city}
        />
        <FormField
          id="patronState"
          className="nypl-text-field"
          type="text"
          instructionText="2-letter abbreviation"
          label="State"
          fieldName="state"
          value={this.state.patronFields.state}
          isRequired
          handleOnChange={this.handleInputChange('state')}
          errorState={this.state.fieldErrors}
          maxLength={2}
          onBlur={this.handleOnBlur('state')}
          childRef={this.stateName}
        />
        <FormField
          id="patronZip"
          className="nypl-text-field"
          type="text"
          label="Postal Code"
          fieldName="zip"
          value={this.state.patronFields.zip}
          isRequired
          handleOnChange={this.handleInputChange('zip')}
          errorState={this.state.fieldErrors}
          maxLength={5}
          onBlur={this.handleOnBlur('zip')}
          childRef={this.zip}
        />
        <h3>Create Your Account</h3>
        <FormField
          id="patronUsername"
          className="nypl-text-field"
          type="text"
          label="Username"
          fieldName="username"
          instructionText="5-25 alphanumeric characters"
          value={this.state.patronFields.username}
          isRequired
          handleOnChange={this.handleInputChange('username')}
          errorState={this.state.fieldErrors}
          maxLength={25}
          onBlur={this.handleOnBlur('username')}
          childRef={this.username}
        />
        <FormField
          id="patronPin"
          className="nypl-text-field"
          type="text"
          label="PIN"
          fieldName="pin"
          instructionText="4 digits"
          value={this.state.patronFields.pin}
          isRequired
          handleOnChange={this.handleInputChange('pin')}
          errorState={this.state.fieldErrors}
          maxLength={4}
          onBlur={this.handleOnBlur('pin')}
          childRef={this.pin}
        />

        <p>
          By submitting an application, you understand and agree to our <a href="https://www.nypl.org/help/library-card/terms-conditions">Cardholder Terms and Conditions</a> and
          agree to our <a href="https://www.nypl.org/help/about-nypl/legal-notices/rules-and-regulations">Rules and Regulations</a>. To learn more about The Library’s use of personal information, please read
          our <a href="https://www.nypl.org/help/about-nypl/legal-notices/privacy-policy">Privacy Policy</a>.
        </p>

        <div>
          <input
            className="nypl-request-button"
            disabled={this.state.formProcessing}
            type="submit"
            value="Continue"
          />
          {this.renderLoader()}
        </div>
      </form>
    );
  }

  render() {
    return (
      <div className="nypl-row">
        <div className="nypl-column-half nypl-column-offset-one">
          <div>
            {this.renderApiErrors(this.state.apiResults)}
            {this.renderFormFields()}
          </div>
          <div className="nypl-library-card-form">
            <h2>What to Expect Next</h2>
            <p>
              After you submit your application, you will see a confirmation page with a temporary account number,
              and you will be able to log in and request books and materials. To get your card, follow the confirmation
              page instructions. You may also apply in person at any <a href="https://www.nypl.org/locations">library location</a> in
              the Bronx, Manhattan,
              or Staten Island.
            </p>
            <h2>Applying in Person</h2>
            <p>
              <a href="https://www.nypl.org/help/library-card/terms-conditions#juv">Children 12 and under</a>, <a href="https://www.nypl.org/help/library-card/terms-conditions#download">classrooms and other groups</a>,&nbsp;
              <a href="https://www.nypl.org/help/library-card/terms-conditions#Educator%20Cards">educators</a>, <a href="https://www.nypl.org/help/library-card/terms-conditions#homebound">homebound individuals</a>,
              and <a href="https://www.nypl.org/help/library-card/terms-conditions#organizational">organizational</a> borrowers should apply in person or
              download the appropriate <a href="https://www.nypl.org/help/library-card/terms-conditions#download">library card application form</a>.
            </p>
            <h2>Learn More</h2>
            <p>
              <a href="https://www.nypl.org/help/library-card/terms-conditions">Who is eligible for an NYPL card?</a>
            </p>
            <p>
              <a href="https://www.nypl.org/help/library-card#renew">How to validate or renew your NYPL card</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default LibraryCardForm;
