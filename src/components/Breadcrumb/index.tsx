import { Breadcrumbs as DSBreadcrumbs } from "@nypl/design-system-react-components";
import Link from "next/link";

const qaHref = "https://qa-www.nypl.org";
const prodHref = "https://www.nypl.org";
const Breadcrumbs = () => {
  const homeHref =
    typeof window !== "undefined" && window.location.hostname === "www.nypl.org"
      ? prodHref
      : qaHref;
  const breadcrumbsData = [
    // "/" redirects to "/library-card" url so we have to hardcode this here.
    { url: homeHref, text: "Home", replace: false },
    { url: "/new", text: "Get A Library Card", replace: true },
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
