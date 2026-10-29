import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from "@testing-library/react";
import { createBrowserHistory, createLocation } from "history";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { match, MemoryRouter } from "react-router-dom";  // use `react-router-dom`

import * as calcHook from "../../../hooks/Calculations/useCalculation";
import * as specHook from "../../../hooks/useSpecificationSummary";
import { SpecificationSummaryQueryResult } from "../../../hooks/useSpecificationSummary";
import { CalculationVersionHistoryRoute } from "../../../pages/Calculations/CalculationVersionHistory";
import { CalculationDetails } from "../../../types/CalculationDetails";
import { CalculationDataType } from "../../../types/Calculations/CalculationCompilePreviewResponse";
import { CalculationVersionHistorySummary } from "../../../types/Calculations/CalculationVersionHistorySummary";
import { CalculationType } from "../../../types/CalculationSearchResponse";
import { PublishStatus } from "../../../types/PublishStatusModel";
import { ProviderDataTrackingMode } from "../../../types/Specifications/ProviderDataTrackingMode";
import { SpecificationSummary } from "../../../types/SpecificationSummary";
import { ValueType } from "../../../types/ValueType";

const history = createBrowserHistory();
const location = {
  pathname: "",
  search: "",
  hash: "",
  state: undefined
};

function renderPage() {
  const { CalculationVersionHistory } = require("../../../pages/Calculations/CalculationVersionHistory");
  return render(
    <MemoryRouter>
      <QueryClientProvider client={new QueryClient()}>
        <CalculationVersionHistory match={mockRoute} history={history} location={location} />
      </QueryClientProvider>
    </MemoryRouter>
  );
}

const mockRoute: match<CalculationVersionHistoryRoute> = {
  params: { calculationId: "Calc123" },
  isExact: false,
  path: "",
  url: ""
};

describe("<CalculationVersionHistory />", () => {
  beforeEach(() => {
    jest.spyOn(calcHook, "useCalculation").mockImplementation(() => ({
      calculation: mockCalculation,
      isLoadingCalculation: false,
      specificationId: mockCalculation.specificationId, // Ensure specificationId is returned
    }));
    
    jest.spyOn(specHook, "useSpecificationSummary").mockImplementation(() => ({
      specification: mockSpecification,
      isLoadingSpecification: false,
      errorCheckingForSpecification: null,
      haveErrorCheckingForSpecification: false,
      isFetchingSpecification: false,
      isSpecificationFetched: true,
      clearSpecificationFromCache: jest.fn(), // Mock clear cache function
    }));
    
  });

  afterEach(() => jest.clearAllMocks());

  it("renders version history rows", async () => {
    renderPage();

    await waitFor(() => {
      const rows = within(screen.getByTestId("calc-versions")).getAllByRole("row");
      expect(rows.length).toBe(2);
    });
  });

  it("renders correct version history details", async () => {
    renderPage();

    await waitFor(() => {
      const rows = within(screen.getByTestId("calc-versions")).getAllByRole("row");
      const firstRow = within(rows[0]).getAllByRole("cell");

      expect(firstRow[0]).toHaveTextContent("Approved");
      expect(firstRow[1]).toHaveTextContent("2");
      expect(firstRow[3]).toHaveTextContent("Jane Smith");
    });
  });
});

// Mock Data
const mockCalculation: CalculationDetails = {
  author: { id: "author-id-1", name: "John Doe" },
  calculationType: CalculationType.Template,
  dataType: CalculationDataType.Decimal,
  description: "Sample calculation",
  fundingStreamId: "Stream-1",
  id: "Calc123",
  lastUpdated: new Date("2021-05-05T00:00:00Z"),
  name: "Sample Calculation",
  namespace: "namespace",
  publishStatus: PublishStatus.Approved,
  specificationId: "Spec-1",
  valueType: ValueType.Percentage,
  sourceCode: '',
  sourceCodeName: '',
  wasTemplateCalculation: false
};

const mockSpecification: SpecificationSummary = {
  name: "Sample Specification",
  approvalStatus: "Approved",
  description: "Sample specification description",
  fundingPeriod: {
    id: "Period-1",
    name: "Funding Period 1",
  },
  id: "Spec-1",
  isSelectedForFunding: true,
  coreProviderVersionUpdates: ProviderDataTrackingMode.Manual,
  fundingStreams: [],
  templateIds: {},
  dataDefinitionRelationshipIds: []
};

const mockVersionHistory: CalculationVersionHistorySummary[] = [
  {
    author: { id: "1", name: "Jane Smith" },
    lastUpdated: new Date("2021-05-05T00:00:00Z"),
    publishStatus: PublishStatus.Approved,
    version: 2,
    calculationId: '',
    name: '',
    sourceCode: '',
    calculationType: '',
    sourceCodeName: '',
    namespace: '',
    wasTemplateCalculation: false
  },
  {
    author: { id: "2", name: "John Doe" },
    lastUpdated: new Date("2021-04-05T00:00:00Z"),
    publishStatus: PublishStatus.Draft,
    version: 1,
    calculationId: '',
    name: '',
    sourceCode: '',
    calculationType: '',
    sourceCodeName: '',
    namespace: '',
    wasTemplateCalculation: false
  },
];

jest.mock("../../../services/calculationService", () => ({
  getCalculationVersionHistoryService: jest.fn(() =>
    Promise.resolve({ data: mockVersionHistory })
  ),
}));
