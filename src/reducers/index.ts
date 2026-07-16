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
    case "SET_IDENTITY_VERIFICATION_STATUS": {
      return {
        ...state,
        identityVerificationResult: action.value,
      };
    }
    case "SET_EMAIL_CHECK_STATUS": {
      return {
        ...state,
        emailCheckResult: action.value,
      };
    }
    case "SET_DB_CHECK_STATUS": {
      return {
        ...state,
        dbCheckResult: action.value,
      };
    }
    default: {
      return state;
    }
  }
}
