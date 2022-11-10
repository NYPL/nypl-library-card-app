import React from "react";
import { useTranslation } from "next-i18next";
import { Heading, Hero } from "@nypl/design-system-react-components";

export const defaultImageSrc = "/library-card/card-hero.png";
export const defaultDescription =
  "Any person who lives, works, attends school or pays property taxes in New York State is eligible to receive a New York Public Library card free of charge. With a library card you get free access to resources and services across all New York Public Library locations.";
interface BannerProps {
  fullImageSrc?: string;
  heroDescription?: string;
}

/**
 * Simple component that returns the NYPL Design System's Hero component but
 * with other necessary components
 */
const Banner = ({
  fullImageSrc = defaultImageSrc,
  heroDescription = defaultDescription,
}: BannerProps): React.ReactElement => {
  const { t } = useTranslation("common");
  const h1Heading = (
    <Heading id="hero-banner" level="one" text={t("banner.title")} />
  );
  const subHeaderText = (
    <div className="hero__body-text">{heroDescription}</div>
  );
  return (
    <Hero
      backgroundColor="#333"
      foregroundColor="#ffffff"
      backgroundImageSrc={fullImageSrc}
      heading={h1Heading}
      heroType="primary"
    />
  );
};

export default Banner;
