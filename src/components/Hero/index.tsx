import { useTranslation } from "next-i18next";
import { Heading, Hero as DSHero } from "@nypl/design-system-react-components";

export const defaultImageSrc = "/library-card/card-hero.png";
export const defaultDescription =
  "Any person who lives, works, attends school or pays property taxes in New York State is eligible to receive a New York Public Library card free of charge. With a library card you get free access to resources and services across all New York Public Library locations.";

interface HeroProps {
  fullImageSrc?: string;
}

/**
 * Simple component that returns the NYPL Design System's Hero component but
 * with other necessary components
 */
const Hero = ({ fullImageSrc = defaultImageSrc }: HeroProps) => {
  const { t } = useTranslation("common");
  const h1Heading = (
    <Heading id="hero-banner" level="h1" text={t("banner.title")} />
  );
  return (
    <DSHero
      backgroundImageSrc={fullImageSrc}
      heading={h1Heading}
      variant="primary"
    />
  );
};

export default Hero;
