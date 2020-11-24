import React from "react";
import { Heading } from "@nypl/design-system-react-components";

import AccountFormContainer from "../../src/components/AccountFormContainer";
import { PageTitles } from "../../src/interfaces";

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

export default AccountPage;
