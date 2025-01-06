import { Heading } from "@nypl/design-system-react-components";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";

import PersonalFormContainer from "../../src/components/PersonalFormContainer";
import {
  homePageRedirect,
  redirectIfUserHasRegistered,
} from "../../src/utils/utils";
import { useRouter } from "next/router";

interface PersonalInformationProps {
  hasUserAlreadyRegistered: boolean;
}

function PersonalInformationPage({
  hasUserAlreadyRegistered,
}: PersonalInformationProps): React.ReactElement {
  const { t } = useTranslation("common");
  const router = useRouter();
  React.useEffect(() => {
    redirectIfUserHasRegistered(hasUserAlreadyRegistered, router);
  });
  return (
    <>
      <Heading level="two">{t("personal.title")}</Heading>
      <p>{t("internationalInstructions")}</p>
      <PersonalFormContainer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  const hasUserAlreadyRegistered = !!req.cookies["nyplUserRegistered"];
  return {
    props: {
      hasUserAlreadyRegistered,
      // This allows this page to get the proper translations based
      // on the `lang=...` URL query param. Default to "en".
      ...(await serverSideTranslations(query?.lang?.toString() || "en", [
        "common",
      ])),
    },
  };
};

export default PersonalInformationPage;
