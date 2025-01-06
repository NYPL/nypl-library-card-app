import { Heading } from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { GetServerSideProps } from "next";

import AddressVerificationContainer from "../../src/components/AddressVerificationContainer";
import { homePageRedirect } from "../../src/utils/utils";
import { useRouter } from "next/router";

function AddressVerificationPage({ hasUserAlreadyRegistered }): JSX.Element {
  const { t } = useTranslation("common");
  const router = useRouter();
  React.useEffect(() => {
    if (hasUserAlreadyRegistered) {
      router.push("http://localhost:3000/library-card/congrats?newCard=true");
    }
  });
  return (
    <>
      <Heading level="two">{t("verifyAddress.title")}</Heading>
      <p>{t("verifyAddress.description")}</p>
      <AddressVerificationContainer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  const hasUserAlreadyRegistered = !!req.cookies["nyplUserRegistered"]
  return {
    props: {
      hasUserAlreadyRegistered,
      ...(await serverSideTranslations(query?.lang?.toString() || "en", [
        "common",
      ])),
    },
  };
};

export default AddressVerificationPage;
