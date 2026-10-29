import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ListVersions } from "../../../pages/Templates/ListVersions";
import { fakery } from "../../fakes/fakery";
import { QueryClientProviderTestWrapper } from "../../Hooks/QueryClientProviderTestWrapper";
import { useTemplateUtils } from "../../testing-utils/useTemplateUtils";
import { useTemplateVersionsUtils } from "../../testing-utils/useTemplateVersionsUtils";
import { TemplateStatus } from "types/TemplateBuilderDefinitions";

describe("ListVersions", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("when versions exist", () => {
    beforeEach(() => {
      useTemplateVersionsUtils.withTemplateVersionsResponse([
  fakery.makeTemplateVersion({
    version: 1,
    majorVersion: 1,
    minorVersion: 0,
    status: TemplateStatus.Draft,
  }),
  fakery.makeTemplateVersion({
    version: 2,
    majorVersion: 2,
    minorVersion: 0,
    status: TemplateStatus.Published,
  }),
]);

      useTemplateUtils.withTemplateResponse(fakery.makeTemplate({}));
    });

    it("renders the page heading correctly", async () => {
      renderPage();

      expect(
        screen.getByRole("heading", {
          name: "Check the template version history",
        })
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Check template version details or restore a previous template version."
        )
      ).toBeInTheDocument();
    });

    it("renders versions list correctly", async () => {
      renderPage();

      await waitFor(() => {
        expect(screen.getByTestId("version-1")).toBeInTheDocument();
        expect(screen.getByTestId("version-2")).toBeInTheDocument();
      });
    });

    it("renders updated version labels", async () => {
      renderPage();

      await waitFor(() => {
        expect(screen.getByText("V1.0")).toBeInTheDocument();
        expect(screen.getByText("V2.0")).toBeInTheDocument();
      });
    });

  it("renders filter sidebar", async () => {
  renderPage();

  expect(await screen.findByText("Filters")).toBeInTheDocument();
  expect(screen.getByText("Selected filters")).toBeInTheDocument();

  expect(await screen.findByTestId("status-1")).toBeInTheDocument();
  expect(await screen.findByTestId("status-2")).toBeInTheDocument();

  expect(screen.getByText("Published")).toBeInTheDocument();
});
  });

  describe("when filtered search returns no versions", () => {
    beforeEach(() => {
      useTemplateVersionsUtils.withTemplateVersionsResponse([]);
      useTemplateUtils.withTemplateResponse(fakery.makeTemplate({}));
    });

    it("renders no results correctly", async () => {
      renderPage();

      await waitFor(() => {
        expect(screen.getByTestId("no-results")).toBeVisible();
        expect(
          screen.getByText("There are no records to match your search")
        ).toBeInTheDocument();
      });
    });
  });

  describe("when loading", () => {
  beforeEach(() => {
    useTemplateUtils.spy.mockReturnValue({
      template: undefined,
      isLoadingTemplate: true,
    });

    useTemplateVersionsUtils.spy.mockReturnValue({
      templateVersions: undefined,
      isLoadingTemplateVersions: true,
    });
  });

    it("renders loading state only", () => {
      renderPage();

      expect(screen.getByText("Loading")).toBeInTheDocument();
      expect(
        screen.getByText("Please wait whilst the template versions are loading")
      ).toBeInTheDocument();

      expect(
        screen.queryByText("Check the template version history")
      ).not.toBeInTheDocument();
    });
  });
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <QueryClientProviderTestWrapper>
        <ListVersions />
      </QueryClientProviderTestWrapper>
    </MemoryRouter>
  );