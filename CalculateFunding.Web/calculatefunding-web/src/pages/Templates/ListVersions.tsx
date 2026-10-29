import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { DateTimeFormatter } from "../../components/DateTimeFormatter";
import { LoadingStatus } from "../../components/LoadingStatus";
import { Main } from "../../components/Main";
import { MultipleErrorSummary } from "../../components/MultipleErrorSummary";
import {
  SearchFilterContainer,
  SearchFilterSection,
  SearchFilterSelectionPanel,
  SearchFiltersOuterContainer,
  SearchSidebar,
} from "../../components/SearchFilterContainer";
import { TextLink } from "../../components/TextLink";
import { useTemplate } from "../../hooks/TemplateBuilder/useTemplate";
import { useTemplateVersions } from "../../hooks/TemplateBuilder/useTemplateVersions";
import { useErrors } from "../../hooks/useErrors";
import { useToggle } from "../../hooks/useToggle";
import { Section } from "../../types/Sections";
import { TemplateStatus, TemplateVersionSearchQuery } from "../../types/TemplateBuilderDefinitions";
import { BackLink } from "components/BackLink";

export interface TemplateRoute {
  templateId: string;
}

export const ListVersions = () => {
  const { templateId } = useParams<TemplateRoute>();
  const itemsPerPage = 10;
  const [searchCriteria, setSearchCriteria] = useState<TemplateVersionSearchQuery>({
    templateId,
    page: 1,
    itemsPerPage,
  });
  const { errors, addError } = useErrors();
  const {
    isExpanded: isStatusExpanded,
    toggleExpanded: toggleStatusExpanded,
    setExpanded: setStatusExpanded,
  } = useToggle();
  const { template, isLoadingTemplate } = useTemplate(templateId, {
    onError: (err) =>
      addError({
        error: err,
        description: "Error whilst fetching template",
      }),
  });
  const { templateVersions, isLoadingTemplateVersions } = useTemplateVersions(searchCriteria, {
    onError: (err) =>
      addError({
        error: err,
        description: "Error whilst searching template versions",
      }),
  });

  const { isExpanded, setExpanded } = useToggle();

  const isTemplateStatus = (arg: string): arg is TemplateStatus => {
    return Object.values(TemplateStatus).includes(arg as TemplateStatus);
  };

  const onStatusAdded = (extraStatus: string) => {
    if (isTemplateStatus(extraStatus)) {
      setSearchCriteria((prev) => ({
        ...prev,
        page: 1,
        statuses: [...(prev.statuses ?? []).filter((s) => s !== extraStatus).concat([extraStatus])],
      }));
    }
  };

  const onStatusRemoved = (removedStatus: string) => {
    if (isTemplateStatus(removedStatus)) {
      setSearchCriteria((prev) => ({
        ...prev,
        page: 1,
        statuses: [...(prev.statuses ?? []).filter((s) => s !== removedStatus)],
      }));
    }
  };

  const expandAllFilters = () => {
    setExpanded(true);
    setStatusExpanded(true);
  };

  const collapseAllFilters = () => {
    setExpanded(false);
    setStatusExpanded(false);
  };

  const statusFilters = searchCriteria.statuses?.map((s) => s.toString()) ?? [];

  if (isLoadingTemplate || isLoadingTemplateVersions) {
    return (
      <Main location={Section.Templates}>
        <LoadingStatus title="Loading" description="Please wait whilst the template versions are loading" />
      </Main>
    );
  }

  return (
    <Main location={Section.Templates}>
      <MultipleErrorSummary errors={errors} />
      <div className="govuk-grid-row govuk-!-margin-bottom-7">
        <div className="govuk-grid-column-full">
          <BackLink />
        </div>
      </div>

      <span className="govuk-caption-l govuk-!-margin-bottom-1">Templates</span>
      <h1 id="title-header" className="govuk-heading-l govuk-!-margin-bottom-4">
        Check the template version history
      </h1>
      <p id="title-desc" className="govuk-body govuk-!-margin-bottom-6">
        Check template version details or restore a previous template version.
      </p>

      <h3 className="govuk-heading-m govuk-!-margin-bottom-5">Template name:</h3>
      {!!template && (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <SearchSidebar formId={"searchTemplates"}>
              <div className="govuk-!-padding-2  filter-title-background">
                <h2 className="govuk-heading-m govuk-!-margin-0 ">Filters</h2>
              </div>
              <SearchFilterSelectionPanel
                title="Selected filters"
                selectedStatusFilters={statusFilters}
                selectedFundingStreamFilters={[]}
                selectedFundingPeriodFilters={[]}
                handleRemoveStatusFilter={onStatusRemoved}
                handleRemoveFundingStreamFilter={() => {}}
                handleRemoveFundingPeriodFilter={() => {}}
                handleClearSearch={() => {
                  setSearchCriteria({
                    templateId,
                    page: 1,
                    itemsPerPage,
                    statuses: [],
                  });
                }}
              />

              <SearchFiltersOuterContainer
                expandAllFilters={expandAllFilters}
                collapseAllFilters={collapseAllFilters}
                allExpanded={isExpanded}
                allCollapsed={!isExpanded}
              >
                <SearchFilterContainer>
                  <SearchFilterSection
                    facets={[TemplateStatus.Draft, TemplateStatus.Published]}
                    isExpanded={isStatusExpanded}
                    toggleExpanded={toggleStatusExpanded}
                    addFilter={onStatusAdded}
                    removeFilter={onStatusRemoved}
                    selectedFilters={statusFilters}
                    title={"Status"}
                  />
                </SearchFilterContainer>
              </SearchFiltersOuterContainer>
            </SearchSidebar>
          </div>
          <div className="govuk-grid-column-two-thirds">
            <h5 className="govuk-heading-m">Template version history</h5>
            {templateVersions?.totalCount ? (
              <>
                <table className="govuk-table" id="templates-table">
                  <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                      <th scope="col" className="govuk-table__header">
                        Version
                      </th>
                      <th scope="col" className="govuk-table__header">
                        Status
                      </th>
                      <th scope="col" className="govuk-table__header">
                        Last updated on
                      </th>
                      <th scope="col" className="govuk-table__header">
                        Last updated by
                      </th>
                    </tr>
                  </thead>
                  <tbody className="govuk-table__body" id="mainContentResults">
                    {templateVersions.pageResults.map((item) => {
                      const label = `V${item.majorVersion}.${item.minorVersion}`;
                      return (
                        <tr key={item.version} className="govuk-table__row">
                          <th scope="row" className="govuk-table__header">
                            <TextLink
                              to={`/Templates/${template.templateId}/Versions/${item.version}`}
                              id={"version-" + item.version}
                              label={label}
                            >
                              {label}
                            </TextLink>
                          </th>
                          <td className="govuk-table__cell" data-testid={"status-" + item.version}>
                            {item.status === TemplateStatus.Draft && item.version !== template.version && (
                              <span>
                                <strong className="govuk-tag govuk-tag-text-original govuk-tag--grey">
                                  Draft
                                </strong>
                              </span>
                            )}
                            {item.status === TemplateStatus.Published && (
                              <span>
                                <strong className="govuk-tag govuk-tag-text-original govuk-tag--green">
                                  Published
                                </strong>
                              </span>
                            )}
                          </td>
                          <td className="govuk-table__cell">
                            <DateTimeFormatter date={item.lastModificationDate} />
                          </td>
                          <td className="govuk-table__cell">{item.authorName}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <div className="govuk-grid-column-two-thirds" data-testid="no-results">
                <p className="govuk-body">There are no records to match your search</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Main>
  );
};
