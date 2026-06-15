import { GetStaticProps } from "next";
import { Text } from "@nypl/design-system-react-components";
import {
  BackToHomeLink,
  ContactUsLink,
  ErrorComponent,
} from "../src/components/Error";

export default function NotFoundPage() {
  return (
    <ErrorComponent
      heading="We couldn't find that page"
      description={
        <Text maxWidth="730px" margin="auto">
          The page you were looking for doesn't exist or may have moved
          elsewhere. Try starting a <BackToHomeLink /> or <ContactUsLink /> if
          the error persists.
        </Text>
      }
    />
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
