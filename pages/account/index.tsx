import { Heading } from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";

import AccountFormContainer from "../../src/components/AccountFormContainer";
import { PageTitles } from "../../src/interfaces";
import { homePageRedirect } from "../../src/utils/utils";

interface PageProps {
  pageTitles: PageTitles;
}

function AccountPage({ pageTitles }: PageProps): React.ReactElement {
  const { t } = useTranslation("common");

  return (
    <>
      <Heading level="two">{t("account.title")}</Heading>
      <p>{t("account.describtion")}</p>
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
  return {
    props: {
      ...(await serverSideTranslations(query?.lang || "en", ["common"])),
    },
  };
}

export default AccountPage;
