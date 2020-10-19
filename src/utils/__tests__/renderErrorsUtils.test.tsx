import React from "react";
import {
  createAnchorText,
  createUsernameAnchor,
  renderErrorElements,
} from "../renderErrorsUtils";
import { errorMessages } from "../formDataUtils";

describe("createAnchorText", () => {
  // Mocking the error object we got from an API call.
  // These are the invalid/missing fields.
  const errors = {
    firstName: errorMessages.firstName,
    pin: errorMessages.pin,
    acceptTerms: errorMessages.acceptTerms,
    username: errorMessages.username,
    location: errorMessages.location,
    line1: errorMessages.address.line1,
    state: errorMessages.address.state,
  };

  test("it should return undefined if the key does not exist in the list of properties", () => {
    const badKeys = {
      password: "password",
      fullName: "fullName",
      streetAddress: "streetAddress",
    };

    // These keys don't exist in the error object we expect from the API.
    expect(createAnchorText(badKeys.password, errors)).toEqual(undefined);
    expect(createAnchorText(badKeys.fullName, errors)).toEqual(undefined);
    expect(createAnchorText(badKeys.streetAddress, errors)).toEqual(undefined);
  });

  test("it should replace text in the error message with its equivalent anchor element string", () => {
    expect(errorMessages.firstName).toEqual("Please enter a valid first name.");
    expect(errorMessages.acceptTerms).toEqual(
      "The terms and conditions were not accepted."
    );

    expect(createAnchorText("firstName", errors)).toEqual(
      'Please enter a valid <a href="#input-firstName">first name</a>.'
    );
    expect(createAnchorText("acceptTerms", errors)).toEqual(
      'The <a href="#input-acceptTerms">terms and conditions</a> were not accepted.'
    );
  });

  test("it should return whether the error is for a home or work address field", () => {
    const home = createAnchorText("line1", errors, "home");
    const work = createAnchorText("line1", errors, "work");
    expect(home).toEqual(
      'Please enter a valid home <a href="#address-section">street address</a>.'
    );
    expect(work).toEqual(
      'Please enter a valid work <a href="#address-section">street address</a>.'
    );
  });

  test("it should return the same hash href for all address related errors", () => {
    expect(createAnchorText("line1", errors, "home")).toEqual(
      'Please enter a valid home <a href="#address-section">street address</a>.'
    );
    expect(createAnchorText("state", errors, "work")).toEqual(
      'Please enter a 2-character work <a href="#address-section">state</a> abbreviation.'
    );
    expect(createAnchorText("location", errors)).toEqual(
      'Please select a  <a href="#address-section">location option</a>.'
    );
  });
});

describe("createUsernameAnchor", () => {
  test("returns the same string if username is not in the string", () => {
    expect(createUsernameAnchor("some string")).toEqual("some string");
  });

  test("returns a string with an anchor element around username", () => {
    expect(createUsernameAnchor("some error with the username")).toEqual(
      'some error with the <a href="#input-username">username</a>'
    );
  });
});

describe("renderErrorElements", () => {
  test("it should return an empty array if there are no errors", () => {
    expect(renderErrorElements({})).toEqual([]);
  });

  test("it should return a list of li elements for every error", () => {
    const errors = {
      firstName: errorMessages.firstName,
      pin: errorMessages.pin,
      address: {
        home: {
          state: errorMessages.address.state,
        },
      },
    };

    const liList = renderErrorElements(errors);

    // It's easier to stringify and check the results than checking
    // for the elements themselves.
    expect(JSON.stringify(liList)).toEqual(
      JSON.stringify([
        <li
          key="firstName"
          dangerouslySetInnerHTML={{
            __html:
              'Please enter a valid <a href="#input-firstName">first name</a>.',
          }}
        />,
        <li
          key="pin"
          dangerouslySetInnerHTML={{
            __html: 'Please enter a 4-digit <a href="#input-pin">PIN.</a>',
          }}
        />,
        <li
          key="home-state"
          dangerouslySetInnerHTML={{
            __html:
              'Please enter a 2-character home <a href="#address-section">state</a> abbreviation.',
          }}
        />,
      ])
    );
  });
});