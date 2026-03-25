import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { GetServerSideProps } from "next";

import WorkAddressContainer from "../../src/components/WorkAddressContainer";
import {
  homePageRedirect,
  redirectIfUserHasRegistered,
} from "../../src/utils/utils";
import { useRouter } from "next/router";
import {
  generateNewCookieTokenAndHash,
  generateNewToken,
} from "../../src/utils/csrfUtils";
import * as cookie from "../../src/utils/CookieUtils";
import { Paragraph } from "../../src/components/Paragraph";
import { PageHeading } from "../../src/components/PageHeading";
import { Banner } from "../../src/components/Banner";
import { Trans } from "../../src/components/Trans";
interface AlternateAddressProps {
  hasUserAlreadyRegistered?: boolean;
  csrfToken: string;
}

function AlternateAddress({
  hasUserAlreadyRegistered,
  csrfToken,
}: AlternateAddressProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  useEffect(() => {
    redirectIfUserHasRegistered(hasUserAlreadyRegistered, router);
  });
  return (
    <>
      <PageHeading autoScrollOnMount>
        {t("location.workAddress.title")}
      </PageHeading>
      <Paragraph>{t("location.workAddress.description.part1")}</Paragraph>
      <Paragraph>{t("internationalInstructions")}</Paragraph>
      <Banner
        content={<Trans i18nKey="location.workAddress.description.part3" />}
      />
      <WorkAddressContainer csrfToken={csrfToken} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  res,
}) => {
  const csrfToken = generateNewToken();
  const newTokenCookieString = generateNewCookieTokenAndHash(csrfToken);
  const tokenCookie = cookie.buildCookieHeader(newTokenCookieString);
  res.setHeader("Set-Cookie", [tokenCookie]);
  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  const hasUserAlreadyRegistered = !!req.cookies["nyplUserRegistered"];
  return {
    props: {
      csrfToken,
      hasUserAlreadyRegistered,
      ...(await serverSideTranslations(query?.lang?.toString() || "en", [
        "common",
      ])),
    },
  };
};

export default AlternateAddress;
