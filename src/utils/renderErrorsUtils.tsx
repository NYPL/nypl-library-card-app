/* eslint-disable no-prototype-builtins */
import React from "react";

/**
 * createAnchorText
 * For every key that has an error, we want to replace its respective text as
 * an anchor element. This only works for the English language. Non-English
 * languages return just the message. For address input fields, we instead want
 * to focus on the location/address section instead of individual fields. This
 * is because the "edit" button will redirect to the location/address form page
 * instead of allowing to edit the values in the review page.
 */
export function createAnchorText(key, errors, addressType = "", lang = "en") {
  // Each key points to a string of text that will be used as text inside an
  // anchor element. These strings MUST appear in the errorMessages object in
  // src/utils/formDataUtils.ts
  const errorMessageHashMap = {
    firstName: "first name",
    lastName: "last name",
    birthdate: "date",
    ageGate: "13 years or older",
    email: "email",
    username: "Username",
    password: "password",
    verifyPassword: "passwords",
    location: "location option",
    line1: "street address",
    city: "city",
    state: "state",
    zip: "postal code",
    acceptTerms: "Terms and Conditions",
  };

  const message = errors[key];
  if (!message) {
    return;
  }
  // For any non-English language, don't create anchor elements
  // within the error message. Just return the error.
  if (lang !== "en") {
    return message;
  }
  const displayText = errorMessageHashMap[key];
  const anchorString =
    addressType || key === "location"
      ? `${addressType} <a href="#address-section">${displayText}</a>`
      : `<a href="#input-${key}">${displayText}</a>`;

  return message.replace(displayText, anchorString);
}

/**
 * createUsernameAnchor
 * This is used for errors caught from the response of an API call when
 * attempting to _create_ a patron. The detail message is coming from the API.
 */
export function createUsernameAnchor(detail, lang = "en") {
  // For any non-English language, don't create an anchor element
  // within the error message. Just return the error.
  if (lang !== "en") {
    return detail;
  }
  return detail.replace("username", `<a href="#input-username">username</a>`);
}

/**
 * renderErrorElements(errorObj)
 * Renders the proper error messages based on each error field.
 * Returns all the messages as an array.
 */
export function renderErrorElements(errorObj, lang = "en") {
  const errorMessages = [];
  const { address, ...errors } = errorObj;

  Object.keys(errors).forEach((key) => {
    if (errorObj.hasOwnProperty(key)) {
      const message = createAnchorText(key, errors, "", lang);
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
          const message = createAnchorText(key, addressType, addressKey, lang);
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
  } else if (address) {
    errorMessages.push(<li>{address}</li>);
  }

  return errorMessages;
}
