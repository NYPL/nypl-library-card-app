import React from "react";
import Confirmation from "../../src/components/Confirmation";
import useFormDataContext from "../../src/context/FormDataContext";

/**
 * ConfirmationPage
 * The main page component for the confirmation page. Gets the global state
 * form submission results and renders the confirmation page.
 */
function ConfirmationPage() {
  const { state } = useFormDataContext();

  return <Confirmation formResults={state.results} />;
}

ConfirmationPage.getInitialProps = ({ res, query }) => {
  // We only want to show this from a form submission. If we are not coming
  // to the confirmation page from a successful form submission, then
  // redirect to the form page.
  if (!query.newCard) {
    res.writeHead(301, {
      Location: "/",
    });
    res.end();
  }
  return {};
};

export default ConfirmationPage;
