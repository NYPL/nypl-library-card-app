import React from "react";
import { Heading, Hero, HeroTypes } from "@nypl/design-system-react-components";

export const defaultImageSrc = "/library-card/card-hero.png";
export const defaultDescription =
  "Any person who lives, works, attends school or pays property taxes in New York State is eligible to receive a New York Public Library card free of charge. With a library card you get free access to resources and services across all New York Public Library locations.";
export const defaultHeadingText = "Apply for a Library Card Online";
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
    />
  );
};

export default Banner;
