import React, { useEffect } from "react";
import { Heading } from "@nypl/design-system-react-components";

import AddressContainer from "../../src/components/AddressContainer";
import { PageTitles } from "../../src/interfaces";
import useFormDataContext from "../../src/context/FormDataContext";
import IPLocationAPI from "../../src/utils/IPLocationAPI";

interface PageProps {
  pageTitles: PageTitles;
  location: string;
}

function AddressPage({ pageTitles, location }: PageProps) {
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  // Update the form values state with the user's location value.
  useEffect(() => {
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formValues, location },
    });
  }, []);

  return (
    <>
      <Heading level={2}>{pageTitles.address}</Heading>
      <AddressContainer />
    </>
  );
}

export async function getServerSideProps(context) {
  const { query, res } = context;
  // We only want to show this from a form submission. If we are not coming
  // to the confirmation page from a successful form submission, then
  // redirect to the form page.
  if (!query.newCard) {
    res.writeHead(301, {
      Location: "/library-card/new",
    });
    res.end();
  }
  // Get the user's IP address and convert it to an object that tells us if
  // the user is in NYS/NYC. Will be `undefined` if the call to the IP/location
  // conversion API fails or if there is no IP address.
  let location = "";
  if (context.req?.headers) {
    location = await IPLocationAPI.getLocationFromIP(context);
  }
  return { props: { location } };
}

export default AddressPage;
