import React, { useRef } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Link as DSLink,
} from "@nypl/design-system-react-components";
import Link from "next/link";

import useFormDataContext from "../../context/FormDataContext";
import Persona, { PersonaProps } from "../Persona";
import { createQueryParams } from "../../utils/utils";

const IdentityVerificationContainer = () => {
  const { state } = useFormDataContext();
  const result = state.identityVerificationResult;
  const router = useRouter();
  const queryStr = createQueryParams(router?.query);
  const personaActionRef = useRef<{ reopen: () => void } | null>(null);

  const handleComplete: PersonaProps["onComplete"] = () => {
    // We could redirect.. but let's stay on the page for now..
    // await router.push(`/address-verification?${queryStr}`);
  };

  return (
    <>
      <Persona actionRef={personaActionRef} onComplete={handleComplete} />

      {result && (
        <p>
          Verification status: <strong>{result.status}</strong>
        </p>
      )}

      <Box
        className="routing-links"
        display="flex"
        gap="xs"
        flexDir={{ base: "column", md: "row" }}
        mt="l"
      >
        <DSLink
          as={Link}
          href={`/location?${queryStr}`}
          id="routing-links-previous"
          variant="buttonSecondary"
        >
          Previous
        </DSLink>

        <>
          <Button onClick={() => personaActionRef.current?.reopen()}>
            Open Verification
          </Button>
          <DSLink
            as={Link}
            href={`/address-verification?${queryStr}`}
            id="routing-links-next"
            variant="buttonPrimary"
          >
            Next
          </DSLink>
        </>
      </Box>
    </>
  );
};

export default IdentityVerificationContainer;
