import React from 'react';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import forIn from 'lodash/forIn';
import { isEmail, isLength, isAlphanumeric } from 'validator';
import { isDate } from '../../../utils/FormValidationUtils';
import FormField from '../../components/FormField/FormField';
import ApiErrors from '../../components/ApiErrors/ApiErrors';
import config from './../../../../appConfig';

class LibraryCardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csrfToken: '',
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
        ecommunications_pref: true,
      },
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }

  componentDidMount() {
    const csrfToken = this.getMetaTagContent('name=csrf-token');

    if (csrfToken) {
      this.setState({ csrfToken });
    }
  }

  componentDidUpdate() {
    if (this.state.focusOnResult) {
      this.focusOnApiResponse();
    }
  }

  getMetaTagContent(tag) {
    return document.head.querySelector(`[${tag}]`).content;
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
    if (this.dynamicSection) {
      this.dynamicSection.focus();
      this.setState({ focusOnResult: false });
    }
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
        if (value.length > 0 && !isEmail(value)) {
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
      case 'ecommunications_pref':
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
          this.stateName.focus();
          return true;
        }

        this[key].focus();
        return true;
      }
      return true;
    });
  }

  handleInputChange(property) {
    return (event) => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
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
        ecommunications_pref,
      } = this.state.patronFields;

      axios.post('/library-card/new/create-patron', {
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
        ecommunications_pref,
      }, {
        headers: { 'csrf-token': this.state.csrfToken },
      })
        .then((response) => {
          this.setState({
            formProcessing: false,
            formEntrySuccessful: false,
            apiResults: response.data,
          });
          window.location.href = `${config.confirmationURL.base}?patronID=${response.data.response.patron_id}&patronName=${this.getFullName()}`;
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
          childRef={(el) => { this.dynamicSection = el; }}
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
            childRef={(el) => { this.firstName = el; }}
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
            childRef={(el) => { this.lastName = el; }}
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
          childRef={(el) => { this.dateOfBirth = el; }}
        />
        <h3>Address</h3>
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
          childRef={(el) => { this.line1 = el; }}
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
          childRef={(el) => { this.city = el; }}
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
          childRef={(el) => { this.stateName = el; }}
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
          childRef={(el) => { this.zip = el; }}
        />
        <h3>Create Your Account</h3>
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
          childRef={(el) => { this.email = el; }}
        />
        <FormField
          id="patronECommunications"
          className={this.state.patronFields.ecommunications_pref ? 'nypl-terms-checkbox checked' :
            'nypl-terms-checkbox'}
          type="checkbox"
          label="Email Checkbox"
          fieldName="ecommunications_pref"
          instructionText={'Yes, I would like to receive information about NYPL\'s programs ' +
          'and services.'}
          handleOnChange={this.handleInputChange('ecommunications_pref')}
          value={this.state.patronFields.ecommunications_pref}
          checked={this.state.patronFields.ecommunications_pref}
        />
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
          childRef={(el) => { this.username = el; }}
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
          childRef={(el) => { this.pin = el; }}
        />
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
        </div>
      </div>
    );
  }
}

export default LibraryCardForm;