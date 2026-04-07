import { Breadcrumbs as DSBreadcrumbs } from "@nypl/design-system-react-components";
import { useRouter } from "next/router";
import Link from "next/link";

const qaHref = "https://qa-www.nypl.org";
const prodHref = "https://www.nypl.org";
const Breadcrumbs = () => {
  const { locale } = useRouter();
  const homeHref =
    typeof window !== "undefined" && window.location.hostname === "www.nypl.org"
      ? prodHref
      : qaHref;
  const localizedPath = (path: string) =>
    locale && locale !== "en" ? `/${locale}${path}` : path;
  const breadcrumbsData = [
    // "/" redirects to "/library-card" url so we have to hardcode this here.
    { url: homeHref, text: "Home", replace: false },
    { url: localizedPath("/new"), text: "Get A Library Card", replace: true },
  ];
  return (
    <DSBreadcrumbs
      variant="booksAndMore"
      breadcrumbsData={breadcrumbsData}
      customLinkComponent={Link}
    />
  );
};

export default Breadcrumbs;
