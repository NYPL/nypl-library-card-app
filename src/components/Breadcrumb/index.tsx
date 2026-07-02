import { Breadcrumbs as DSBreadcrumbs } from "@nypl/design-system-react-components";
import { useRouter } from "next/router";
import Link from "next/link";
import { appBaseUrl } from "../../../appConfig";

const Breadcrumbs = () => {
  const {
    query: { lang },
  } = useRouter();
  const localizedPath = (path: string) =>
    lang && lang !== "en" ? `${path}?lang=${lang}` : path;
  const breadcrumbsData = [
    { url: appBaseUrl || "/", text: "Home", replace: false },
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
