/* eslint-disable no-prototype-builtins */
import React from "react";

function isDate(
  input,
  minYear = 1902,
  maxYear = new Date().getFullYear()
): boolean {
  // regular expression to match required date format
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (input === "") {
    return false;
  }

  if (input.match(regex)) {
    const temp = input.split("/");
    const dateFromInput = new Date(`${temp[2]}/${temp[0]}/${temp[1]}`);

    return (
      dateFromInput.getDate() === Number(temp[1]) &&
      dateFromInput.getMonth() + 1 === Number(temp[0]) &&
      Number(temp[2]) > minYear &&
      Number(temp[2]) < maxYear
    );
  }

  return false;
}

export const errorMessageHashMap = {
  firstName: "first name",
  lastName: "last name",
  birthdate: "date",
  ageGate: "13 years or older",
  email: "email",
  username: "Username",
  pin: "PIN.",
  verifyPin: "PINs",
  location: "location option",
  line1: "street address",
  city: "city",
  state: "state",
  zip: "postal code",
  acceptTerms: "terms and conditions",
};

/**
 * createAnchorID(key)
 * Creates the proper anchor ID for the href of the <a> tag in the error message.
 *
 * @param {string} key
 * return {string}
 */
function createAnchorID(key: string): string | null {
  const addressElements = ["line1", "city", "state", "zip"];
  let hashElement = key;
  if (!hashElement) {
    return null;
  }
  if (addressElements.includes(hashElement)) {
    hashElement = `${hashElement}-home`;
  }

  // @nypl/design-system-react-components prepends an `input` before the
  // id of the input element we want an anchor for.
  return `#input-${hashElement}`;
}

/**
 * createAnchorText
 */
function createAnchorText(key, errors) {
  const message = errors[key];
  if (!message) {
    return;
  }
  const displayText = errorMessageHashMap[key];
  return message.replace(
    displayText,
    `<a href=${createAnchorID(key)}>${displayText}</a>`
  );
}

/**
 * createAddressAnchorText
 */
function createAddressAnchorText(key, errors, type) {
  const message = errors[key];
  if (!message) {
    return;
  }
  const displayText = errorMessageHashMap[key];
  return message.replace(
    displayText,
    `${type} <a href="#address-section">${displayText}</a>`
  );
}

/**
 * renderServerValidationError(object)
 * Renders the proper error messages based on each error field.
 * Returns all the messages as an array.
 *
 * @param {object} object
 * return {array}
 */
function renderServerValidationError(object) {
  const errorMessages = [];
  const { address, location, ...errors } = object;

  Object.keys(errors).forEach((key) => {
    if (object.hasOwnProperty(key)) {
      const message = createAnchorText(key, errors);
      if (message) {
        const errorMessage = (
          <li key={key} dangerouslySetInnerHTML={{ __html: message }} />
        );
        errorMessages.push(errorMessage);
      }
    }
  });

  if (location) {
    const message = createAddressAnchorText("location", object, "");
    const errorMessage = (
      <li key="location" dangerouslySetInnerHTML={{ __html: message }} />
    );
    errorMessages.push(errorMessage);
  }

  if (address && typeof address !== "string") {
    Object.keys(address).forEach((addressKey) => {
      const addressType = address[addressKey];
      Object.keys(addressType).forEach((key) => {
        if (addressType.hasOwnProperty(key)) {
          const message = createAddressAnchorText(key, addressType, addressKey);
          const errorMessage = (
            <li key={key} dangerouslySetInnerHTML={{ __html: message }} />
          );
          errorMessages.push(errorMessage);
        }
      });
    });
  } else {
    errorMessages.push(<li>{address}</li>);
  }

  return errorMessages;
}

export { isDate, renderServerValidationError, createAnchorText };
