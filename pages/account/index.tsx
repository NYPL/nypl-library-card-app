import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { GetServerSideProps } from "next";

import AccountFormContainer from "../../src/components/AccountFormContainer";
import {
  homePageRedirect,
  redirectIfUserHasRegistered,
} from "../../src/utils/utils";
import { useRouter } from "next/router";
import {
  generateNewToken,
  generateNewCookieTokenAndHash,
} from "../../src/utils/csrfUtils";
import * as cookie from "../../src/utils/CookieUtils";
import { Paragraph } from "../../src/components/Paragraph";
import { PageHeading } from "../../src/components/PageHeading";

interface AccountPageProps {
  hasUserAlreadyRegistered?: boolean;
  csrfToken: string;
}

function AccountPage({
  hasUserAlreadyRegistered,
  csrfToken,
}: AccountPageProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  useEffect(() => {
    redirectIfUserHasRegistered(hasUserAlreadyRegistered, router);
  });
  return (
    <>
      <PageHeading>{t("account.title")}</PageHeading>
      <Paragraph>{t("account.description")}</Paragraph>
      <Paragraph>{t("internationalInstructions")}</Paragraph>
      <AccountFormContainer csrfToken={csrfToken} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  res,
}) => {
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

export default AccountPage;
