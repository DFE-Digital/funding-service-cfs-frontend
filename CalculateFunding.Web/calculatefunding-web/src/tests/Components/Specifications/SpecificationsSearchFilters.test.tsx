import { fireEvent, render, waitFor, within, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router";

import { SpecificationsSearchFilters } from "../../../components/Specifications/SpecificationsSearchFilters";
import { FacetValue } from "../../../types/Facet";
import { SpecificationSearchRequestViewModel } from "../../../types/SpecificationSearchRequestViewModel";

describe("<SpecificationsSearchFilters />", () => {
  describe("when initially loading with defaults", () => {
    it("renders default view", () => {
      const searchCriteria = {
        searchText: "",
        status: [],
        fundingStreams: [],
        fundingPeriods: [],
        page: 1,
        pageSize: 50
      };
      render(
        <MemoryRouter>
          <SpecificationsSearchFilters
            searchCriteria={searchCriteria}
            filterByFundingStreams={jest.fn()}
            filterByFundingPeriods={jest.fn()}
            filterBySearchStatus={jest.fn()}
            filterBySearchTerm={jest.fn()}
            initialSearch={initSearchCriteria}
            clearFilters={jest.fn()}
            addFundingStreamFilter={jest.fn()}
            removeFundingStreamFilter={jest.fn()}
            addFundingPeriodFilter={jest.fn()}
            removeFundingPeriodFilter={jest.fn()}
            addStatusFilter={jest.fn()}
            removeStatusFilter={jest.fn()}
            fundingStreamFacets={[]}
            fundingPeriodFacets={[]}
            statusFacets={[]}
          />
        </MemoryRouter>
      );

      expect(document.querySelector(".search-filters")).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /Search/ })).toBeVisible();
      expect(screen.getByRole("heading", { name: /Selected filters/ })).toBeVisible();
      expect(within(screen.getByRole("heading", { name: /Selected filters/ }).parentElement as HTMLElement)
        .getByText(/No filters selected/))
        .toBeVisible();
      expect(screen.queryByText(/Hide/)).not.toBeInTheDocument();
    });
  });

  describe("when searching by text", () => {
    it("updates search criteria", () => {
      const mockFilterBySearchTerm = jest.fn();

      render(
        <MemoryRouter>
          <SpecificationsSearchFilters
            searchCriteria={initSearchCriteria}
            filterByFundingStreams={jest.fn()}
            filterByFundingPeriods={jest.fn()}
            filterBySearchStatus={jest.fn()}
            filterBySearchTerm={mockFilterBySearchTerm}
            initialSearch={initSearchCriteria}
            clearFilters={jest.fn()}
            addFundingStreamFilter={jest.fn()}
            removeFundingStreamFilter={jest.fn()}
            addFundingPeriodFilter={jest.fn()}
            removeFundingPeriodFilter={jest.fn()}
            addStatusFilter={jest.fn()}
            removeStatusFilter={jest.fn()}
            fundingStreamFacets={[]}
            fundingPeriodFacets={[]}
            statusFacets={[]}
          />
        </MemoryRouter>
      );

      const searchBox = screen.getByRole("textbox", { name: /Search/ });
      fireEvent.change(searchBox, {
        target: { innerText: "Academy" },
      });
      waitFor(() => {
        expect(mockFilterBySearchTerm).toHaveBeenCalledWith({ searchText: "Academy" } as SpecificationSearchRequestViewModel)
      }, { timeout: 600 });
    });
  });

  describe("when 'show all sections' is clicked on", () => {
    it("expands all sections to reveal filter options", () => {
      const mockFilterByFundingStreams = jest.fn();
      const mockAddFundingStreamFilter = jest.fn();
      const fundingStreams: FacetValue[] = [{ name: "Sorcery", count: 111 }, { name: "Magic Potions", count: 222 }];

      render(
        <MemoryRouter>
          <SpecificationsSearchFilters
            searchCriteria={{ ...initSearchCriteria, fundingStreams: ["Sorcery"] }}
            filterByFundingStreams={mockFilterByFundingStreams}
            filterByFundingPeriods={jest.fn()}
            filterBySearchStatus={jest.fn()}
            filterBySearchTerm={jest.fn()}
            initialSearch={initSearchCriteria}
            clearFilters={jest.fn()}
            addFundingStreamFilter={mockAddFundingStreamFilter}
            removeFundingStreamFilter={jest.fn()}
            addFundingPeriodFilter={jest.fn()}
            removeFundingPeriodFilter={jest.fn()}
            addStatusFilter={jest.fn()}
            removeStatusFilter={jest.fn()}
            fundingStreamFacets={fundingStreams}
            fundingPeriodFacets={[]}
            statusFacets={[]}
          />
        </MemoryRouter>
      );

      const showHideAll = screen.getByText(/Show all sections/ );
      expect(showHideAll).toBeInTheDocument();
      expect(screen.queryByText(/Hide/)).not.toBeInTheDocument();
      expect(screen.getAllByText(/Show/)).toHaveLength(4);

      userEvent.click(showHideAll);

      expect(screen.getByText(/Hide all sections/)).toBeVisible();
      expect(screen.queryByText(/Show/)).not.toBeInTheDocument();
      expect(screen.getAllByText(/Hide/)).toHaveLength(4);

      expect(screen.getByRole("checkbox", { name: /Sorcery/ })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: /Magic Potions/ })).not.toBeChecked();
    });
  });

  describe("when a filter section 'show this section' is clicked on", () => {
    it("expands section to reveal filter options", () => {
      const mockFilterByFundingStreams = jest.fn();
      const mockAddFundingStreamFilter = jest.fn();
      const fundingStreams: FacetValue[] = [{ name: "Sorcery", count: 111 }, { name: "Magic Potions", count: 222 }];

      render(
        <MemoryRouter>
          <SpecificationsSearchFilters
            searchCriteria={{ ...initSearchCriteria, fundingStreams: ["Sorcery"] }}
            filterByFundingStreams={mockFilterByFundingStreams}
            filterByFundingPeriods={jest.fn()}
            filterBySearchStatus={jest.fn()}
            filterBySearchTerm={jest.fn()}
            initialSearch={initSearchCriteria}
            clearFilters={jest.fn()}
            addFundingStreamFilter={mockAddFundingStreamFilter}
            removeFundingStreamFilter={jest.fn()}
            addFundingPeriodFilter={jest.fn()}
            removeFundingPeriodFilter={jest.fn()}
            addStatusFilter={jest.fn()}
            removeStatusFilter={jest.fn()}
            fundingStreamFacets={fundingStreams}
            fundingPeriodFacets={[]}
            statusFacets={[]}
          />
        </MemoryRouter>
      );

      const fundingStreamsSection = screen.getByTestId("funding-streams-filters");
      const showFundingStreamsLabel = within(fundingStreamsSection).getByText(/Funding streams/);
      expect(showFundingStreamsLabel).toBeInTheDocument();
      expect(screen.queryByText(/Hide/)).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Selected filters/ })).toBeInTheDocument();
      const fundingStreamSummary = screen.getByRole("heading", { name: /Funding streams/, level: 3 });
      expect(fundingStreamSummary).toBeInTheDocument();
      expect(within(fundingStreamSummary.parentElement as HTMLElement).getByText(/Sorcery/)).toBeInTheDocument();

      userEvent.click(showFundingStreamsLabel);

      expect(screen.getByText(/Hide/)).toBeVisible();
      expect(screen.getByRole("checkbox", { name: /Sorcery/ })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: /Magic Potions/ })).not.toBeChecked();
      expect(screen.queryByText(/No filters selected/)).not.toBeInTheDocument();
    });
  });

  describe("when a filter option is selected", () => {
    it("sends updated filters to parent", () => {
      const mockClearFilters = jest.fn();
      const mockFilterByFundingStreams = jest.fn();
      const mockFilterByFundingPeriods = jest.fn();
      const mockFilterByStatuses = jest.fn();
      const mockFilterBySearchTerm = jest.fn();
      const mockAddFundingStreamFilter = jest.fn();
      const mockRemoveFundingStreamFilter = jest.fn();
      const fundingStreams: FacetValue[] = [{ name: "Sorcery", count: 111 }, { name: "Magic Potions", count: 222 }];

      render(
        <MemoryRouter>
          <SpecificationsSearchFilters
            searchCriteria={{ ...initSearchCriteria, fundingStreams: ["Sorcery"] }}
            filterByFundingStreams={mockFilterByFundingStreams}
            filterByFundingPeriods={mockFilterByFundingPeriods}
            filterBySearchStatus={mockFilterByStatuses}
            filterBySearchTerm={mockFilterBySearchTerm}
            initialSearch={initSearchCriteria}
            clearFilters={mockClearFilters}
            addFundingStreamFilter={mockAddFundingStreamFilter}
            removeFundingStreamFilter={mockRemoveFundingStreamFilter}
            addFundingPeriodFilter={jest.fn()}
            removeFundingPeriodFilter={jest.fn()}
            addStatusFilter={jest.fn()}
            removeStatusFilter={jest.fn()}
            fundingStreamFacets={fundingStreams}
            fundingPeriodFacets={[]}
            statusFacets={[]}
          />
        </MemoryRouter>
      );

      // first, click to show filter options
      const fundingStreamsSection = screen.getByTestId("funding-streams-filters");
      const showFundingStreamsLabel = within(fundingStreamsSection).getByText(/Funding streams/);
      userEvent.click(showFundingStreamsLabel);

      // select option
      const secondFilter = screen.getByRole("checkbox", { name: /Magic Potions/ });
      expect(secondFilter).toBeInTheDocument();
      expect(secondFilter).not.toBeChecked();
      userEvent.click(secondFilter);

      expect(mockAddFundingStreamFilter).toHaveBeenCalledWith("Magic Potions");
    });
  });


  const initSearchCriteria = {
    searchText: "",
    status: [],
    fundingStreams: [],
    fundingPeriods: [],
    page: 1,
    pageSize: 50
  };
});
