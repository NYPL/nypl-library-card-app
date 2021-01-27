import React from "react";
import { Heading } from "@nypl/design-system-react-components";

import AccountFormContainer from "../../src/components/AccountFormContainer";
import { PageTitles } from "../../src/interfaces";
import { homePageRedirect } from "../../src/utils/utils";

interface PageProps {
  pageTitles: PageTitles;
}

function AccountPage({ pageTitles }: PageProps) {
  return (
    <>
      <Heading level={2}>{pageTitles.account}</Heading>
      <p>
        Create a username and PIN so you can log in and manage your account or
        access an array of our digital resources. Your username should be
        unique.
      </p>
      <AccountFormContainer />
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

export default AccountPage;
