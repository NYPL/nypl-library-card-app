import { Heading } from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { JSX, useEffect } from "react";
import { GetServerSideProps } from "next";
import { Paragraph } from "../../src/components/Paragraph";

import AddressVerificationContainer from "../../src/components/AddressVerificationContainer";
import {
  homePageRedirect,
  redirectIfUserHasRegistered,
} from "../../src/utils/utils";
import { useRouter } from "next/router";

interface AddressVerificationPageProps {
  hasUserAlreadyRegistered?: boolean;
}

function AddressVerificationPage({
  hasUserAlreadyRegistered,
}: AddressVerificationPageProps): JSX.Element {
  const { t } = useTranslation("common");
  const router = useRouter();
  useEffect(() => {
    redirectIfUserHasRegistered(hasUserAlreadyRegistered, router);
  });
  return (
    <>
      <Heading level="h2">{t("verifyAddress.title")}</Heading>
      <Paragraph id="select-address-heading">
        {t("verifyAddress.description")}
      </Paragraph>
      <AddressVerificationContainer />
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

export default AddressVerificationPage;
