import { Heading } from "@nypl/design-system-react-components";
import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import AddressContainer from "../../src/components/AddressContainer";
import useFormDataContext from "../../src/context/FormDataContext";
import IPLocationAPI from "../../src/utils/IPLocationAPI";
import { homePageRedirect } from "../../src/utils/utils";
import { useTranslation } from "next-i18next";

interface PageProps {
  location: string;
}

function AddressPage({ location }: PageProps): React.ReactElement {
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const { t } = useTranslation("common");
  // Update the form values state with the user's location value.
  useEffect(() => {
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formValues, location },
    });
  }, []);

  return (
    <>
      <Heading level="two">{t("location.title")}</Heading>
      <p>{t("internationalInstructions")}</p>
      <AddressContainer />
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  // Get the user's IP address and convert it to an object that tells us if
  // the user is in NYS/NYC. Will be `undefined` if the call to the IP/location
  // conversion API fails or if there is no IP address.
  let location = "";
  if (context.req?.headers) {
    location = await IPLocationAPI.getLocationFromIP(context);
  }
  return {
    props: {
      location,
      ...(await serverSideTranslations(query?.lang?.toString() || "en", [
        "common",
      ])),
    },
  };
}

export default AddressPage;
