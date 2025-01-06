import { Heading } from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { GetServerSideProps } from "next";

import AccountFormContainer from "../../src/components/AccountFormContainer";
import {
  homePageRedirect,
  redirectIfUserHasRegistered,
} from "../../src/utils/utils";
import { useRouter } from "next/router";

interface AccountPageProps {
  hasUserAlreadyRegistered: boolean;
}

function AccountPage({
  hasUserAlreadyRegistered,
}: AccountPageProps): React.ReactElement {
  const { t } = useTranslation("common");
  const router = useRouter();
  React.useEffect(() => {
    redirectIfUserHasRegistered(hasUserAlreadyRegistered, router);
  });
  return (
    <>
      <Heading level="two">{t("account.title")}</Heading>
      <p>{t("account.description")}</p>
      <p>{t("internationalInstructions")}</p>
      <AccountFormContainer />
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
      ...(await serverSideTranslations(query?.lang?.toString() || "en", [
        "common",
      ])),
    },
  };
};

export default AccountPage;
