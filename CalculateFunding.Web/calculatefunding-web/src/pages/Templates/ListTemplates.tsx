import React, { MouseEvent, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { BackToTop } from "../../components/BackToTop";
import { Breadcrumb, Breadcrumbs } from "../../components/Breadcrumbs";
import { DateTimeFormatter } from "../../components/DateTimeFormatter";
import { LoadingStatus } from "../../components/LoadingStatus";
import { Main } from "../../components/Main";
import { MultipleErrorSummary } from "../../components/MultipleErrorSummary";
import { PermissionStatus } from "../../components/PermissionStatus";
import {
  SearchSidebar,
  SearchFilterContainer,
  SearchFilterSection,
  SearchFiltersOuterContainer,
  SearchFilterSelectionPanel,
  SearchSidebarProps,
  SearchSidebarWithTextSearchProps,
} from "../../components/SearchFilterContainer";
import { useToggle } from "../../hooks/useToggle";
import { TableNavBottom } from "../../components/TableNavBottom";
import { TextLink } from "../../components/TextLink";
import { Title } from "../../components/Title";
import { useTemplatePermissions } from "../../hooks/TemplateBuilder/useTemplatePermissions";
import { useTemplateSearch } from "../../hooks/TemplateBuilder/useTemplateSearch";
import { useErrors } from "../../hooks/useErrors";
import { Section } from "../../types/Sections";
import { TemplatePermissions, TemplateStatus } from "../../types/TemplateBuilderDefinitions";
import { TemplateSearchRequest } from "../../types/templateSearchRequest";
import { BackLink } from "components/BackLink";
import { FacetValue } from "types/Facet";
import { Pagination } from "components/Pagination";
import { TableResultsSummary } from "components/TableResultsSummary";
const SafeLink = Link as any;

export const ListTemplates = () => {
  const [searchCriteria, setSearchCriteria] = useState<TemplateSearchRequest>({
    pageNumber: 1,
    searchTerm: "",
    top: 10,
    includeFacets: true,
    countOnly: false,
    currentPage: 1,
    fundingStreams: [],
    fundingPeriods: [],
    statuses: [],
  });
  const { errors, addError } = useErrors();
  const { canCreateTemplate, missingPermissions } = useTemplatePermissions([TemplatePermissions.Create]);
  const isReadOnly = !canCreateTemplate;
  const { templateSearchResponse, isLoadingTemplateSearchResults } = useTemplateSearch(searchCriteria, {
    onError: (err) => addError({ error: err, description: "Error while getting templates" }),
  });
  const history = useHistory();
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [fundingStreamFacets, setFundingStreamFacets] = useState<FacetValue[]>([]);
  const [fundingPeriodFacets, setFundingPeriodFacets] = useState<FacetValue[]>([]);
  const [statusFacets, setStatusFacets] = useState<FacetValue[]>([]);
  const {
    isExpanded: isTemplateExpanded,
    toggleExpanded: toggleTemplateExpanded,
    setExpanded: setTemplateExpanded,
  } = useToggle();

  const expandAllFilters = () => {
    setTemplateExpanded(true);
  };

  const collapseAllFilters = () => {
    setTemplateExpanded(false);
  };

  const {
    isExpanded: isFundingStreamExpanded,
    toggleExpanded: toggleFundingStreamExpanded,
    setExpanded: setFundingStreamExpanded,
  } = useToggle();

  const {
    isExpanded: isFundingPeriodExpanded,
    toggleExpanded: toggleFundingPeriodExpanded,
    setExpanded: setFundingPeriodExpanded,
  } = useToggle();

  const {
    isExpanded: isStatusExpanded,
    toggleExpanded: toggleStatusExpanded,
    setExpanded: setStatusExpanded,
  } = useToggle();

  const handleTemplateLinkClick = (e: MouseEvent, templateId: string) => {
    e.preventDefault();
    if (e.shiftKey) {
      history.push(`/Templates/${templateId}/Edit?disableUndo=true`);
    } else {
      history.push(`/Templates/${templateId}/Edit`);
    }
  };
  console.log("FULL RESPONSE:", templateSearchResponse);

  const addFundingStreamFilter = (value: string) => {
    setSearchCriteria((prev) => ({
      ...prev,
      fundingStreams: [...prev.fundingStreams.filter((x: string) => x !== value), value],
      pageNumber: 1,
    }));
  };

  const removeFundingStreamFilter = (value: string) => {
    setSearchCriteria((prev) => ({
      ...prev,
      fundingStreams: prev.fundingStreams.filter((x: string) => x !== value),
      pageNumber: 1,
    }));
  };

  const addFundingPeriodFilter = (value: string) => {
    setSearchCriteria((prev) => ({
      ...prev,
      fundingPeriods: [...prev.fundingPeriods.filter((x: string) => x !== value), value],
      pageNumber: 1,
    }));
  };

  const removeFundingPeriodFilter = (value: string) => {
    setSearchCriteria((prev) => ({
      ...prev,
      fundingPeriods: prev.fundingPeriods.filter((x: string) => x !== value),
      pageNumber: 1,
    }));
  };

  const addStatusFilter = (value: string) => {
    setSearchCriteria((prev) => ({
      ...prev,
      statuses: [...prev.statuses.filter((x: string) => x !== value), value],
      pageNumber: 1,
    }));
  };

  const removeStatusFilter = (value: string) => {
    setSearchCriteria((prev) => ({
      ...prev,
      statuses: prev.statuses.filter((x: string) => x !== value),
      pageNumber: 1,
    }));
  };

  function filterBySearchTerm(searchTerm: string) {
    setSearchCriteria((prevState) => {
      return {
        ...prevState,
        searchTerm: searchTerm,
        pageNumber: 1,
      };
    });
  }

  const filterByFundingStreams = (searchTerm: string) => {
    setFundingStreamFacets((prev) =>
      prev.filter((x) => x.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filterByFundingPeriods = (searchTerm: string) => {
    setFundingPeriodFacets((prev) =>
      prev.filter((x) => x.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const setPagination = (pageNumber: number) => {
    setSearchCriteria((prevState) => {
      return { ...prevState, pageNumber: pageNumber };
    });
  };

  useEffect(() => {
    if (!templateSearchResponse?.facets) return;
    const facets = templateSearchResponse.facets;

    const fundingStreamFacet = facets.find((f) => f.name === "fundingStreamName");

    const fundingPeriodFacet = facets.find((f) => f.name === "fundingPeriodName");

    const statusFacet = facets.find((f) => f.name === "status");

    setFundingStreamFacets(fundingStreamFacet?.facetValues ?? []);
    setFundingPeriodFacets(fundingPeriodFacet?.facetValues ?? []);
    setStatusFacets(statusFacet?.facetValues ?? []);
  }, [templateSearchResponse]);

  useEffect(() => {
    if (!templateSearchResponse?.results) return;

    const statusCounts = templateSearchResponse.results.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusFacetValues = Object.entries(statusCounts).map(([name, count]) => ({
      name,
      count,
    }));

    setStatusFacets(statusFacetValues);
  }, [templateSearchResponse]);

  const isTextSearchEnabled = (arg: any): arg is SearchSidebarWithTextSearchProps => {
  return !!(arg as SearchSidebarWithTextSearchProps)?.updateSearchText;
};

  return (
    <Main location={Section.Templates}>
      <div className="govuk-width-container">
        <BackLink />
        <PermissionStatus requiredPermissions={missingPermissions} hidden={isLoadingTemplateSearchResults} />
        <MultipleErrorSummary errors={errors} />
        {isReadOnly && (
          <div className="govuk-notification-banner govuk-notification-banner--blue govuk-!-margin-bottom-6">
            <div className="govuk-notification-banner__content">
              <h2 className="govuk-notification-banner__heading">
                You have read-only access to this page.
              </h2>

              <p className="govuk-body">
                <SafeLink to="/Permissions" className="govuk-link">
                  View your permission
                </SafeLink>
              </p>
            </div>
          </div>
        )}
        <h1 className="govuk-heading-l govuk-!-margin-bottom-4 govuk-!-margin-top-7">
          {isReadOnly ? "Templates" : "Manage templates"}
        </h1>
        <h2 id="title-caption" className="govuk-caption-m govuk-!-margin-top-3">
          {isReadOnly
            ? "View existing funding templates."
            : "Create a funding template, view existing templates and edit funding lines."}
        </h2>
        {canCreateTemplate && (
          <div className="govuk-grid-row govuk-!-margin-bottom-6">
            <div className="govuk-grid-column-one-third">
              <SafeLink
                to="/Templates/Create"
                id="create-template-link"
                data-testid="create-template-link"
                className="govuk-button govuk-button--primary"
                data-module="govuk-button"
              >
                Create a template
              </SafeLink>
            </div>
          </div>
        )}

        <div className="govuk-form-group">
          <label className="govuk-label govuk-heading-s" htmlFor="template-search">
            Find a template to view or edit
          </label>

          <div className="govuk-button-group">
            <input
              id="template-search"
              className="govuk-input govuk-!-width-one-half"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <button
              type="button"
              className="govuk-button govuk-button--Blue govuk-!-margin-right-3 govuk-!-margin-left-1"
              onClick={() => filterBySearchTerm(searchInput)}
            >
              Search
            </button>

            <button
              type="button"
              className="govuk-button govuk-button--secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide filters" : "Show filters"}
            </button>
          </div>
        </div>
        <div className="govuk-grid-row">
          {showFilters && (
            <div className="govuk-grid-column-one-third">
              <SearchSidebar formId={"searchTemplates"}>
                <div className="govuk-!-padding-2  filter-title-background">
                  <h2 className="govuk-heading-m govuk-!-margin-0 ">
                    Filters
                  </h2>
                </div>
                <SearchFilterSelectionPanel
                  title="Selected filters"
                  handleClearSearch={() => {
                    setSearchInput("");

                    setSearchCriteria({
                      pageNumber: 1,
                      searchTerm: "",
                      top: 10,
                      includeFacets: true,
                      countOnly: false,
                      currentPage: 1,
                      fundingStreams: [],
                      fundingPeriods: [],
                      statuses: [],
                    });
                  }}
                  selectedFundingStreamFilters={searchCriteria.fundingStreams}
                  selectedFundingPeriodFilters={searchCriteria.fundingPeriods}
                  selectedStatusFilters={searchCriteria.statuses}
                  handleRemoveFundingStreamFilter={removeFundingStreamFilter}
                  handleRemoveFundingPeriodFilter={removeFundingPeriodFilter}
                  handleRemoveStatusFilter={removeStatusFilter}
                />

                <SearchFiltersOuterContainer
                  expandAllFilters={expandAllFilters}
                  collapseAllFilters={collapseAllFilters}
                  allExpanded={isTemplateExpanded}
                  allCollapsed={!isTemplateExpanded}
                >
                  <SearchFilterContainer>
                    <SearchFilterSection
                      title="Funding streams"
                      facets={fundingStreamFacets}
                      isExpanded={isFundingStreamExpanded}
                      toggleExpanded={toggleFundingStreamExpanded}
                      addFilter={addFundingStreamFilter}
                      removeFilter={removeFundingStreamFilter}
                      searchForFilter={filterByFundingStreams}
                      selectedFilters={searchCriteria.fundingStreams}
                    />
                    <SearchFilterSection
                      title="Funding periods"
                      facets={fundingPeriodFacets}
                      isExpanded={isFundingPeriodExpanded}
                      toggleExpanded={toggleFundingPeriodExpanded}
                      addFilter={addFundingPeriodFilter}
                      removeFilter={removeFundingPeriodFilter}
                      searchForFilter={filterByFundingPeriods}
                      selectedFilters={searchCriteria.fundingPeriods}
                    />
                    <SearchFilterSection
                      facets={statusFacets}
                      isExpanded={isStatusExpanded}
                      toggleExpanded={toggleStatusExpanded}
                      addFilter={addStatusFilter}
                      removeFilter={removeStatusFilter}
                      selectedFilters={searchCriteria.statuses}
                      title={"Status"}
                    />
                  </SearchFilterContainer>
                </SearchFiltersOuterContainer>
              </SearchSidebar>
            </div>
          )}

          <div className={showFilters ? "govuk-grid-column-two-thirds" : "govuk-grid-column-full"}>
            {isLoadingTemplateSearchResults && (
              <LoadingStatus
                title="Loading templates list"
                description="Please wait whilst the templates list is loading"
              />
            )}
            {!!templateSearchResponse?.results?.length && (
              <>
                <h3 className="govuk-heading-m">Template list</h3>
                <table className="govuk-table" id="templates-table" data-testid={"template-results"}>
                  <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                      <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                        Name
                      </th>

                      <th scope="col" className="govuk-table__header govuk-!-width-one-eigth">
                        Last updated on
                      </th>

                      <th scope="col" className="govuk-table__header govuk-!-width-one-eigth">
                        Last updated by
                      </th>

                      <th scope="col" className="govuk-table__header govuk-!-width-one-eigth">
                        Version
                      </th>

                      <th scope="col" className="govuk-table__header govuk-!-width-one-eigth">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="govuk-table__body" id="mainContentResults">
                    {templateSearchResponse?.results?.map((template) => (
                      <tr
                        className="govuk-table__row govuk-!-padding-top-3"
                        key={template.id}
                        data-testid={`template-result-${template.id}`}
                      >
                        <th scope="row" className="govuk-table__header">
                          <div className="govuk-!-font-weight-bold">
                            <TextLink
                              handleOnClick={(e) =>
                                handleTemplateLinkClick(e as MouseEvent, `${template.id}`)
                              }
                            >
                              {template.name}
                            </TextLink>
                          </div>
                        </th>
                        <td className="govuk-table__cell">
                          <DateTimeFormatter date={template.lastUpdatedDate} />
                        </td>
                        <td className="govuk-table__cell">{template.lastUpdatedAuthorName}</td>

                        <td className="govuk-table__cell">{template.currentMajorVersion}.{template.currentMinorVersion}</td>

                        <td className="govuk-table__cell">
                          {template.status === TemplateStatus.Draft && (
                            <strong className="govuk-tag-text-original govuk-tag govuk-tag--grey">
                              Draft
                            </strong>
                          )}

                          {template.status === TemplateStatus.Published && (
                            <strong className="govuk-tag-text-original govuk-tag govuk-tag--green">Published</strong>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {templateSearchResponse?.results?.length === 0 && (
              <p className="govuk-body">Showing 0 results</p>
            )}
            {!!templateSearchResponse?.results?.length && (
              <>
                <Pagination currentPage={templateSearchResponse?.pagerState?.currentPage ?? 1} lastPage={templateSearchResponse?.pagerState?.lastPage ?? 1} callback={setPagination} />
                <p className="govuk-body">
                    Showing {templateSearchResponse?.startItemNumber} to {templateSearchResponse?.endItemNumber} of {templateSearchResponse?.totalCount} results
                </p>;
              </>
              
            )}

          </div>
        </div>
      </div>
    </Main>
  );
};
