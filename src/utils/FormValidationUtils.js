function isDateValid(input) {
  const temp = input.split('/');
  const d = new Date(`${temp[2]}/${temp[0]}/${temp[1]}`);
  return (
    d && (d.getMonth() + 1) === Number(temp[0])
    && d.getDate() === Number(temp[1])
    && d.getFullYear() === Number(temp[2])
  );
}

function isEmailValid(input) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(input);
}

export {
  isDateValid,
  isEmailValid,
};
