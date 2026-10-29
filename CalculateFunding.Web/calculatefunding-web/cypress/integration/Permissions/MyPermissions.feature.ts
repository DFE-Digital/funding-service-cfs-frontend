import { Server } from "miragejs";

import { makeServer } from "../../../src/mirage";

context("View my own permissions", () => {
  let server: Server;

  before(() => {
    setup();
  });
  after(() => {
    server.shutdown();
  });

  describe("when page has loaded", () => {
    it("has correct title", () => {
      cy.findByRole("heading", { name: /My user permissions/ }).should("exist");
    });

    it("has Funding Stream dropdown list", () => {
      cy.findByRole("combobox", { name: /Select a funding stream/i }).should("exist");
    });
  });

  describe("when user selects Funding Stream", () => {
    it("shows permission categories", () => {
      cy.findByRole("combobox", { name: /Select a funding stream/i }).select("DSG");

      cy.findByRole("heading", { name: /Administration permissions/i }).should("exist");
    });
  });

  // on key down cases
  describe("keyboard navigation for autocomplete", () => {
  it("opens suggestions with ArrowDown", () => {
    cy.findByRole("combobox", { name: /Select a funding stream/i })
      .focus()
      .type("{downarrow}");

    cy.findByRole("listbox").should("be.visible");
  });

  it("navigates suggestions with ArrowDown and selects with Enter", () => {
    cy.findByRole("combobox", { name: /Select a funding stream/i })
      .focus()
      .type("{downarrow}")
      .type("{downarrow}")
      .type("{enter}");

    cy.findByRole("heading", {
      name: /Administration permissions/i,
    }).should("exist");
  });

  it("closes suggestions with Escape", () => {
    cy.findByRole("combobox", { name: /Select a funding stream/i })
      .focus()
      .type("{downarrow}");

    cy.findByRole("listbox").should("be.visible");

    cy.findByRole("combobox", {
      name: /Select a funding stream/i,
    }).type("{esc}");

    cy.findByRole("listbox").should("not.be.visible");
  });
});

  function setup() {
    server?.shutdown();
    server = makeServer({ environment: "test" });

    cy.visit("/Permissions/MyPermissions");
  }
});
