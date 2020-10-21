/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import ConfirmationGraphic from "../../src/components/ConfirmationGraphic";

function ConfirmationPage() {
  return (
    <div>
      <h2>Congratulations! You now have an NYPL digital library card.</h2>
      <p>
        You will receive a confirmation email with all of the details of your
        new card, plus information about what you can access.{" "}
        <a href="#">Learn more</a>.
      </p>

      <ConfirmationGraphic />

      <h3>SimplyE: NYPL&apos;s E-Reader App</h3>
      <p>Lorem ipsum</p>
      <h3>Browse Catalog</h3>
      <p>Lorem ipsum</p>
      <h3>Account Page</h3>
      <p>Lorem ipsum</p>
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
