import { render, within, screen  } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router";
import { SearchMode } from "types/SearchMode";

import { ViewCalculationResultsSearchFilters } from "../../../components/Calculations/ViewCalculationResultsSearchFilter";
import { FacetValue } from "../../../types/Facet";
import { CalculationProviderSearchRequest } from "../../../types/calculationProviderSearchRequest";

describe("<ViewCalculationResultsSearchFilters />", () => {
    
  describe("when initially loading with defaults", () => {
    it("renders default view", () => {    
      render(
        <MemoryRouter>        
          <ViewCalculationResultsSearchFilters
            searchCriteria={searchCriteria}
            initialSearch={searchCriteria}
            filterBySearchTerm={jest.fn()}
            addProviderTypeFilter = {jest.fn()}
            removeProviderTypeFilter = {jest.fn()}
            addProviderSubTypeFilter = {jest.fn()}
            removeProviderSubTypeFilter = {jest.fn()}
            addResultStatusFilter = {jest.fn()}
            removeResultStatusFilter = {jest.fn()}
            addLocalAuthorityFilter = {jest.fn()}
            removeLocalAuthorityFilter = {jest.fn()}
            filterByProviderType = {jest.fn()}
            filterByProviderSubType = {jest.fn()}
            filterByResultStatus = {jest.fn()}
            filterByLocalauthority = {jest.fn()}
            providerTypeFacets = {[]}
            providerSubTypeFacets = {[]}
            resultStatusFacets = {[]}
            localAuthorityFacets = {[]}
            clearFilters = {jest.fn()}
          />
        </MemoryRouter>
      );

      expect(document.querySelector(".search-filters")).toBeInTheDocument();
      expect(document.querySelector("#search-options-providers")).toBeInTheDocument();
      expect(document.querySelector("#search-options-UKPRN")).toBeInTheDocument();
      expect(document.querySelector("#search-options-UPIN")).toBeInTheDocument();
      expect(document.querySelector("#search-options-URN")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Selected filters/ })).toBeVisible();
      expect(within(screen.getByRole("heading", { name: /Selected filters/ }).parentElement as HTMLElement)
        .getByText(/No filters selected/))
        .toBeVisible();
    });
  }); 

 
  describe("when 'show all sections' is clicked on", () => {
    it("expands all sections to reveal filter options", () => {

       render(
        <MemoryRouter>
            <ViewCalculationResultsSearchFilters
                searchCriteria={searchCriteria}
                initialSearch={searchCriteria}
                filterBySearchTerm={jest.fn()}
                addProviderTypeFilter = {jest.fn()}
                removeProviderTypeFilter = {jest.fn()}
                addProviderSubTypeFilter = {jest.fn()}
                removeProviderSubTypeFilter = {jest.fn()}
                addResultStatusFilter = {jest.fn()}
                removeResultStatusFilter = {jest.fn()}
                addLocalAuthorityFilter = {jest.fn()}
                removeLocalAuthorityFilter = {jest.fn()}
                filterByProviderType = {jest.fn()}
                filterByProviderSubType = {jest.fn()}
                filterByResultStatus = {jest.fn()}
                filterByLocalauthority = {jest.fn()}
                providerTypeFacets = {[]}
                providerSubTypeFacets = {[]}
                resultStatusFacets = {[]}
                localAuthorityFacets = {[]}
                clearFilters = {jest.fn()}
            />
        </MemoryRouter>
      );
      const showHideAll = screen.getByText(/Show all sections/ );
      expect(showHideAll).toBeInTheDocument();
      expect(screen.queryByText(/Hide/)).not.toBeInTheDocument();
      expect(screen.getAllByText(/Show/)).toHaveLength(5);

      userEvent.click(showHideAll);

      expect(screen.getByText(/Hide all sections/)).toBeVisible();
      expect(screen.queryByText(/Show/)).not.toBeInTheDocument();
      expect(screen.getAllByText(/Hide/)).toHaveLength(5);
 
      expect(document.querySelector(".search-filters__section-toggle-text")).toBeInTheDocument();

    });
  });
 

  describe("when a local authority filter section 'show this section' is clicked on", () => {
    it("expands section to reveal filter options", () => {
      const localAuthorities: FacetValue[] = [{ name: "Sorcery", count: 111 }, { name: "Magic Potions", count: 222 }];

      render(
        <MemoryRouter>
            <ViewCalculationResultsSearchFilters
                searchCriteria={{...searchCriteria, localAuthority:["Sorcery"]}}
                initialSearch={searchCriteria}
                filterBySearchTerm={jest.fn()}
                addProviderTypeFilter = {jest.fn()}
                removeProviderTypeFilter = {jest.fn()}
                addProviderSubTypeFilter = {jest.fn()}
                removeProviderSubTypeFilter = {jest.fn()}
                addResultStatusFilter = {jest.fn()}
                removeResultStatusFilter = {jest.fn()}
                addLocalAuthorityFilter = {jest.fn()}
                removeLocalAuthorityFilter = {jest.fn()}
                filterByProviderType = {jest.fn()}
                filterByProviderSubType = {jest.fn()}
                filterByResultStatus = {jest.fn()}
                filterByLocalauthority = {jest.fn()}
                providerTypeFacets = {[]}
                providerSubTypeFacets = {[]}
                resultStatusFacets = {[]}
                localAuthorityFacets = {localAuthorities}
                clearFilters = {jest.fn()}
            />
        </MemoryRouter>
      );

      const localAuthoritySection = screen.getByTestId("local-authority-filters");
      const showLocalAuthorityLabel = within(localAuthoritySection).getByText(/Local authority/);
      expect(showLocalAuthorityLabel).toBeInTheDocument();
      expect(screen.queryByText(/Hide/)).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Selected filters/ })).toBeInTheDocument();
      const localAuthoritySummary = screen.getByRole("heading", { name: /Local authority/, level: 3 });
      expect(localAuthoritySummary).toBeInTheDocument();
      expect(within(localAuthoritySummary.parentElement as HTMLElement).getByText(/Sorcery/)).toBeInTheDocument();

      userEvent.click(showLocalAuthorityLabel);

      expect(screen.getByText(/Hide/)).toBeVisible();
      expect(screen.getByRole("checkbox", { name: /Sorcery/ })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: /Magic Potions/ })).not.toBeChecked();
      expect(screen.queryByText(/No filters selected/)).not.toBeInTheDocument();
    });
  });
  describe("when a provider sub type filter section 'show this section' is clicked on", () => {
    it("expands section to reveal filter options", () => {
      const providerSubTypes: FacetValue[] = [{ name: "Sorcery", count: 111 }, { name: "Magic Potions", count: 222 }];

      render(
        <MemoryRouter>
            <ViewCalculationResultsSearchFilters
                searchCriteria={{...searchCriteria, providerSubType:["Sorcery"]}}
                initialSearch={searchCriteria}
                filterBySearchTerm={jest.fn()}
                addProviderTypeFilter = {jest.fn()}
                removeProviderTypeFilter = {jest.fn()}
                addProviderSubTypeFilter = {jest.fn()}
                removeProviderSubTypeFilter = {jest.fn()}
                addResultStatusFilter = {jest.fn()}
                removeResultStatusFilter = {jest.fn()}
                addLocalAuthorityFilter = {jest.fn()}
                removeLocalAuthorityFilter = {jest.fn()}
                filterByProviderType = {jest.fn()}
                filterByProviderSubType = {jest.fn()}
                filterByResultStatus = {jest.fn()}
                filterByLocalauthority = {jest.fn()}
                providerTypeFacets = {[]}
                providerSubTypeFacets = {providerSubTypes}
                resultStatusFacets = {[]}
                localAuthorityFacets = {[]}
                clearFilters = {jest.fn()}
            />
        </MemoryRouter>
      );

      const providerSubTypeSection = screen.getByTestId("provider-sub-type-filters");
      const showProviderSubTypeLabel = within(providerSubTypeSection).getByText(/Provider sub type/);
      expect(showProviderSubTypeLabel).toBeInTheDocument();
      expect(screen.queryByText(/Hide/)).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Selected filters/ })).toBeInTheDocument();
      const providerTypeSummary = screen.getByRole("heading", { name: /Provider sub type/, level: 3 });
      expect(providerTypeSummary).toBeInTheDocument();
      expect(within(providerTypeSummary.parentElement as HTMLElement).getByText(/Sorcery/)).toBeInTheDocument();

      userEvent.click(showProviderSubTypeLabel);

      expect(screen.getByText(/Hide/)).toBeVisible();
      expect(screen.getByRole("checkbox", { name: /Sorcery/ })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: /Magic Potions/ })).not.toBeChecked();
      expect(screen.queryByText(/No filters selected/)).not.toBeInTheDocument();
    });
  });
  describe("when a provider type filter section 'show this section' is clicked on", () => {
    it("expands section to reveal filter options", () => {
      const providerTypes: FacetValue[] = [{ name: "Sorcery", count: 111 }, { name: "Magic Potions", count: 222 }];

      render(
        <MemoryRouter>
            <ViewCalculationResultsSearchFilters
                searchCriteria={{...searchCriteria, providerType:["Sorcery"]}}
                initialSearch={searchCriteria}
                filterBySearchTerm={jest.fn()}
                addProviderTypeFilter = {jest.fn()}
                removeProviderTypeFilter = {jest.fn()}
                addProviderSubTypeFilter = {jest.fn()}
                removeProviderSubTypeFilter = {jest.fn()}
                addResultStatusFilter = {jest.fn()}
                removeResultStatusFilter = {jest.fn()}
                addLocalAuthorityFilter = {jest.fn()}
                removeLocalAuthorityFilter = {jest.fn()}
                filterByProviderType = {jest.fn()}
                filterByProviderSubType = {jest.fn()}
                filterByResultStatus = {jest.fn()}
                filterByLocalauthority = {jest.fn()}
                providerTypeFacets = {providerTypes}
                providerSubTypeFacets = {[]}
                resultStatusFacets = {[]}
                localAuthorityFacets = {[]}
                clearFilters = {jest.fn()}
            />
        </MemoryRouter>
      );

      const providerTypeSection = screen.getByTestId("provider-type-filters");
      const showProviderTypeLabel = within(providerTypeSection).getByText(/Provider type/);
      expect(showProviderTypeLabel).toBeInTheDocument();
      expect(screen.queryByText(/Hide/)).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Selected filters/ })).toBeInTheDocument();
      const providerTypeSummary = screen.getByRole("heading", { name: /Provider type/, level: 3 });
      expect(providerTypeSummary).toBeInTheDocument();
      expect(within(providerTypeSummary.parentElement as HTMLElement).getByText(/Sorcery/)).toBeInTheDocument();

      userEvent.click(showProviderTypeLabel);

      expect(screen.getByText(/Hide/)).toBeVisible();
      expect(screen.getByRole("checkbox", { name: /Sorcery/ })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: /Magic Potions/ })).not.toBeChecked();
      expect(screen.queryByText(/No filters selected/)).not.toBeInTheDocument();
    });
  });

  describe("when a result status filter section 'show this section' is clicked on", () => {
    it("expands section to reveal filter options", () => {

      const resultStatus: FacetValue[] = [{ name: "With exceptions", count: 111 }, { name: "Without exceptions", count: 222 }];

      render(
        <MemoryRouter>
            <ViewCalculationResultsSearchFilters
                searchCriteria={{...searchCriteria, resultsStatus:["With exceptions"]}}
                initialSearch={searchCriteria}
                filterBySearchTerm={jest.fn()}
                addProviderTypeFilter = {jest.fn()}
                removeProviderTypeFilter = {jest.fn()}
                addProviderSubTypeFilter = {jest.fn()}
                removeProviderSubTypeFilter = {jest.fn()}
                addResultStatusFilter = {jest.fn()}
                removeResultStatusFilter = {jest.fn()}
                addLocalAuthorityFilter = {jest.fn()}
                removeLocalAuthorityFilter = {jest.fn()}
                filterByProviderType = {jest.fn()}
                filterByProviderSubType = {jest.fn()}
                filterByResultStatus = {jest.fn()}
                filterByLocalauthority = {jest.fn()}
                providerTypeFacets = {[]}
                providerSubTypeFacets = {[]}
                resultStatusFacets = {resultStatus}
                localAuthorityFacets = {[]}
                clearFilters = {jest.fn()}
            />
        </MemoryRouter>
      );

      const resultStatusSection = screen.getByTestId("result-status-filters");
      const showResultStatusLabel = within(resultStatusSection).getByText(/Result status/);
      expect(showResultStatusLabel).toBeInTheDocument();
      expect(screen.queryByText(/Hide/)).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Selected filters/ })).toBeInTheDocument();
      const resultStatusSummary = screen.getByRole("heading", { name: /Result status/, level: 3 });
      expect(resultStatusSummary).toBeInTheDocument();
      expect(within(resultStatusSummary.parentElement as HTMLElement).getByText(/With exceptions/)).toBeInTheDocument();

      userEvent.click(showResultStatusLabel);

      expect(screen.getByText(/Hide/)).toBeVisible();
      expect(screen.getByRole("checkbox", { name: /With exceptions/ })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: /Without exceptions/ })).not.toBeChecked();
      expect(screen.queryByText(/No filters selected/)).not.toBeInTheDocument();
    });
  });

  describe("when a provider type filter option is selected", () => {
    it("sends updated filters to parent", () => {
      const mockAddProviderTypeFilter = jest.fn();
      const providerTypes: FacetValue[] = [{ name: "Sorcery", count: 111 }, { name: "Magic Potions", count: 222 }];

      render(
        <MemoryRouter>
            <ViewCalculationResultsSearchFilters
                searchCriteria={{...searchCriteria, providerType:["Sorcery"]}}
                initialSearch={searchCriteria}
                filterBySearchTerm={jest.fn()}
                addProviderTypeFilter = {mockAddProviderTypeFilter}
                removeProviderTypeFilter = {jest.fn()}
                addProviderSubTypeFilter = {jest.fn()}
                removeProviderSubTypeFilter = {jest.fn()}
                addResultStatusFilter = {jest.fn()}
                removeResultStatusFilter = {jest.fn()}
                addLocalAuthorityFilter = {jest.fn()}
                removeLocalAuthorityFilter = {jest.fn()}
                filterByProviderType = {jest.fn()}
                filterByProviderSubType = {jest.fn()}
                filterByResultStatus = {jest.fn()}
                filterByLocalauthority = {jest.fn()}
                providerTypeFacets = {providerTypes}
                providerSubTypeFacets = {[]}
                resultStatusFacets = {[]}
                localAuthorityFacets = {[]}
                clearFilters = {jest.fn()}
            />
        </MemoryRouter>
      );    
      // first, click to show filter options
      const providerTypeSection = screen.getByTestId("provider-type-filters");
      const showProviderTypeLabel = within(providerTypeSection).getByText(/Provider type/);
      userEvent.click(showProviderTypeLabel);

      // select option
      const secondFilter = screen.getByRole("checkbox", { name: /Magic Potions/ });
      expect(secondFilter).toBeInTheDocument();
      expect(secondFilter).not.toBeChecked();
      userEvent.click(secondFilter);

      expect(mockAddProviderTypeFilter).toHaveBeenCalledWith("Magic Potions");
    });
  });

  describe("when a provider sub type filter option is selected", () => {
    it("sends updated filters to parent", () => {
      const mockAddProviderSubTypeFilter = jest.fn();
      const providerSubTypes: FacetValue[] = [{ name: "Sorcery", count: 111 }, { name: "Magic Potions", count: 222 }];

      render(
        <MemoryRouter>
            <ViewCalculationResultsSearchFilters
                searchCriteria={{...searchCriteria, providerType:["Sorcery"]}}
                initialSearch={searchCriteria}
                filterBySearchTerm={jest.fn()}
                addProviderTypeFilter = {jest.fn()}
                removeProviderTypeFilter = {jest.fn()}
                addProviderSubTypeFilter = {mockAddProviderSubTypeFilter}
                removeProviderSubTypeFilter = {jest.fn()}
                addResultStatusFilter = {jest.fn()}
                removeResultStatusFilter = {jest.fn()}
                addLocalAuthorityFilter = {jest.fn()}
                removeLocalAuthorityFilter = {jest.fn()}
                filterByProviderType = {jest.fn()}
                filterByProviderSubType = {jest.fn()}
                filterByResultStatus = {jest.fn()}
                filterByLocalauthority = {jest.fn()}
                providerTypeFacets = {[]}
                providerSubTypeFacets = {providerSubTypes}
                resultStatusFacets = {[]}
                localAuthorityFacets = {[]}
                clearFilters = {jest.fn()}
            />
        </MemoryRouter>
      );    
      // first, click to show filter options
      const providerTypeSection = screen.getByTestId("provider-sub-type-filters");
      const showProviderTypeLabel = within(providerTypeSection).getByText(/Provider sub type/);
      userEvent.click(showProviderTypeLabel);

      // select option
      const secondFilter = screen.getByRole("checkbox", { name: /Magic Potions/ });
      expect(secondFilter).toBeInTheDocument();
      expect(secondFilter).not.toBeChecked();
      userEvent.click(secondFilter);

      expect(mockAddProviderSubTypeFilter).toHaveBeenCalledWith("Magic Potions");
    });
  });

  describe("when a Local Authority filter option is selected", () => {
    it("sends updated filters to parent", () => {
      const mockLocalauthorityFilter = jest.fn();
      const localAuthorities: FacetValue[] = [{ name: "Sorcery", count: 111 }, { name: "Magic Potions", count: 222 }];

      render(
        <MemoryRouter>
            <ViewCalculationResultsSearchFilters
                searchCriteria={{...searchCriteria, providerType:["Sorcery"]}}
                initialSearch={searchCriteria}
                filterBySearchTerm={jest.fn()}
                addProviderTypeFilter = {jest.fn()}
                removeProviderTypeFilter = {jest.fn()}
                addProviderSubTypeFilter = {jest.fn()}
                removeProviderSubTypeFilter = {jest.fn()}
                addResultStatusFilter = {jest.fn()}
                removeResultStatusFilter = {jest.fn()}
                addLocalAuthorityFilter = {mockLocalauthorityFilter}
                removeLocalAuthorityFilter = {jest.fn()}
                filterByProviderType = {jest.fn()}
                filterByProviderSubType = {jest.fn()}
                filterByResultStatus = {jest.fn()}
                filterByLocalauthority = {jest.fn()}
                providerTypeFacets = {[]}
                providerSubTypeFacets = {[]}
                resultStatusFacets = {[]}
                localAuthorityFacets = {localAuthorities}
                clearFilters = {jest.fn()}
            />
        </MemoryRouter>
      );    
      // first, click to show filter options
      const providerTypeSection = screen.getByTestId("local-authority-filters");
      const showProviderTypeLabel = within(providerTypeSection).getByText(/Local authority/);
      userEvent.click(showProviderTypeLabel);

      // select option
      const secondFilter = screen.getByRole("checkbox", { name: /Magic Potions/ });
      expect(secondFilter).toBeInTheDocument();
      expect(secondFilter).not.toBeChecked();
      userEvent.click(secondFilter);

      expect(mockLocalauthorityFilter).toHaveBeenCalledWith("Magic Potions");
    });
  });

  describe("when a Result Status filter option is selected", () => {
    it("sends updated filters to parent", () => {
      const mockResultStatusFilter = jest.fn();
      const resultStatus: FacetValue[] = [{ name: "With exceptions", count: 111 }, { name: "Without exceptions", count: 222 }];

      render(
        <MemoryRouter>
            <ViewCalculationResultsSearchFilters
                searchCriteria={{...searchCriteria, providerType:["With exceptions"]}}
                initialSearch={searchCriteria}
                filterBySearchTerm={jest.fn()}
                addProviderTypeFilter = {jest.fn()}
                removeProviderTypeFilter = {jest.fn()}
                addProviderSubTypeFilter = {jest.fn()}
                removeProviderSubTypeFilter = {jest.fn()}
                addResultStatusFilter = {mockResultStatusFilter}
                removeResultStatusFilter = {jest.fn()}
                addLocalAuthorityFilter = {jest.fn()}
                removeLocalAuthorityFilter = {jest.fn()}
                filterByProviderType = {jest.fn()}
                filterByProviderSubType = {jest.fn()}
                filterByResultStatus = {jest.fn()}
                filterByLocalauthority = {jest.fn()}
                providerTypeFacets = {[]}
                providerSubTypeFacets = {[]}
                resultStatusFacets = {resultStatus}
                localAuthorityFacets = {[]}
                clearFilters = {jest.fn()}
            />
        </MemoryRouter>
      );    
      // first, click to show filter options
      const providerTypeSection = screen.getByTestId("result-status-filters");
      const showProviderTypeLabel = within(providerTypeSection).getByText(/Result status/);
      userEvent.click(showProviderTypeLabel);

      // select option
      const secondFilter = screen.getByRole("checkbox", { name: /With exceptions/ });
      expect(secondFilter).toBeInTheDocument();
      expect(secondFilter).not.toBeChecked();
      userEvent.click(secondFilter);

      expect(mockResultStatusFilter).toHaveBeenCalledWith("With exceptions");
    });
  });

const searchCriteria: CalculationProviderSearchRequest = {
    calculationValueType: undefined,
    errorToggle: "",
    facetCount: 0,
    includeFacets: true,
    localAuthority: [],
    pageNumber: 1,
    pageSize: 50,
    providerSubType: [],
    providerType: [],
    resultsStatus: [],
    searchMode: SearchMode.All,
    searchTerm: "",
    calculationId: "",
    searchFields: [],
  };
});