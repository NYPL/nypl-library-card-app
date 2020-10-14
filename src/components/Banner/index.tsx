import React from "react";
import { Heading, Hero, HeroTypes } from "@nypl/design-system-react-components";

export const defaultImageSrc =
  "https://www.nypl.org/sites/default/files/get-a-library-card-banner.png";
export const defaultDescription =
  "Any person who lives, works, attends school or pays property taxes in New York State is eligible to receive a New York Public Library card free of charge. With a library card you get free access to resources and services across all New York Public Library locations.";
export const defaultHeadingText = "GET A LIBRARY CARD";
interface BannerProps {
  fullImageSrc?: string;
  heroDescription?: string;
  headingText?: string;
}

/**
 * Simple component that returns the NYPL Design System's Hero component but
 * with other necessary components
 */
const Banner = ({
  fullImageSrc = defaultImageSrc,
  heroDescription = defaultDescription,
  headingText = defaultHeadingText,
}: BannerProps) => {
  const h1Heading = (
    <Heading blockName="hero" id="hero-banner" level={1} text={headingText} />
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
      heroType={HeroTypes.Primary}
      subHeaderText={subHeaderText}
    />
  );
};

export default Banner;
