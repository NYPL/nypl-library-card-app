interface ApplicationSubmitProps {
  id: string | null;
  lang: string;
  locationId: string;
  locationName: string;
}
/**
 * AaUtils
 * Adobe Analytics utility class that hold trackEvent methods.
 */
class AaUtils {
  /**
   * trackEvent
   * Create a function to track a, Adobe Analytics event type. A convenience
   * function values which don't change, don't have to be
   * added every time.
   */
  pageViewEvent = (windowLocation: Location) => {
    window.adobeDataLayer.push({ page_name: null, site_section: null });
    const pageName =
      windowLocation.pathname.replace(/^\//, "nypl|").replace(/\//g, "|") +
      windowLocation.search;
    window.adobeDataLayer.push({
      event: "virtual_page_view",
      page_name: pageName,
      site_section: "Library Card Application Form",
    });
  };

  // Call To Action event
  trackCtaEvent = (
    subsection: string,
    ctaText: string,
    destinationUrl: string
  ) => {
    window.adobeDataLayer.push({
      event_data: null,
    });
    window.adobeDataLayer.push({
      event: "send_event",
      event_data: {
        name: "cta_click",
        cta_section: "Library Card App",
        cta_subsection: subsection,
        cta_text: ctaText,
        cta_position: null,
        destination_url: destinationUrl,
      },
    });
  };

  // Application Sumbit event
  trackApplicationSubmitEvent = ({
    id,
    lang,
    locationId,
    locationName,
  }: ApplicationSubmitProps) => {
    window.adobeDataLayer.push({
      event_data: null,
    });

    window.adobeDataLayer.push({
      event: "send_event",
      event_data: {
        name: "application_submit",
        serialization_id: id,
        description: "Library Card",
        language: lang,
        preferred_location_id: locationId,
        preferred_location_name: locationName,
      },
    });
  };
}

const aaUtils = new AaUtils();

// Export the main instance.
export default aaUtils;
