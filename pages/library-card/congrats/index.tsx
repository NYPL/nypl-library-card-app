import React from "react";
import ConfirmationContainer from "../../../src/components/ConfirmationContainer";

function ConfirmationPage() {
  return (
    <div>
      <h2>Congratulations! You now have an NPL digital library card.</h2>
      <ConfirmationContainer />
    </div>
  );
}

export async function getServerSideProps({ res, query }) {
  // We only want to show this from a form submission. If we are not coming
  // to the confirmation page from a successful form submission, then
  // redirect to the form page.
  if (!query.newCard) {
    res.writeHead(301, {
      Location: "/",
    });
    res.end();
  }
  return { props: {} };
}

export default ConfirmationPage;
