import React from "react";

import ReviewFormContainer from "../../../src/components/ReviewFormContainer";

function ReviewPage() {
  return (
    <>
      <h2>Step 5 of 5: Review Your Information</h2>
      <ReviewFormContainer />
    </>
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

export default ReviewPage;
