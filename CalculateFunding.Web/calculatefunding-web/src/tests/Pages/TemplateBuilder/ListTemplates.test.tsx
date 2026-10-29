import React from "react";
import * as redux from "react-redux";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { ListTemplates } from "../../../pages/Templates/ListTemplates";
import { useTemplateSearch } from "../../../hooks/TemplateBuilder/useTemplateSearch";
import { useTemplatePermissions } from "../../../hooks/TemplateBuilder/useTemplatePermissions";
import { TemplatePermissions, TemplateStatus } from "../../../types/TemplateBuilderDefinitions";

jest.mock("../../../hooks/TemplateBuilder/useTemplateSearch");
jest.mock("../../../hooks/TemplateBuilder/useTemplatePermissions");

const mockUseTemplateSearch = useTemplateSearch as jest.Mock;
const mockUseTemplatePermissions = useTemplatePermissions as jest.Mock;

const renderPage = () =>
  render(
    <MemoryRouter>
      <ListTemplates />
    </MemoryRouter>
  );

const mockTemplate1 = {
  id: "111",
  name: "Template #1",
  lastUpdatedDate: "2026-01-01T10:00:00Z",
  lastUpdatedAuthorName: "Alice",
  currentMajorVersion: 1,
  currentMinorVersion: 0,
  status: TemplateStatus.Draft,
};

const mockTemplate2 = {
  id: "222",
  name: "Template #2",
  lastUpdatedDate: "2026-01-02T10:00:00Z",
  lastUpdatedAuthorName: "Bob",
  currentMajorVersion: 2,
  currentMinorVersion: 1,
  status: TemplateStatus.Published,
};

describe("ListTemplates", () => {
  afterEach(() => jest.clearAllMocks());

  describe("permissions", () => {
    it("shows create button when user can create templates", async () => {
      mockUseTemplatePermissions.mockReturnValue({
        canCreateTemplate: true,
        missingPermissions: [],
      });

      mockUseTemplateSearch.mockReturnValue({
        templateSearchResponse: { results: [] },
        isLoadingTemplateSearchResults: false,
      });

      renderPage();

      expect(await screen.findByTestId("create-template-link")).toBeInTheDocument();
    });

    it("does not show create button when user cannot create templates", async () => {
      mockUseTemplatePermissions.mockReturnValue({
        canCreateTemplate: false,
        missingPermissions: ["Create"],
      });

      mockUseTemplateSearch.mockReturnValue({
        templateSearchResponse: { results: [] },
        isLoadingTemplateSearchResults: false,
      });

      renderPage();

      await waitFor(() => {
        expect(screen.queryByTestId("create-template-link")).not.toBeInTheDocument();
      });

      expect(screen.getByText(/read-only access/i)).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("shows loading indicator", () => {
      mockUseTemplatePermissions.mockReturnValue({
        canCreateTemplate: true,
        missingPermissions: [],
      });

      mockUseTemplateSearch.mockReturnValue({
        templateSearchResponse: null,
        isLoadingTemplateSearchResults: true,
      });

      renderPage();

      expect(screen.getByText(/loading templates list/i)).toBeInTheDocument();
    });
  });

  describe("empty results", () => {
    it("shows empty state when no results returned", async () => {
      mockUseTemplatePermissions.mockReturnValue({
        canCreateTemplate: true,
        missingPermissions: [],
      });

      mockUseTemplateSearch.mockReturnValue({
        templateSearchResponse: { results: [] },
        isLoadingTemplateSearchResults: false,
      });

      renderPage();

      expect(await screen.findByText(/showing 0 results/i)).toBeInTheDocument();
      expect(screen.queryByTestId("template-results")).not.toBeInTheDocument();
    });
  });

  describe("with results", () => {
    it("renders templates table", async () => {
      mockUseTemplatePermissions.mockReturnValue({
        canCreateTemplate: true,
        missingPermissions: [],
      });

      mockUseTemplateSearch.mockReturnValue({
        templateSearchResponse: {
          results: [mockTemplate1, mockTemplate2],
          pagerState: { currentPage: 1, lastPage: 2 },
          startItemNumber: 1,
          endItemNumber: 2,
          totalCount: 2,
        },
        isLoadingTemplateSearchResults: false,
      });

      renderPage();

      expect(await screen.findByTestId("template-results")).toBeInTheDocument();

      expect(screen.getByText("Template #1")).toBeInTheDocument();
      expect(screen.getByText("Template #2")).toBeInTheDocument();

      expect(screen.getByTestId("template-result-111")).toBeInTheDocument();
      expect(screen.getByTestId("template-result-222")).toBeInTheDocument();
    });

    it("renders pagination and results summary", async () => {
      mockUseTemplatePermissions.mockReturnValue({
        canCreateTemplate: true,
        missingPermissions: [],
      });

      mockUseTemplateSearch.mockReturnValue({
        templateSearchResponse: {
          results: [mockTemplate1],
          pagerState: { currentPage: 1, lastPage: 5 },
          startItemNumber: 1,
          endItemNumber: 1,
          totalCount: 10,
        },
        isLoadingTemplateSearchResults: false,
      });

      renderPage();

      expect(await screen.findByText(/showing 1 to 1 of 10 results/i)).toBeInTheDocument();
    });

    it("navigates when template name clicked", async () => {
      const history = createMemoryHistory();

      mockUseTemplatePermissions.mockReturnValue({
        canCreateTemplate: true,
        missingPermissions: [],
      });

      mockUseTemplateSearch.mockReturnValue({
        templateSearchResponse: {
          results: [mockTemplate1],
        },
        isLoadingTemplateSearchResults: false,
      });

      render(
        <Router history={history}>
          <ListTemplates />
        </Router>
      );

      const link = await screen.findByText("Template #1");
      fireEvent.click(link);

      expect(history.location.pathname).toBe("/Templates/111/Edit");
    });

    it("adds disableUndo when shift-clicking template", async () => {
      const history = createMemoryHistory();

      mockUseTemplatePermissions.mockReturnValue({
        canCreateTemplate: true,
        missingPermissions: [],
      });

      mockUseTemplateSearch.mockReturnValue({
        templateSearchResponse: {
          results: [mockTemplate1],
        },
        isLoadingTemplateSearchResults: false,
      });

      render(
        <Router history={history}>
          <ListTemplates />
        </Router>
      );

      const link = await screen.findByText("Template #1");

      fireEvent.click(link, { shiftKey: true });

      expect(history.location.pathname).toBe("/Templates/111/Edit");
      expect(history.location.search).toContain("disableUndo=true");
    });
  });
});