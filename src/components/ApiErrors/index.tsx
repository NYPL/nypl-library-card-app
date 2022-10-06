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
import { ProblemDetail } from "../../interfaces";
import { apiErrorTranslations } from "../../data/apiErrorMessageTranslations";

interface ApiErrorsProps {
  problemDetail: ProblemDetail | undefined;
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
    if (!problemDetail || problemDetail?.status < 400) {
      return null;
    }

    if (typeof problemDetail !== "string" && !problemDetail.detail) {
      problemDetail.detail = t("apiErrors.defaultError");
    }
    if (lang !== "en" && typeof problemDetail !== "string") {
      const errorToTranslate = problemDetail?.detail;
      const newErrorMessage = errorToTranslate
        ? apiErrorTranslations[errorToTranslate][lang]
        : t("apiErrors.defaultError");
      problemDetail.detail = newErrorMessage;
    }

    /**
     * renderErrorByType
     * Returns list elements with detail errors.
     */
    const renderErrorByType = (pd) => {
      const { type, detail, error } = pd;
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
          case "invalid-request":
            if (isEmpty(error)) {
              errorElements = <li>{detail}</li>;
            } else {
              errorElements = renderErrorElements(error, lang);
            }
            break;
          // All the errors are in the `error` property but for the `username`,
          // the error is in the `detail` property. This error is thrown in the
          // API right away so it can't attempt to create an invalid account.
          case "invalid-username":
          case "unavailable-username":
            errorElements = (
              <li
                dangerouslySetInnerHTML={{
                  __html: createUsernameAnchor(detail, lang),
                }}
              />
            );
            break;
          // Note: the following shouldn't happen since empty values will be
          // caught _before_ sending the request to the API. But this is added
          // because it's part of the error responses.
          case "missing-required-values":
          case "ils-integration-error":
            errorElements = <li>{detail}</li>;
            break;
          default:
            errorElements = <li>{defaultError}</li>;
            break;
        }
        console.warn(`API error: ${detail}`);
      } else {
        errorElements = <li>{defaultError}</li>;
      }

      return (
        <List type="ul" className={styles.errorList}>
          {errorElements}
        </List>
      );
    };

    return (
      <div ref={ref} className={styles.container} tabIndex={0}>
        <Heading level="two" className={styles.heading}>
          {t("globalErrors.title")}
        </Heading>
        {renderErrorByType(problemDetail)}
      </div>
    );
  }
);

export default ApiErrors;
