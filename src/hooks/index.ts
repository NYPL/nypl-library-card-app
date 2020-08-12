import { useReducer } from "react";
import { formReducer } from "../reducers";
import { FormData } from "../interfaces";

export const formInitialState: FormData = {
  results: undefined,
  errorObj: null,
  isLoading: false,
  csrfToken: null,
  formValues: {},
};

export function useGlobalFormHook(init) {
  const [state, dispatch] = useReducer(formReducer, init);

  return { state, dispatch };
}
