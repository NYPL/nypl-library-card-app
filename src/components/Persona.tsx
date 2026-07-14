import React, { useEffect, useRef } from "react";
import useFormDataContext from "../context/FormDataContext";
import type { InquiryStatus } from "../../pages/api/inquiries/[id]";
import { Client } from "persona";

const MAX_POLL_MS = 30000;
const POLL_INTERVAL_MS = 2000;

async function pollInquiryStatus(
  inquiryId: string
): Promise<{ status: InquiryStatus; attributes: Record<string, any> } | null> {
  const deadline = Date.now() + MAX_POLL_MS;

  while (Date.now() < deadline) {
    const res = await fetch(`/library-card/api/inquiries/${inquiryId}`);
    if (res.ok) {
      const data = await res.json();
      const statuses = [
        "completed",
        "approved",
        "declined",
        "expired",
        "failed",
      ];
      if (statuses.includes(data.status)) {
        return { status: data.status, attributes: data.attributes ?? {} };
      }
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  return null;
}

export interface PersonaProps {
  onComplete?: (result: {
    status: InquiryStatus;
    attributes: Record<string, any>;
  }) => void;
  onError?: (error: Error) => void;
  actionRef?: React.MutableRefObject<{ reopen: () => void } | null>;
}

const Persona: React.FC<PersonaProps> = ({
  onComplete,
  onError,
  actionRef,
}) => {
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const clientRef = useRef<any>(null);
  const inquiryIdRef = useRef<string | undefined>(undefined);
  const sessionTokenRef = useRef<string | undefined>(undefined);

  const openClient = async (inquiryId?: string, sessionToken?: string) => {
    const options: ConstructorParameters<typeof Client>[0] = {
      templateId: process.env.NEXT_PUBLIC_PERSONA_INQUIRY_TEMPLATE_ID,
      environment: "sandbox",
      onComplete: ({ inquiryId: id }) => {
        void (async () => {
          const result = await pollInquiryStatus(id);
          const finalResult = result ?? {
            status: "skipped" as InquiryStatus,
            attributes: {},
          };
          dispatch({
            type: "SET_IDENTITY_VERIFICATION_STATUS",
            value: finalResult,
          });
          onComplete?.(finalResult);
        })();
      },
      onError: ({ message }) => {
        dispatch({
          type: "SET_IDENTITY_VERIFICATION_STATUS",
          value: { message, status: "failed" },
        });
        onError?.(new Error(message));
      },
    };

    if (inquiryId) options.inquiryId = inquiryId;
    if (sessionToken) options.sessionToken = sessionToken;

    clientRef.current = new Client(options);
    clientRef.current.open();
  };

  const startVerification = async () => {
    try {
      const res = await fetch("/library-card/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          birthdate: formValues.birthdate,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Failed to create inquiry (${res.status}): ${body}`);
      }

      const { inquiry_id, session_token } = await res.json();
      inquiryIdRef.current = inquiry_id;
      sessionTokenRef.current = session_token ?? undefined;
      await openClient(inquiry_id, session_token ?? undefined);
    } catch (err: any) {
      console.error(err);
      onError?.(err);
    }
  };

  useEffect(() => {
    // Expose reopen() to parent via actionRef
    if (actionRef) {
      actionRef.current = {
        reopen: () => {
          if (clientRef.current) {
            clientRef.current.open();
          } else {
            openClient(inquiryIdRef.current, sessionTokenRef.current);
          }
        },
      };
    }
    startVerification();
  }, []);

  return null;
};

export default Persona;
