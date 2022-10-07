import { Heading } from "@nypl/design-system-react-components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import React from "react";
import { GetServerSideProps } from "next";

import WorkAddressContainer from "../../src/components/WorkAddressContainer";
import { homePageRedirect } from "../../src/utils/utils";

function WorkAddressPage(): React.ReactElement {
  const { t } = useTranslation("common");
  return (
    <>
      <Heading level="two">{t("location.workAddress.title")}</Heading>
      <p>{t("location.workAddress.description.part1")}</p>
      <WorkAddressContainer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  return {
    props: {
      ...(await serverSideTranslations(query?.lang?.toString() || "en", [
        "common",
      ])),
    },
  };
};

export default WorkAddressPage;
