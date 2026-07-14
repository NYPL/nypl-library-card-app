import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Must be client-side only — persona package uses `self` (browser global)
const IdentityVerificationContainer = dynamic(
  () => import("../../src/components/IdentityVerificationContainer"),
  { ssr: false }
);
import {
  homePageRedirect,
  redirectIfUserHasRegistered,
} from "../../src/utils/utils";
import { PageHeading } from "../../src/components/PageHeading";
import { Paragraph } from "../../src/components/Paragraph";

interface IdentityVerificationPageProps {
  hasUserAlreadyRegistered?: boolean;
}

function IdentityVerificationPage({
  hasUserAlreadyRegistered,
}: IdentityVerificationPageProps) {
  const router = useRouter();
  useEffect(() => {
    redirectIfUserHasRegistered(hasUserAlreadyRegistered, router);
  });

  return (
    <>
      <PageHeading autoScrollOnMount>Identity Verification</PageHeading>
      <Paragraph mb="l">
        We need to verify your identity before creating your library card.
      </Paragraph>
      <IdentityVerificationContainer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
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

export default IdentityVerificationPage;
