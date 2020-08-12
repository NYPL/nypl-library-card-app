/* eslint-disable */
import React from "react";
import ilsLibraryList from "../data/ilsLibraryList";

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

/**
 * createAnchorText(wholeText)
 * Splits the error message into two parts to be used by the consumer to create
 * anchor tag text. The string ` field` is expected to in `wholeText`.
 *
 * @param {string} wholeText
 * return {object} {anchorText, restText}
 */
function createAnchorText(wholeText: string) {
  const anchorText = wholeText ? wholeText.split(" field")[0] : "";
  const restText = !anchorText ? "" : ` field ${wholeText.split(" field")[1]}`;

  return { anchorText, restText };
}

/**
 * createAnchorID(key)
 * Creates the proper anchor ID for the href of the <a> tag in the error message.
 *
 * @param {string} key
 * return {string}
 */
function createAnchorID(key: string): string | null {
  const addressElements = ["Line1", "City", "State", "Zip"];
  let hashElement = key ? `${key.charAt(0).toUpperCase()}${key.substr(1)}` : "";

  if (!hashElement) {
    return null;
  }
  if (addressElements.includes(hashElement)) {
    hashElement = `${hashElement}-home`;
  }

  // @nypl/design-system-react-components prepends an `input` before the
  // id of the input element we want an anchor for.
  return `#input-patron${hashElement}`;
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

  Object.keys(object).forEach((key, index) => {
    if (object.hasOwnProperty(key)) {
      let errorMessage = null;

      if (object[key].indexOf("empty") !== -1) {
        const { anchorText, restText } = createAnchorText(object[key]);

        errorMessage =
          !anchorText && !anchorText ? (
            <li>One of the fields is incorrect.</li>
          ) : (
            <li key={index}>
              <a href={createAnchorID(key)}>{anchorText}</a>
              {restText}
            </li>
          );
      } else {
        if (key === "zip") {
          errorMessage = (
            <li key={index}>
              Please enter a 5-digit{" "}
              <a href={createAnchorID(key)}>postal code</a>.
            </li>
          );
        }

        if (key === "email") {
          errorMessage = (
            <li key={index}>
              Please enter a valid{" "}
              <a href={createAnchorID(key)}>email address</a>.
            </li>
          );
        }

        if (key === "username") {
          errorMessage = (
            <li key={index}>
              Please enter a <a href={createAnchorID(key)}>username</a> between
              5-25 alphanumeric characters.
            </li>
          );
        }

        if (key === "pin") {
          errorMessage = (
            <li key={index}>
              Please enter a 4-digit <a href={createAnchorID(key)}>PIN</a>.
            </li>
          );
        }

        if (key === "address") {
          errorMessage = (
            <li key={index}>
              <a href={createAnchorID("Line1")}>{object[key]}</a>
            </li>
          );
        }
      }

      errorMessages.push(errorMessage);
    }
  });

  return errorMessages;
}

/**
 * findLibraryCode
 * Find the code for a library by searching for its name in the `ilsLibraryList`
 * array. If no object is found, return the default value of "eb" for
 * "e-branch" or "simplye" (interchangeable names);
 * @param libraryName Name of library to find in the list.
 */
function findLibraryCode(libraryName?: string) {
  const library = ilsLibraryList.find(
    (library) => library.label === libraryName
  );
  return library?.value || "eb";
}

/**
 * findLibraryName
 * Find the name for a library by searching for its code in the `ilsLibraryList`
 * array. If no object is found, return the default value of "eb" for
 * "e-branch" or "simplye" (interchangeable names);
 * @param libraryCode Name of library to find in the list.
 */
function findLibraryName(libraryCode?: string) {
  const library = ilsLibraryList.find(
    (library) => library.value === libraryCode
  );
  return library?.label || "SimplyE";
}

export {
  isDate,
  renderServerValidationError,
  findLibraryCode,
  findLibraryName,
};
