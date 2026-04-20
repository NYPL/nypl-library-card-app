import { Breadcrumbs as DSBreadcrumbs } from "@nypl/design-system-react-components";
import { useRouter } from "next/router";
import Link from "next/link";

const qaHref = "https://qa-www.nypl.org";
const prodHref = "https://www.nypl.org";
const Breadcrumbs = () => {
  const {
    query: { lang },
  } = useRouter();
  const homeHref =
    typeof window !== "undefined" && window.location.hostname === "www.nypl.org"
      ? prodHref
      : qaHref;
  const localizedPath = (path: string) =>
    lang && lang !== "en" ? `/${path}?lang=${lang}` : path;
  const breadcrumbsData = [
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
