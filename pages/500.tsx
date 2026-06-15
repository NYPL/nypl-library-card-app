import { Text } from "@nypl/design-system-react-components";
import {
  BackToHomeLink,
  ContactUsLink,
  ErrorComponent,
} from "../src/components/Error";

export default function ServerErrorPage() {
  return (
    <ErrorComponent
      heading="Something went wrong on our end"
      description={
        <Text maxWidth="700px" margin="auto">
          We are working to resolve a server issue. Your application progress
          may not have been saved. Try starting a <BackToHomeLink /> in a few
          minutes or <ContactUsLink /> if the error persists.
        </Text>
      }
    />
  );
}
