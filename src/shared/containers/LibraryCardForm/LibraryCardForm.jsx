import React from 'react';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import forIn from 'lodash/forIn';
import { isEmail, isLength, isAlphanumeric } from 'validator';
import { isDate } from '../../../utils/FormValidationUtils';
import Confirmation from '../../components/Confirmation/Confirmation';
import FormField from '../../components/FormField/FormField';
import ErrorBox from '../../components/ErrorBox/ErrorBox';

class LibraryCardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csrfToken: '',
      focusOnResult: false,
      formProcessing: false,
      formEntrySuccessful: false,
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
  }

  componentDidMount() {
    const csrfToken = this.getMetaTagContent('name=csrf-token');

    if (csrfToken) {
      this.setState({ csrfToken });
    }
  }

  componentDidUpdate() {
    if (this.state.focusOnResult) {
      // this.focusOnApiResponse();
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
          fieldErrors[fieldName] = 'Please enter a 5 digits postal code.';
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
    }

    this.setState({ fieldErrors: currentErrors });
  }

  handleInputChange(property) {
    return (event) => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const newState = assign({}, this.state.patronFields, { [property]: value });

      this.setState(
        { patronFields: newState },
        () => {
          this.validateField(property, value);
        },
      );
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    forIn(this.state.patronFields, (value, key) => {
      this.validateField(key, value);
    });

    if (isEmpty(this.state.fieldErrors)) {
      // Form is now processing
      this.setState({ formProcessing: true, apiResults: {} });
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

      axios.post('new/create-patron', {
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
        // Debugging only (Alpha)
        console.log(response.data);
        this.setState({
          formProcessing: false,
          formEntrySuccessful: false,
          apiResults: response.data,
          focusOnResult: true,
        });
        window.location.href="https://www.nypl.org/get-help/library-card/confirmation" + "?" + "patronID=" + response.data.patron_id + "&" + "patronName=" + this.getFullName();
      })
      .catch((error) => {
        this.setState({ formProcessing: false, focusOnResult: true });
        if (error.response && error.response.data) {
          // The request was made, but the server responded with a status code
          // that falls out of the range of 2xx
          // Debugging only (Alpha)
          console.log(error.response.data);
          this.setState({ apiResults: error.response.data });
        }
      });
    }
  }

  renderConfirmation() {
    return this.state.formEntrySuccessful ?
      <Confirmation name={this.getFullName()} apiObject={this.state.apiResults} /> : null;
  }

  renderLoader() {
    const { formProcessing } = this.state;
    return formProcessing ? <div className="loading" /> : null;
  }

  renderApiErrors() {
    const { apiResults } = this.state;
    let resultMarkup;
    let errorClass = '';

    // TODO: Will be modified once we establish the correct API response from Wrapper
    if (!isEmpty(apiResults) && apiResults.status >= 300 && !apiResults.response.id) {
      errorClass = 'nypl-error-content';

      resultMarkup = <ErrorBox errorObject={apiResults.response} className="nypl-form-error" />;
    }

    return (
      <div className={errorClass}>
        { resultMarkup }
      </div>
    );
  }

  renderFormFields() {
    return !this.state.formEntrySuccessful ? (
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
          />
        </div>
        <FormField
          id="patronDob"
          className="nypl-date-field"
          type="text"
          ph="MM/DD/YYYY, including slashes"
          label="Date of birth"
          fieldName="dateOfBirth"
          isRequired
          value={this.state.patronFields.dateOfBirth}
          handleOnChange={this.handleInputChange('dateOfBirth')}
          errorState={this.state.fieldErrors}
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
        />
        <FormField
          id="patronStreet2"
          className="nypl-text-field"
          type="text"
          label="Apartment / Suite"
          fieldName="line2"
          value={this.state.patronFields.line2}
          handleOnChange={this.handleInputChange('line2')}
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
        />
        <FormField
          id="patronState"
          className="nypl-text-field"
          type="text"
          ph="2-letter abbreviation"
          label="State"
          fieldName="state"
          value={this.state.patronFields.state}
          isRequired
          handleOnChange={this.handleInputChange('state')}
          errorState={this.state.fieldErrors}
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
        />
        <h3>Create Your Account</h3>
        <FormField
          id="patronEmail"
          className="nypl-text-field"
          type="text"
          ph="youremail@example.com"
          label="E-mail"
          fieldName="email"
          value={this.state.patronFields.email}
          handleOnChange={this.handleInputChange('email')}
          errorState={this.state.fieldErrors}
        />
        <FormField
          id="patronECommunications"
          className={this.state.patronFields.ecommunications_pref? "nypl-terms-checkbox checked" : "nypl-terms-checkbox"}
          type="checkbox"
          label="Email Checkbox"
          fieldName="ecommunications_pref"
          instructionText="Yes, I would like to receive information about NYPL's programs and services."
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
          value={this.state.patronFields.username}
          isRequired
          handleOnChange={this.handleInputChange('username')}
          errorState={this.state.fieldErrors}
        />
        <FormField
          id="patronPin"
          className="nypl-text-field"
          type="text"
          label="PIN"
          fieldName="pin"
          value={this.state.patronFields.pin}
          isRequired
          handleOnChange={this.handleInputChange('pin')}
          errorState={this.state.fieldErrors}
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
    ) : null;
  }

  render() {
    return (
      <div className="nypl-row">
        <div className="nypl-column-half nypl-column-offset-one">
          <div ref={(c) => { this.dynamicSection = c; }} tabIndex="0">
            {this.renderApiErrors()}
            {this.renderFormFields()}
            {this.renderApiErrors()}
          </div>
        </div>
      </div>
    );
  }
}

export default LibraryCardForm;
