/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { Heading, List } from "@nypl/design-system-react-components";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "next-i18next";
import React from "react";

import {
  renderErrorElements,
  createUsernameAnchor,
} from "../../utils/renderErrorsUtils";
import styles from "./ApiErrors.module.css";
import { ApiErrorResponse, ErrorCodes } from "../../errors";
import { apiErrorTranslations } from "../../data/apiErrorMessageTranslations";

interface ApiErrorsProps {
  problemDetail: ApiErrorResponse | undefined;
  lang?: string;
}

/**
 * renderApiErrors
 * This renders the component above the form that displays information on
 * the error(s) from the submission. Also renders links that link to the
 * specific input element that is returning an error.
 */
const ApiErrors = React.forwardRef<HTMLDivElement, ApiErrorsProps>(
  ({ problemDetail, lang = "en" }, ref) => {
    const { t } = useTranslation("common");

    // We expect problem details to have a status greater than or equal to 400.
    if (!problemDetail || problemDetail.status < 400) {
      return null;
    }

    const type = problemDetail.type;
    const fieldErrors = problemDetail.details?.fields as
      | Record<string, string>
      | undefined;
    let detail = problemDetail.message;

    if (!detail) {
      detail = t("apiErrors.defaultError");
    }
    if (detail.includes("PIN is trivial")) {
      detail =
        lang === "en"
          ? "Password cannot contain consecutively repeating characters three or more times, e.g. aaaatf54 or repeating a pattern, e.g. abcabcab"
          : t("account.password.instruction").split("<br />")[2];
    } else if (lang !== "en") {
      let newErrorMessage;
      try {
        newErrorMessage = detail
          ? apiErrorTranslations[detail][lang]
          : t("apiErrors.defaultError");
      } catch (e) {
        console.error("Missing translation for error message: \n", detail, e);
        newErrorMessage = t("apiErrors.defaultError");
      }
      detail = newErrorMessage;
    }

    /**
     * renderErrorByType
     * Returns list elements with detail errors.
     */
    const renderErrorByType = () => {
      const defaultError = t("globalErrors.defaultError");
      let errorElements;

      // The following error types can be found in the wiki:
      // https://github.com/NYPL/dgx-patron-creator-service/wiki/API-V0.3#error-responses-2
      if (type) {
        switch (type) {
          // This will most likely be the most caught type of error. This will
          // be the case for empty values or invalid values caught before
          // sending a request to the Card Creator API. The Card Creator API
          // can also return these types of errors based on its own validations.
          case ErrorCodes.INVALID_REQUEST:
            if (isEmpty(fieldErrors)) {
              errorElements = <li>{detail}</li>;
            } else {
              errorElements = renderErrorElements(fieldErrors, lang);
            }
            break;

          case ErrorCodes.INVALID_USERNAME:
          case ErrorCodes.USERNAME_UNAVAILABLE:
            errorElements = (
              <li
                dangerouslySetInnerHTML={{
                  __html: createUsernameAnchor(detail, lang),
                }}
              />
            );
            break;

          case ErrorCodes.MISSING_REQUIRED_FIELDS:
          case ErrorCodes.ILS_INTEGRATION_ERROR:
          case ErrorCodes.PATRON_CREATION_FAILED:
          case ErrorCodes.PLATFORM_API_ERROR:
          case ErrorCodes.PLATFORM_API_TIMEOUT:
          case ErrorCodes.ADDRESS_VALIDATION_FAILED:
          case ErrorCodes.CSRF_INVALID:
            errorElements = <li>{detail}</li>;
            break;

          default:
            errorElements = <li>{defaultError}</li>;
            break;
        }
      } else {
        errorElements = <li>{defaultError}</li>;
      }

      return (
        <List variant="ul" className={styles.errorList}>
          {errorElements}
        </List>
      );
    };

    return (
      <div ref={ref} className={styles.container} tabIndex={0}>
        <Heading level="h2" className={styles.heading}>
          {t("globalErrors.title")}
        </Heading>
        {renderErrorByType()}
      </div>
    );
  }
);

ApiErrors.displayName = "ApiErrors";

export default ApiErrors;
