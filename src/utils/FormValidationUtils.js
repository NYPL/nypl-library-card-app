import React from 'react';

function isDate(input, minYear = 1902, maxYear = new Date().getFullYear()) {
  // regular expression to match required date format
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (input === '') {
    return false;
  }

  if (input.match(regex)) {
    const temp = input.split('/');
    const dateFromInput = new Date(`${temp[2]}/${temp[0]}/${temp[1]}`);

    return (
      dateFromInput.getDate() === Number(temp[1])
      && (dateFromInput.getMonth() + 1) === Number(temp[0])
      && Number(temp[2]) > minYear
      && Number(temp[2]) < maxYear
    );
  }

  return false;
}

function createAnchorText(string = '') {
  const anchorText = string.split(' field')[0] || '';
  const restText = (!string.split(' field')[1]) ? '' : ` field ${string.split(' field')[1]}`;

  return { anchorText, restText };
}

function createAnchorID(key) {
  let hashElement = `${key.charAt(0).toUpperCase()}${key.substr(1)}`;

  if (hashElement === 'DateOfBirth') {
    hashElement = 'Dob';
  }

  if (hashElement === 'Line1') {
    hashElement = 'Street1';
  }

  return `#patron${hashElement}`;
}


function renderServerValidationError(object) {
  const errorMessages = [];

  Object.keys(object).forEach((key, index) => {
    if (object.hasOwnProperty(key)) {
      let errorMessage = null;

      if (object[key].indexOf('empty') !== -1) {
        const anchorText = createAnchorText(object[key]).anchorText || '';
        const restText = createAnchorText(object[key]).restText || '';
        errorMessage = <li key={index}><a href={createAnchorID(key)}>{anchorText}</a>{restText}</li>;
      } else {
        if (key === 'zip') {
          errorMessage = <li key={index}>Please enter a 5-digit <a href={createAnchorID(key)}>postal code</a>.</li>;
        }

        if (key === 'username') {
          errorMessage = <li key={index}>Please enter a <a href={createAnchorID(key)}>username</a> between 5-25 alphanumeric characters.</li>;
        }

        if (key === 'pin') {
          errorMessage = <li key={index}>Please enter a 4-digit <a href={createAnchorID(key)}>PIN</a>.</li>;
        }
      }

      errorMessages.push(errorMessage);
    }
  });

  return errorMessages;
}

export {
  isDate,
  renderServerValidationError,
};
