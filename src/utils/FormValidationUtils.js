function isDate(input, minYear = 1902, maxYear = new Date().getFullYear()) {
  // regular expression to match required date format
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

  if (input === '') {
    return false;
  }

  if(input.match(regex)) {
    const temp = input.split('/');
    const dateFromInput = new Date(`${temp[2]}/${temp[0]}/${temp[1]}`);

    return (
      dateFromInput.getDate() ===  Number(temp[1])
      && (dateFromInput.getMonth() + 1) === Number(temp[0])
      && Number(temp[2]) > minYear
      && Number(temp[2]) < maxYear
    );
  } else {
    return false;
  }
}

export {
  isDate,
};
