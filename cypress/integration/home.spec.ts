/// <reference types="cypress" />

context("Home", () => {
  beforeEach(() => {
    // Make sure that the app is running locally.
    cy.visit("http://localhost:3000/library-card/new");
  });

  it("fill out the first two form pages", () => {
    // Click the Get started button.
    cy.get(".content-primary .button").click();

    // Verifying the URL.
    cy.location("pathname").should("not.include", "new");
    cy.location("pathname").should("include", "personal");

    // Fill out the form and alias the input with an easier name variable.
    cy.get("#input-firstName").as("firstName").type("Tom");
    cy.get("#input-lastName").as("lastName").type("Nook");
    cy.get("#input-birthdate").as("birthdate").type("01/01/1988");
    cy.get("#input-email").as("email").type("tomnook@ac.com");

    cy.get("@firstName").should("have.value", "Tom");
    cy.get("@lastName").should("have.value", "Nook");
    cy.get("@birthdate").should("have.value", "01/01/1988");
    cy.get("@email").should("have.value", "tomnook@ac.com");

    cy.get("form").find("[type='submit']").click();

    // Verifying the URL.
    cy.location("pathname").should("not.include", "personal");
    cy.location("pathname").should("include", "location");

    // Fill out the form and alias the input with an easier name variable.
    cy.get("#input-line1-home").as("line1").type("476 5th Avenue");
    cy.get("#input-city-home").as("city").type("New York");
    cy.get("#input-state-home").as("state").type("NY");
    cy.get("#input-zip-home").as("zip").type("10018");

    cy.get("@line1").should("have.value", "476 5th Avenue");
    cy.get("@city").should("have.value", "New York");
    cy.get("@state").should("have.value", "NY");
    cy.get("@zip").should("have.value", "10018");

    cy.get("form").find("[type='submit']").click();

    // Verifying the URL.
    cy.location("pathname").should("not.include", "location");
    cy.location("pathname").should("include", "workAddress");
  });
});

export {};
