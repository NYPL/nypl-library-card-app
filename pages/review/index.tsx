import React from "react";
import { Heading } from "@nypl/design-system-react-components";

import ReviewFormContainer from "../../src/components/ReviewFormContainer";
import { PageTitles } from "../../src/interfaces";

interface PageProps {
  pageTitles: PageTitles;
}

function ReviewPage({ pageTitles }: PageProps) {
  return (
    <>
      <Heading level={2}>{pageTitles.review}</Heading>
      <p>
        You can use your username or library card barcode along with your PIN to
        log into and manage your account.
      </p>
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
      Location: "/library-card/new",
    });
    res.end();
  }
  return { props: {} };
}

export default ReviewPage;
