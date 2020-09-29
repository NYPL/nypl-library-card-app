import React from "react";
import AccountFormContainer from "../../../src/components/AccountFormContainer";

function AccountPage() {
  return (
    <>
      <h2>Step 4 of 5: Create Your Account</h2>
      <p>
        You can use either your username or library card barcode along with your
        PIN to log into and manage your account.
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
      Location: "/",
    });
    res.end();
  }
  return { props: {} };
}

export default AccountPage;
