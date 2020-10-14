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

// Each key points to a string of text that will be used as text
// inside an anchor element.
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
 * createAnchorText
 * For every key that has an error, we want to replace its respective text as
 * an anchor element. For address input fields, we instead want to focus on the
 * location/address section instead of individual fields. This is because the
 * "edit" button will redirect to the location/address form page instead
 * of allowing to edit the values in the review page.
 */
function createAnchorText(key, errors, type = "") {
  const message = errors[key];
  if (!message) {
    return;
  }
  const displayText = errorMessageHashMap[key];
  const anchorString =
    type || key === "location"
      ? `${type} <a href="#address-section">${displayText}</a>`
      : `<a href="#input-${key}">${displayText}</a>`;

  return message.replace(displayText, anchorString);
}

/**
 * createUsernameAnchor
 * This is used for errors caught from the response of an API call when
 * attempting to _create_ a patron. The detail message is coming from the API.
 */
function createUsernameAnchor(detail) {
  return detail.replace("username", `<a href="#input-username">username</a>`);
}

/**
 * renderServerValidationErrors(object)
 * Renders the proper error messages based on each error field.
 * Returns all the messages as an array.
 */
function renderServerValidationErrors(object) {
  const errorMessages = [];
  const { address, ...errors } = object;

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

  if (address && typeof address !== "string") {
    Object.keys(address).forEach((addressKey) => {
      const addressType = address[addressKey];
      Object.keys(addressType).forEach((key) => {
        if (addressType.hasOwnProperty(key)) {
          const message = createAnchorText(key, addressType, addressKey);
          const errorMessage = (
            <li
              key={`${addressKey}-${key}`}
              dangerouslySetInnerHTML={{ __html: message }}
            />
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

export {
  isDate,
  renderServerValidationErrors,
  createAnchorText,
  createUsernameAnchor,
};
