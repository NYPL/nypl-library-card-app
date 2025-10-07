export const theme = {
  styles: {
    global: {
      a: {
        base: {
          alignItems: "center",
          display: "inline-flex",
          whiteSpace: "nowrap",
        },
        _hover: {
          // Copied from DS to style the non-DS <a> components
          color: "ui.link.secondary",
          textDecoration: "underline",
          textDecorationStyle: "dotted !important",
          textDecorationThickness: "1px !important",
          textUnderlineOffset: "2px",
        },
      },
    },
  },
};
