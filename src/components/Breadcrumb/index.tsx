import { Breadcrumbs as DSBreadcrumbs } from "@nypl/design-system-react-components";
import Link from "next/link";
import { useRouter } from "next/router";

const qaHref = "https://qa-www.nypl.org";
const prodHref = "https://www.nypl.org";

const Breadcrumbs = () => {
  const { locale } = useRouter();

  const homeHref =
    typeof window !== "undefined" && window.location.hostname === "www.nypl.org"
      ? prodHref
      : qaHref;

  const LocalizedLink = ({
    href,
    ...props
  }: React.ComponentProps<typeof Link>) => (
    <Link href={href} locale={locale} {...props} />
  );

  const breadcrumbsData = [
    { url: homeHref, text: "Home", replace: false },
    { url: "/new", text: "Get A Library Card", replace: true },
  ];

  return (
    <DSBreadcrumbs
      variant="booksAndMore"
      breadcrumbsData={breadcrumbsData}
      customLinkComponent={LocalizedLink}
    />
  );
};

export default Breadcrumbs;
