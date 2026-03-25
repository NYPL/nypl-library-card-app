import { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import AddressContainer from "../../src/components/AddressContainer";
import useFormDataContext from "../../src/context/FormDataContext";
import IPLocationAPI from "../../src/utils/IPLocationAPI";
import {
  homePageRedirect,
  redirectIfUserHasRegistered,
} from "../../src/utils/utils";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {
  generateNewToken,
  generateNewCookieTokenAndHash,
} from "../../src/utils/csrfUtils";
import * as cookie from "../../src/utils/CookieUtils";
import { Paragraph } from "../../src/components/Paragraph";
import { PageHeading } from "../../src/components/PageHeading";

interface PageProps {
  location: string;
  hasUserAlreadyRegistered?: boolean;
  csrfToken: string;
}

function AddressPage({
  location,
  hasUserAlreadyRegistered,
  csrfToken,
}: PageProps) {
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
  const router = useRouter();
  useEffect(() => {
    redirectIfUserHasRegistered(hasUserAlreadyRegistered, router);
  }, [router]);
  return (
    <>
      <PageHeading autoScrollOnMount>{t("location.title")}</PageHeading>
      <Paragraph mb="l">{t("internationalInstructions")}</Paragraph>
      <AddressContainer csrfToken={csrfToken} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { query, res, req } = context;
  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  const hasUserAlreadyRegistered = !!req.cookies["nyplUserRegistered"];
  const csrfToken = generateNewToken();
  const newTokenCookieString = generateNewCookieTokenAndHash(csrfToken);
  const tokenCookie = cookie.buildCookieHeader(newTokenCookieString);
  res.setHeader("Set-Cookie", [tokenCookie]);
  // Get the user's IP address and convert it to an object that tells us if
  // the user is in NYS/NYC. Will be `undefined` if the call to the IP/location
  // conversion API fails or if there is no IP address.
  let location = "";
  if (context.req?.headers) {
    location = await IPLocationAPI.getLocationFromIP(context);
  }
  return {
    props: {
      csrfToken,
      hasUserAlreadyRegistered,
      location,
      ...(await serverSideTranslations(query?.lang?.toString() || "en", [
        "common",
      ])),
    },
  };
}

export default AddressPage;
