import React from "react";
import {
  Box,
  Heading,
  Template,
  TemplateBreakout,
  TemplateContent,
  TemplateHeader,
  TemplateMain,
  Link as DSLink,
} from "@nypl/design-system-react-components";
import Link from "next/link";
import Breadcrumbs from "../Breadcrumb";
import { useRouter } from "next/router";
import { BrokenBook as BrokenBookIcon } from "../Icons/BrokenBook";

export const ContactUsLink = () => {
  return (
    <DSLink href="https://www.nypl.org/get-help/contact-us">contact us</DSLink>
  );
};

export const BackToHomeLink = ({
  text = "new application",
}: {
  text?: string;
}) => {
  const router = useRouter();
  const lang = router.isReady ? router.query.lang : undefined;
  const href = lang && lang !== "en" ? `/new?lang=${lang}` : "/new";
  return <Link href={href}>{text}</Link>;
};

export const ErrorComponent = ({
  heading,
  description,
}: {
  heading: string;
  description: React.ReactNode;
}) => {
  return (
    <Template variant="narrow" gap="0!">
      <TemplateHeader id="mainHeader" m="0!" dir="ltr">
        <TemplateBreakout>
          <Breadcrumbs />
        </TemplateBreakout>
      </TemplateHeader>
      <TemplateMain id="mainContent">
        <TemplateContent my="xxl" textAlign="center">
          <Box mb="xl">
            <BrokenBookIcon />
          </Box>
          <Box textAlign="center">
            <Heading level="h2" size="heading3" mb="m">
              {heading}
            </Heading>
            {description}
          </Box>
        </TemplateContent>
      </TemplateMain>
    </Template>
  );
};
