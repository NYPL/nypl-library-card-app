import renderer from "react-test-renderer";

import Link from "next/link";

describe("snapshot of landing page", () => {
  it("It should render languages on page", () => {
    const spanishLinkSnapshot = renderer
      .create(
        <Link href="https://qa-www.nypl.org/library-card/new?lang=es">
          Spanish
        </Link>
      )
      .toJSON();

    expect(spanishLinkSnapshot).toMatchInlineSnapshot(`
<a
  href="https://qa-www.nypl.org/library-card/new?lang=es"
  onClick={[Function]}
  onMouseEnter={[Function]}
  onTouchStart={[Function]}
>
  Spanish
</a>
`);
  });
});
