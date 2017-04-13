import React from 'react';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import forIn from 'lodash/forIn';
import { isEmail, isLength, isAlphanumeric } from 'validator';
import { isDate } from '../../../utils/FormValidationUtils';
import FormField from '../../components/FormField/FormField';

class LibraryCardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csrfToken: '',
      formProcessing: false,
      formResults: {},
      fieldErrors: {},
      patronFields: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        line1: '',
        line2: '',
        city: '',
        state: 'NY',
        zip: '',
        username: '',
        pin: '',
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

  scrollToTop(scrollDuration) {
    const cosParameter = window.scrollY / 2;
    const duration = scrollDuration || 250;
    let scrollCount = 0;
    let oldTimestamp = performance.now();

    function step(newTimestamp) {
      scrollCount += Math.PI / (duration / (newTimestamp - oldTimestamp));
      if (scrollCount >= Math.PI) window.scrollTo(0, 0);
      if (window.scrollY === 0) return;
      window.scrollTo(0, Math.round(cosParameter + (cosParameter * Math.cos(scrollCount))));
      oldTimestamp = newTimestamp;
      window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }

  validateField(fieldName, value) {
    const { fieldErrors } = this.state;
    let currentErrors = {};

    switch (fieldName) {
      case 'dateOfBirth':
        if (!isDate(value)) {
          fieldErrors[fieldName] = 'Your date of birth must be in MM/DD/YYYY format (i.e. 04/10/1980)';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'email':
        if (!isEmail(value)) {
          fieldErrors[fieldName] = 'Email is invalid';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'username':
        if (!isLength(value, { min: 5, max: 25 })) {
          fieldErrors[fieldName] = 'Username must be between 5-25 alphanumeric characters';
          currentErrors = fieldErrors;
        } else if (!isAlphanumeric(value)) {
          fieldErrors[fieldName] = 'Only alphanumeric characters are allowed';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'pin':
        if (value.length !== 4 || isNaN(value)) {
          fieldErrors[fieldName] = 'Pin must be 4 numbers';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'line2':
        break;
      default:
        if (isEmpty(value)) {
          fieldErrors[fieldName] = 'Required field';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
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
      this.setState({ formProcessing: true, formResults: {} });

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
      } = this.state.patronFields;

      axios.post('/create-patron', {
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
      }, {
        headers: { 'csrf-token': this.state.csrfToken },
      })
      .then((response) => {
        console.log(response);

        this.setState({
          formProcessing: false,
          formResults: response.data,
        });

        this.scrollToTop(500);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  renderErrorMsg(object) {
    let errorMessage = '';
    if (!isEmpty(object)) {
      if (object.type === 'unrecognized-address') {
        errorMessage = 'The address you provided is invalid, please enter a valid address.';
      } else if (object.type === 'unavailable-username') {
        errorMessage = 'The username entered is already in use, please enter a new username.';
      } else if (object.type === 'exception' && object.debugMessage && object.debugMessage.includes('pin')) {
        errorMessage = 'The pin entered is invalid, must be 4 numbers.';
      }
    } else {
      errorMessage = 'There was an error with your submission, please try again later.';
    }

    return (
      <div className="errorBox">
        <h3>Ops... there was an error while processing your request, please fix the following:</h3>
        <p>{errorMessage}</p>
      </div>
    );
  }

  renderSuccessMsg(object) {
    const barcode = object && !isEmpty(object.barCodes) ? object.barCodes[0] : null;
    const barcodeText = !isEmpty(barcode) ? `${barcode}` : null;
    return (
      <div className="successBox">
        <h3>Dear {this.getFullName()},</h3>
        <p>Your submission has been successful.</p>
        <p>You will need to visit an NYPL location to validate your information.</p>
        {barcodeText ? <p>Your barcode is <span className="barcode">{barcodeText}</span></p> : null}
      </div>
    );
  }

  renderLoader() {
    const { formProcessing } = this.state;
    return formProcessing ? <div className="loading" /> : null;
  }

  renderFormResults() {
    const { formResults } = this.state;
    let resultMarkup;

    if (!isEmpty(formResults)) {
      if (formResults.error) {
        resultMarkup = this.renderErrorMsg(formResults.response);
      } else {
        resultMarkup = this.renderSuccessMsg(formResults.response);
      }
    }

    return (
      <div className="form-results">
        {resultMarkup}
      </div>
    );
  }

  renderFormFields() {
    return (
      <form className="nypl-library-card-form" onSubmit={this.handleSubmit}>
        <h2>Please enter the following information</h2>
        <h3>Personal Information</h3>
        <fieldset className="nypl-name-field">
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
        </fieldset>
        <FormField
          id="patronDob"
          className="nypl-date-field"
          type="text"
          ph="MM/DD/YYYY"
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
        <h3>Create Account</h3>
        <FormField
          id="patronEmail"
          className="nypl-text-field"
          type="text"
          ph="youremail@example.com"
          label="E-mail"
          fieldName="email"
          value={this.state.patronFields.email}
          isRequired
          handleOnChange={this.handleInputChange('email')}
          errorState={this.state.fieldErrors}
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
          label="Pin"
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
    );
  }

  render() {
    return (
      <div className="nypl-column-half nypl-column-offset-one">
        {this.renderFormResults()}
        {this.renderFormFields()}
      </div>
    );
  }
}

export default LibraryCardForm;
