import React, { JSX } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import {
  Box,
  Button,
  Link as DSLink,
  useNYPLBreakpoints,
} from "@nypl/design-system-react-components";

export interface LinkType {
  url: string;
  text?: string;
}

/**
 * Link can either be a navigation link or a form submit button.
 */
type NextRoutingLink =
  | ({ submit?: false } & LinkType)
  | ({ submit: true } & Partial<LinkType>);

export interface RoutingLinksType {
  previous?: LinkType;
  // We only want an optional "submit" property for the next prop.
  // The "url" and "text" props are not needed if "submit" is passed.
  next: NextRoutingLink;
  isDisabled?: boolean;
}

interface LinkButtonProps {
  text: string;
  url: string;
}

interface SubmitButtonProps {
  text: string;
  isDisabled: boolean;
}

/**
 * RoutingLinks
 * Renders two links that look like buttons to be used for routing. The
 * previous link is optional so it can be used on the starting page. A simple
 * approach to routing until submitting forms is integrated into routing.
 */
function RoutingLinks({
  previous,
  next,
  isDisabled = false,
}: RoutingLinksType): JSX.Element {
  const { t } = useTranslation("common");
  const { isLargerThanLargeMobile } = useNYPLBreakpoints();
  const nextText = next.text || t("button.next");
  const previousText = previous?.text || t("button.previous");

  const nextElement = isSubmitMode(next) ? (
    <NextButton text={nextText} isDisabled={isDisabled} />
  ) : (
    <GetStartedButton text={nextText} url={next.url} />
  );

  const renderNavigationButtons = () => {
    const previousButton = previous?.url && (
      <PreviousLink text={previousText} url={previous.url} />
    );

    return isLargerThanLargeMobile ? (
      <>
        {/* Next button will be placed on top on mobile view */}
        {previousButton}
        {nextElement}
      </>
    ) : (
      <>
        {nextElement}
        {previousButton}
      </>
    );
  };

  return (
    <Box display="flex" gap="xs" flexDir={{ base: "column", md: "row" }}>
      {renderNavigationButtons()}
    </Box>
  );
}

function isSubmitMode(next: NextRoutingLink): next is { submit: true } {
  return next.submit === true;
}

const GetStartedButton: React.FC<LinkButtonProps> = ({ text, url }) => (
  <DSLink
    as={Link}
    href={url}
    id="routing-links-next"
    variant="buttonPrimary"
    width={{ base: "100%", md: "auto" }}
  >
    {text}
  </DSLink>
);

const PreviousLink: React.FC<LinkButtonProps> = ({ text, url }) => (
  <DSLink
    as={Link}
    href={url}
    id="routing-links-previous"
    variant="buttonSecondary"
  >
    {text}
  </DSLink>
);

const NextButton: React.FC<SubmitButtonProps> = ({ text, isDisabled }) => (
  <Button
    variant="primary"
    id="routing-links-next"
    disabled={isDisabled}
    aria-disabled={isDisabled}
    type="submit"
  >
    {text}
  </Button>
);

export default RoutingLinks;
