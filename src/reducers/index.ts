export function formReducer(state, action) {
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
    case "SET_CSRF_TOKEN": {
      return {
        ...state,
        csrfToken: action.value,
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
        addressResponse: action.value,
      };
    }
    default: {
      return state;
    }
  }
}
