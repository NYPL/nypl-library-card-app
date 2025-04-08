export function formReducer(state, action) {
  console.log(`dispatching ${action.type} with`);
  console.dir(action.value, { depth: null });
  switch (action.type) {
    case "SET_FORM_DATA": {
      return {
        ...state,
        formValues: action.value,
      };
    }
    case "SET_FORM_ERRORS": {
      return {
        ...state,
        errorObj: action.value,
      };
    }
    case "SET_FORM_RESULTS": {
      return {
        ...state,
        results: action.value,
      };
    }
    case "SET_ADDRESSES_VALUE": {
      return {
        ...state,
        addressesResponse: action.value,
      };
    }
    default: {
      return state;
    }
  }
}
