import React from "react";
import { Heading } from "@nypl/design-system-react-components";

import ReviewFormContainer from "../../src/components/ReviewFormContainer";
import { PageTitles } from "../../src/interfaces";
import { homePageRedirect } from "../../src/utils/utils";

interface PageProps {
  pageTitles: PageTitles;
}

function ReviewPage({ pageTitles }: PageProps) {
  return (
    <>
      <Heading level="two">{pageTitles.review}</Heading>
      <p>
        Make sure all the information you’ve entered is correct. If needed, you
        can still make changes before you submit your application.
      </p>
      <ReviewFormContainer />
    </>
  );
}

export async function getServerSideProps({ query }) {
  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  return { props: {} };
}

export default ReviewPage;
