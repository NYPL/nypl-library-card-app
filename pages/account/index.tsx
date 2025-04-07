import { Heading } from "@nypl/design-system-react-components";
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

interface AccountPageProps {
  hasUserAlreadyRegistered?: boolean;
}

function AccountPage({ hasUserAlreadyRegistered }: AccountPageProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  useEffect(() => {
    redirectIfUserHasRegistered(hasUserAlreadyRegistered, router);
  });
  return (
    <>
      <Heading level="two">{t("account.title")}</Heading>
      <p>{t("account.description")}</p>
      <p>{t("internationalInstructions")}</p>
      <AccountFormContainer csrfToken={csrfToken}/>
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
