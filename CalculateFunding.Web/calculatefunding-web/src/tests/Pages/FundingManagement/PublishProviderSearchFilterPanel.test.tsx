import { render, within, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router";
import { SearchMode } from "types/SearchMode";

import { ProviderResultsSearchFilterPanel } from "../../../components/Funding/ProviderFundingSearch/PublishedProviderSearchFilterPanel";
import { FacetValue } from "../../../types/Facet";

import { FundingActionType } from "types/PublishedProvider/PublishedProviderFundingCount";
import { PublishedProviderSearchRequest } from "types/publishedProviderSearchRequest";

describe("<ProviderResultsSearchFilters />", () => {
    
  describe("when initially loading with defaults", () => {
    it("renders default view", () => {    
      render(
        <MemoryRouter>          
        <ProviderResultsSearchFilterPanel
          searchCriteria={searchCriteria}
          initialSearch={searchCriteria}
          filterBySearchTerm={jest.fn()}
          addProviderTypeFilter = {jest.fn()}
          removeProviderTypeFilter = {jest.fn()}
          addProviderSubTypeFilter = {jest.fn()}
          removeProviderSubTypeFilter = {jest.fn()}
          addLocalAuthorityFilter = {jest.fn()}
          removeLocalAuthorityFilter = {jest.fn()}
          filterByProviderType = {jest.fn()}
          filterByProviderSubType = {jest.fn()}
          filterByLocalAuthority = {jest.fn()}
          providerTypeFacets = {[]}
          providerSubTypeFacets = {[]}
          localAuthorityFacets = {[]}
          clearFilters = {jest.fn()}        
          addStatusFilter = {jest.fn()} 
          removeStatusFilter = {jest.fn()} 
          addOpenDateFilter = {jest.fn()} 
          removeOpenDateFilter = {jest.fn()} 
          addAllocationTypeFilter = {jest.fn()} 
          removeAllocationTypeFilter = {jest.fn()} 
          filterByOpenDate = {jest.fn()} 
          filterByErrorStatus = {jest.fn()}
          addErrorStateFilter = {jest.fn()}
          removeErrorStateFilter = {jest.fn()} 
          statusFacets = {[]} 
          openDateFacets = {[]} 
          allocationTypeFacets = {[]} 
          errorStatusFacets = {[]}         
          selectedErrorState = {[]}
          selectedAllocationType = {[]}
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
      expect(screen.queryByText(/Hide/)).not.toBeInTheDocument();
    });
  }); 


  describe("when 'show all sections' is clicked on", () => {
    it("expands all sections to reveal filter options", () => {
      render(
        <MemoryRouter>
          <ProviderResultsSearchFilterPanel
          searchCriteria={searchCriteria}
          initialSearch={searchCriteria}
          filterBySearchTerm={jest.fn()}
          addProviderTypeFilter = {jest.fn()}
          removeProviderTypeFilter = {jest.fn()}
          addProviderSubTypeFilter = {jest.fn()}
          removeProviderSubTypeFilter = {jest.fn()}
          addLocalAuthorityFilter = {jest.fn()}
          removeLocalAuthorityFilter = {jest.fn()}
          filterByProviderType = {jest.fn()}
          filterByProviderSubType = {jest.fn()}
          filterByLocalAuthority = {jest.fn()}
          providerTypeFacets = {[]}
          providerSubTypeFacets = {[]}
          localAuthorityFacets = {[]}
          clearFilters = {jest.fn()}        
          addStatusFilter = {jest.fn()} 
          removeStatusFilter = {jest.fn()} 
          addOpenDateFilter = {jest.fn()} 
          removeOpenDateFilter = {jest.fn()} 
          addAllocationTypeFilter = {jest.fn()} 
          removeAllocationTypeFilter = {jest.fn()} 
          filterByOpenDate = {jest.fn()} 
          filterByErrorStatus = {jest.fn()}
          addErrorStateFilter = {jest.fn()}
          removeErrorStateFilter = {jest.fn()} 
          statusFacets = {[]} 
          openDateFacets = {[]} 
          allocationTypeFacets = {[]} 
          errorStatusFacets = {[]}         
          selectedErrorState = {[]}
          selectedAllocationType = {[]}
          />
        </MemoryRouter>
      );

      const showHideAll = screen.getByText(/Show all sections/ );
      expect(showHideAll).toBeInTheDocument();
      expect(screen.queryByText(/Hide/)).not.toBeInTheDocument();
      expect(screen.getAllByText(/Show/)).toHaveLength(8);

      userEvent.click(showHideAll);

      expect(screen.getByText(/Hide all sections/)).toBeVisible();
      expect(screen.queryByText(/Show/)).not.toBeInTheDocument();
      expect(screen.getAllByText(/Hide/)).toHaveLength(8);
    });
  });


  describe("when a local authority filter section 'show this section' is clicked on", () => {
    it("expands section to reveal filter options", () => { 
      const localAuthorities: FacetValue[] = [{ name: "Sorcery", count: 111 }, { name: "Magic Potions", count: 222 }];  
      render(
        <MemoryRouter>
        <ProviderResultsSearchFilterPanel
          searchCriteria={searchCriteria}
          initialSearch={searchCriteria}
          filterBySearchTerm={jest.fn()}
          addProviderTypeFilter = {jest.fn()}
          removeProviderTypeFilter = {jest.fn()}
          addProviderSubTypeFilter = {jest.fn()}
          removeProviderSubTypeFilter = {jest.fn()}
          addLocalAuthorityFilter = {jest.fn()}
          removeLocalAuthorityFilter = {jest.fn()}
          filterByProviderType = {jest.fn()}
          filterByProviderSubType = {jest.fn()}
          filterByLocalAuthority = {jest.fn()}
          providerTypeFacets = {[]}
          providerSubTypeFacets = {[]}
          localAuthorityFacets = {localAuthorities}
          clearFilters = {jest.fn()}        
          addStatusFilter = {jest.fn()} 
          removeStatusFilter = {jest.fn()} 
          addOpenDateFilter = {jest.fn()} 
          removeOpenDateFilter = {jest.fn()} 
          addAllocationTypeFilter = {jest.fn()} 
          removeAllocationTypeFilter = {jest.fn()} 
          filterByOpenDate = {jest.fn()} 
          filterByErrorStatus = {jest.fn()}
          addErrorStateFilter = {jest.fn()}
          removeErrorStateFilter = {jest.fn()} 
          statusFacets = {[]} 
          openDateFacets = {[]} 
          allocationTypeFacets = {[]} 
          errorStatusFacets = {[]}         
          selectedErrorState = {[]}
          selectedAllocationType = {[]}
          />
        </MemoryRouter>
      );

      const localAuthoritySection = screen.getByTestId("local-authority-filters");
      const showLocalAuthorityLabel = within(localAuthoritySection).getByText(/Local authority/);
      expect(showLocalAuthorityLabel).toBeInTheDocument();
      expect(screen.queryByText(/Hide/)).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Selected filters/ })).toBeInTheDocument();

      userEvent.click(showLocalAuthorityLabel);

      expect(screen.getByText(/Hide/)).toBeVisible();
      expect(screen.getByRole("checkbox", { name: /Sorcery/ })).not.toBeChecked();
      expect(screen.getByRole("checkbox", { name: /Magic Potions/ })).not.toBeChecked();
      expect(screen.queryByText(/No filters selected/)).toBeInTheDocument();
    });
  });
  describe("when a provider sub type filter section 'show this section' is clicked on", () => {
    it("expands section to reveal filter options", () => {
      const providerSubTypes: FacetValue[] = [{ name: "Sorcery", count: 111 }, { name: "Magic Potions", count: 222 }];
      render(
        <MemoryRouter>
          <ProviderResultsSearchFilterPanel
          searchCriteria={searchCriteria}
          initialSearch={searchCriteria}
          filterBySearchTerm={jest.fn()}
          addProviderTypeFilter = {jest.fn()}
          removeProviderTypeFilter = {jest.fn()}
          addProviderSubTypeFilter = {jest.fn()}
          removeProviderSubTypeFilter = {jest.fn()}
          addLocalAuthorityFilter = {jest.fn()}
          removeLocalAuthorityFilter = {jest.fn()}
          filterByProviderType = {jest.fn()}
          filterByProviderSubType = {jest.fn()}
          filterByLocalAuthority = {jest.fn()}
          providerTypeFacets = {[]}
          providerSubTypeFacets = {providerSubTypes}
          localAuthorityFacets = {[]}
          clearFilters = {jest.fn()}        
          addStatusFilter = {jest.fn()} 
          removeStatusFilter = {jest.fn()} 
          addOpenDateFilter = {jest.fn()} 
          removeOpenDateFilter = {jest.fn()} 
          addAllocationTypeFilter = {jest.fn()} 
          removeAllocationTypeFilter = {jest.fn()} 
          filterByOpenDate = {jest.fn()} 
          filterByErrorStatus = {jest.fn()}
          addErrorStateFilter = {jest.fn()}
          removeErrorStateFilter = {jest.fn()} 
          statusFacets = {[]} 
          openDateFacets = {[]} 
          allocationTypeFacets = {[]} 
          errorStatusFacets = {[]}         
          selectedErrorState = {[]}
          selectedAllocationType = {[]}
          />
        </MemoryRouter>
      );

      const providerSubTypeSection = screen.getByTestId("provider-sub-type-filters");
      const showProviderSubTypeLabel = within(providerSubTypeSection).getByText(/Provider sub type/);
      expect(showProviderSubTypeLabel).toBeInTheDocument();
      expect(screen.queryByText(/Hide/)).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Selected filters/ })).toBeInTheDocument();

      userEvent.click(showProviderSubTypeLabel);

      expect(screen.getByText(/Hide/)).toBeVisible();
      expect(screen.getByRole("checkbox", { name: /Sorcery/ })).not.toBeChecked();
      expect(screen.getByRole("checkbox", { name: /Magic Potions/ })).not.toBeChecked();
      expect(screen.queryByText(/No filters selected/)).toBeInTheDocument();
    });
  });
  describe("when a provider type filter section 'show this section' is clicked on", () => {
    it("expands section to reveal filter options", () => {
      const providerTypes: FacetValue[] = [{ name: "Sorcery", count: 111 }, { name: "Magic Potions", count: 222 }];
      render(
        <MemoryRouter>
          <ProviderResultsSearchFilterPanel
          searchCriteria={searchCriteria}
          initialSearch={searchCriteria}
          filterBySearchTerm={jest.fn()}
          addProviderTypeFilter = {jest.fn()}
          removeProviderTypeFilter = {jest.fn()}
          addProviderSubTypeFilter = {jest.fn()}
          removeProviderSubTypeFilter = {jest.fn()}
          addLocalAuthorityFilter = {jest.fn()}
          removeLocalAuthorityFilter = {jest.fn()}
          filterByProviderType = {jest.fn()}
          filterByProviderSubType = {jest.fn()}
          filterByLocalAuthority = {jest.fn()}
          providerTypeFacets = {providerTypes}
          providerSubTypeFacets = {[]}
          localAuthorityFacets = {[]}
          clearFilters = {jest.fn()}        
          addStatusFilter = {jest.fn()} 
          removeStatusFilter = {jest.fn()} 
          addOpenDateFilter = {jest.fn()} 
          removeOpenDateFilter = {jest.fn()} 
          addAllocationTypeFilter = {jest.fn()} 
          removeAllocationTypeFilter = {jest.fn()} 
          filterByOpenDate = {jest.fn()} 
          filterByErrorStatus = {jest.fn()}
          addErrorStateFilter = {jest.fn()}
          removeErrorStateFilter = {jest.fn()} 
          statusFacets = {[]} 
          openDateFacets = {[]} 
          allocationTypeFacets = {[]} 
          errorStatusFacets = {[]}         
          selectedErrorState = {[]}
          selectedAllocationType = {[]}
          />
        </MemoryRouter>
      );

      const providerTypeSection = screen.getByTestId("provider-type-filters");
      const showProviderTypeLabel = within(providerTypeSection).getByText(/Provider type/);
      expect(showProviderTypeLabel).toBeInTheDocument();
      expect(screen.queryByText(/Hide/)).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Selected filters/ })).toBeInTheDocument();
      const providerTypeSummary = screen.getByRole("heading", { name: /Provider type/, level: 2 });
      expect(providerTypeSummary).toBeInTheDocument();
 
      userEvent.click(showProviderTypeLabel);

      expect(screen.getByText(/Hide/)).toBeVisible();
      expect(screen.getByRole("checkbox", { name: /Sorcery/ })).not.toBeChecked();
      expect(screen.getByRole("checkbox", { name: /Magic Potions/ })).not.toBeChecked();
      expect(screen.queryByText(/No filters selected/)).toBeInTheDocument();
    });
  });


  describe("when a provider type filter option is selected", () => {
    it("sends updated filters to parent", () => {
      const mockAddProviderTypeFilter = jest.fn();
      const providerTypes: FacetValue[] = [{ name: "Sorcery", count: 111 }, { name: "Magic Potions", count: 222 }];
      render(
        <MemoryRouter>
          <ProviderResultsSearchFilterPanel
          searchCriteria={searchCriteria}
          initialSearch={searchCriteria}
          filterBySearchTerm={jest.fn()}
          addProviderTypeFilter = {mockAddProviderTypeFilter}
          removeProviderTypeFilter = {jest.fn()}
          addProviderSubTypeFilter = {jest.fn()}
          removeProviderSubTypeFilter = {jest.fn()}
          addLocalAuthorityFilter = {jest.fn()}
          removeLocalAuthorityFilter = {jest.fn()}
          filterByProviderType = {jest.fn()}
          filterByProviderSubType = {jest.fn()}
          filterByLocalAuthority = {jest.fn()}
          providerTypeFacets = {providerTypes}
          providerSubTypeFacets = {[]}
          localAuthorityFacets = {[]}
          clearFilters = {jest.fn()}        
          addStatusFilter = {jest.fn()} 
          removeStatusFilter = {jest.fn()} 
          addOpenDateFilter = {jest.fn()} 
          removeOpenDateFilter = {jest.fn()} 
          addAllocationTypeFilter = {jest.fn()} 
          removeAllocationTypeFilter = {jest.fn()} 
          filterByOpenDate = {jest.fn()} 
          filterByErrorStatus = {jest.fn()}
          addErrorStateFilter = {jest.fn()}
          removeErrorStateFilter = {jest.fn()} 
          statusFacets = {[]} 
          openDateFacets = {[]} 
          allocationTypeFacets = {[]} 
          errorStatusFacets = {[]}         
          selectedErrorState = {[]}
          selectedAllocationType = {[]}
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
          <ProviderResultsSearchFilterPanel
          searchCriteria={searchCriteria}
          initialSearch={searchCriteria}
          filterBySearchTerm={jest.fn()}
          addProviderTypeFilter = {jest.fn()}
          removeProviderTypeFilter = {jest.fn()}
          addProviderSubTypeFilter = {mockAddProviderSubTypeFilter}
          removeProviderSubTypeFilter = {jest.fn()}
          addLocalAuthorityFilter = {jest.fn()}
          removeLocalAuthorityFilter = {jest.fn()}
          filterByProviderType = {jest.fn()}
          filterByProviderSubType = {jest.fn()}
          filterByLocalAuthority = {jest.fn()}
          providerTypeFacets = {[]}
          providerSubTypeFacets = {providerSubTypes}
          localAuthorityFacets = {[]}
          clearFilters = {jest.fn()}        
          addStatusFilter = {jest.fn()} 
          removeStatusFilter = {jest.fn()} 
          addOpenDateFilter = {jest.fn()} 
          removeOpenDateFilter = {jest.fn()} 
          addAllocationTypeFilter = {jest.fn()} 
          removeAllocationTypeFilter = {jest.fn()} 
          filterByOpenDate = {jest.fn()} 
          filterByErrorStatus = {jest.fn()}
          addErrorStateFilter = {jest.fn()}
          removeErrorStateFilter = {jest.fn()} 
          statusFacets = {[]} 
          openDateFacets = {[]} 
          allocationTypeFacets = {[]} 
          errorStatusFacets = {[]}         
          selectedErrorState = {[]}
          selectedAllocationType = {[]}
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
          <ProviderResultsSearchFilterPanel
          searchCriteria={searchCriteria}
          initialSearch={searchCriteria}
          filterBySearchTerm={jest.fn()}
          addProviderTypeFilter = {jest.fn()}
          removeProviderTypeFilter = {jest.fn()}
          addProviderSubTypeFilter = {jest.fn()}
          removeProviderSubTypeFilter = {jest.fn()}
          addLocalAuthorityFilter = {mockLocalauthorityFilter}
          removeLocalAuthorityFilter = {jest.fn()}
          filterByProviderType = {jest.fn()}
          filterByProviderSubType = {jest.fn()}
          filterByLocalAuthority = {jest.fn()}
          providerTypeFacets = {[]}
          providerSubTypeFacets = {[]}
          localAuthorityFacets = {localAuthorities}
          clearFilters = {jest.fn()}        
          addStatusFilter = {jest.fn()} 
          removeStatusFilter = {jest.fn()} 
          addOpenDateFilter = {jest.fn()} 
          removeOpenDateFilter = {jest.fn()} 
          addAllocationTypeFilter = {jest.fn()} 
          removeAllocationTypeFilter = {jest.fn()} 
          filterByOpenDate = {jest.fn()} 
          filterByErrorStatus = {jest.fn()}
          addErrorStateFilter = {jest.fn()}
          removeErrorStateFilter = {jest.fn()} 
          statusFacets = {[]} 
          openDateFacets = {[]} 
          allocationTypeFacets = {[]} 
          errorStatusFacets = {[]}         
          selectedErrorState = {[]}
          selectedAllocationType = {[]}
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
         <ProviderResultsSearchFilterPanel
          searchCriteria={searchCriteria}
          initialSearch={searchCriteria}
          filterBySearchTerm={jest.fn()}
          addProviderTypeFilter = {jest.fn()}
          removeProviderTypeFilter = {jest.fn()}
          addProviderSubTypeFilter = {jest.fn()}
          removeProviderSubTypeFilter = {jest.fn()}
          addLocalAuthorityFilter = {jest.fn()}
          removeLocalAuthorityFilter = {jest.fn()}
          filterByProviderType = {jest.fn()}
          filterByProviderSubType = {jest.fn()}
          filterByLocalAuthority = {jest.fn()}
          providerTypeFacets = {[]}
          providerSubTypeFacets = {[]}
          localAuthorityFacets = {[]}
          clearFilters = {jest.fn()}        
          addStatusFilter = {mockResultStatusFilter} 
          removeStatusFilter = {jest.fn()} 
          addOpenDateFilter = {jest.fn()} 
          removeOpenDateFilter = {jest.fn()} 
          addAllocationTypeFilter = {jest.fn()} 
          removeAllocationTypeFilter = {jest.fn()} 
          filterByOpenDate = {jest.fn()} 
          filterByErrorStatus = {jest.fn()}
          addErrorStateFilter = {jest.fn()}
          removeErrorStateFilter = {jest.fn()} 
          statusFacets = {resultStatus} 
          openDateFacets = {[]} 
          allocationTypeFacets = {[]} 
          errorStatusFacets = {[]}         
          selectedErrorState = {[]}
          selectedAllocationType = {[]}
          />
        </MemoryRouter>
      ); 

      // first, click to show filter options
      const providerTypeSection = screen.getByTestId("status-filters");
      const showProviderTypeLabel = within(providerTypeSection).getByText(/Status/);
      userEvent.click(showProviderTypeLabel);

      // select option
      const secondFilter = screen.getByRole("checkbox", { name: /With exceptions/ });
      expect(secondFilter).toBeInTheDocument();
      expect(secondFilter).not.toBeChecked();
      userEvent.click(secondFilter);

      expect(mockResultStatusFilter).toHaveBeenCalledWith("With exceptions");
    });
  });

  const searchCriteria: PublishedProviderSearchRequest = {
    pageNumber: 1,
    searchTerm: "",
    hasErrors: false,
    includeFacets: true,
    facetCount: 100,
    searchMode: SearchMode.All,
    searchFields: [],
    errorToggle: "",
    fundingStreamId: "",
    fundingPeriodId: "",
    specificationId: "",
    localAuthority: [],
    monthYearOpened: [],
    status: [],
    providerType: [],
    providerSubType: [],
    pageSize: 0,
    indicative: [],
    fundingAction: FundingActionType.Approve
  };
});

