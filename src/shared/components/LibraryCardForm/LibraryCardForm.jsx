import React from 'react';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import forIn from 'lodash/forIn';
import { isDateValid, isEmailValid } from '../../../utils/FormValidationUtils';

class LibraryCardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formProcessing: false,
      formResult: {},
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
        if (!isDateValid(value)) {
          fieldErrors[fieldName] = 'Your date of birth must be in MM/DD/YYYY format (i.e. 04/10/1980)';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'email':
        if (!isEmailValid(value)) {
          fieldErrors[fieldName] = 'Email is invalid';
          currentErrors = fieldErrors;
        } else {
          currentErrors = omit(fieldErrors, fieldName);
        }
        break;
      case 'username':
        if (value.length < 5 || value.length > 25) {
          fieldErrors[fieldName] = 'Username must be between 5-25 alphanumeric characters';
          currentErrors = fieldErrors;
        } else if (value.match(/[^0-9a-z]/i)) {
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

  renderFieldError(field) {
    if (this.state.fieldErrors[field]) {
      return (
        <span className="errorBlock">
          {this.state.fieldErrors[field]}
        </span>
      );
    }
    return null;
  }

  renderFirstNameField() {
    return (
      <div>
        <label htmlFor="patronFirstName">First Name <span className="required">*</span>:</label>
        <input
          id="patronFirstName"
          type="text"
          value={this.state.patronFields.firstName}
          onChange={this.handleInputChange('firstName')}
        />
        {this.renderFieldError('firstName')}
      </div>
    );
  }

  renderLastNameField() {
    return (
      <div>
        <label htmlFor="patronLastName">Last Name <span className="required">*</span>:</label>
        <input
          id="patronLastName"
          type="text"
          value={this.state.patronFields.lastName}
          onChange={this.handleInputChange('lastName')}
        />
        {this.renderFieldError('lastName')}
      </div>
    );
  }

  renderDobField() {
    return (
      <div>
        <label htmlFor="patronDob">Date of Birth <span className="required">*</span>:</label>
        <input
          id="patronDob"
          type="text"
          value={this.state.patronFields.dateOfBirth}
          onChange={this.handleInputChange('dateOfBirth')}
        />
        {this.renderFieldError('dateOfBirth')}
      </div>
    );
  }

  renderEmailField() {
    return (
      <div>
        <label htmlFor="patronEmail">E-Mail <span className="required">*</span>:</label>
        <input
          id="patronEmail"
          type="email"
          value={this.state.patronFields.email}
          onChange={this.handleInputChange('email')}
        />
        {this.renderFieldError('email')}
      </div>
    );
  }

  renderUsernameField() {
    return (
      <div>
        <label htmlFor="patronUsername">Username <span className="required">*</span>:</label>
        <input
          id="patronUsername"
          type="text"
          value={this.state.patronFields.username}
          onChange={this.handleInputChange('username')}
        />
        {this.renderFieldError('username')}
      </div>
    );
  }

  renderPinField() {
    return (
      <div>
        <label htmlFor="patronPin">PIN <span className="required">*</span>:</label>
        <input
          id="patronPin"
          type="text"
          value={this.state.patronFields.pin}
          onChange={this.handleInputChange('pin')}
        />
        {this.renderFieldError('pin')}
      </div>
    );
  }

  renderStreetField1() {
    return (
      <div>
        <label htmlFor="patronStreet1">Street <span className="required">*</span>:</label>
        <input
          id="patronStreet1"
          type="text"
          value={this.state.patronFields.line1}
          onChange={this.handleInputChange('line1')}
        />
        {this.renderFieldError('line1')}
      </div>
    );
  }

  renderStreetField2() {
    return (
      <div>
        <label htmlFor="patronStreet2">Apartment Number:</label>
        <input
          id="patronStreet2"
          type="text"
          value={this.state.patronFields.line2}
          onChange={this.handleInputChange('line2')}
        />
        {this.renderFieldError('line2')}
      </div>
    );
  }

  renderCityField() {
    return (
      <div>
        <label htmlFor="patronCity">City <span className="required">*</span>:</label>
        <input
          id="patronCity"
          type="text"
          value={this.state.patronFields.city}
          onChange={this.handleInputChange('city')}
        />
        {this.renderFieldError('city')}
      </div>
    );
  }

  renderStateField() {
    return (
      <div>
        <label htmlFor="patronState">State <span className="required">*</span>:</label>
        <input
          id="patronState"
          type="text"
          value={this.state.patronFields.state}
          onChange={this.handleInputChange('state')}
        />
        {this.renderFieldError('state')}
      </div>
    );
  }

  renderZipcodeField() {
    return (
      <div>
        <label htmlFor="patronZipcode">Postal Code <span className="required">*</span>:</label>
        <input
          id="patronZipcode"
          type="text"
          value={this.state.patronFields.zip}
          onChange={this.handleInputChange('zip')}
        />
        {this.renderFieldError('zip')}
      </div>
    );
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
      <div className="formResults">
        {resultMarkup}
      </div>
    );
  }

  render() {
    return (
      <div className="mainContent" id="mainContent">
        {this.renderFormResults()}
        <form className="nyplLibraryCard-form" onSubmit={this.handleSubmit}>
          <fieldset>
            <h2>
              Please enter the following information (Items marked with
                <span className="required"> *</span> are required)
            </h2>
            {this.renderFirstNameField()}
            {this.renderLastNameField()}
            {this.renderDobField()}
            {this.renderEmailField()}
            {this.renderUsernameField()}
            {this.renderPinField()}
          </fieldset>
          <fieldset>
            <h2>Address</h2>
            {this.renderStreetField1()}
            {this.renderStreetField2()}
            {this.renderCityField()}
            {this.renderStateField()}
            {this.renderZipcodeField()}
          </fieldset>
          <div>
            <input
              disabled={this.state.formProcessing}
              type="submit"
              value="Submit Card Application"
            />
            {this.renderLoader()}
          </div>
        </form>
      </div>
    );
  }
}

export default LibraryCardForm;
