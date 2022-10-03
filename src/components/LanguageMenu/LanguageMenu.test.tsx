import React from "react";
import { act, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import LanguageMenu from "./LanguageMenu";

describe("LanguageMenu", () => {
  it("passes axe accessibility checks", async () => {
    const { container } = render(<LanguageMenu />);
    await act(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it("it renders two horizontal rules", () => {
    render(<LanguageMenu />);

    expect(screen.getAllByRole("separator")).toHaveLength(2);
  });

  it("it renders a list of links", () => {
    render(<LanguageMenu />);

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(11);
    expect(links[0].textContent).toContain("Arabic");
    expect(links[0]).toHaveAttribute("href", "/new?lang=ar");
    expect(links[1].textContent).toContain("Bengali");
    expect(links[1]).toHaveAttribute("href", "/new?lang=bn");
    expect(links[2].textContent).toContain("Chinese");
    expect(links[2]).toHaveAttribute("href", "/new?lang=zhcn");
    expect(links[3].textContent).toContain("English");
    expect(links[3]).toHaveAttribute("href", "/new?lang=en");
    expect(links[4].textContent).toContain("French");
    expect(links[4]).toHaveAttribute("href", "/new?lang=fr");
    expect(links[5].textContent).toContain("Haitian Creole");
    expect(links[5]).toHaveAttribute("href", "/new?lang=ht");
    expect(links[6].textContent).toContain("Korean");
    expect(links[6]).toHaveAttribute("href", "/new?lang=ko");
    expect(links[7].textContent).toContain("Polish");
    expect(links[7]).toHaveAttribute("href", "/new?lang=pl");
    expect(links[8].textContent).toContain("Russian");
    expect(links[8]).toHaveAttribute("href", "/new?lang=ru");
    expect(links[9].textContent).toContain("Spanish");
    expect(links[9]).toHaveAttribute("href", "/new?lang=es");
    expect(links[10].textContent).toContain("Urdu");
    expect(links[10]).toHaveAttribute("href", "/new?lang=ur");
  });
});
