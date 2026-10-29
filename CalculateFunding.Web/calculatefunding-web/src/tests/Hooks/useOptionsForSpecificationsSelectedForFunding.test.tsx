import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { useOptionsForSpecificationsSelectedForFunding } from "../../hooks/FundingApproval/useOptionsForSpecificationsSelectedForFunding";
import { FundingStreamWithSpecificationSelectedForFunding } from "../../types/SpecificationSelectedForFunding";
import { QueryClientProviderTestWrapper } from "./QueryClientProviderTestWrapper";

const mockData: FundingStreamWithSpecificationSelectedForFunding[] = [
  {
    id: "WIZZ",
    name: "Wizard Funding Stream",
    periods: [
      {
        id: "FY20-21",
        name: "Period 2020-2021",
        specifications: [{ id: "ABC123", name: "Wizard Training" }],
      },
    ],
  },
  {
    id: "DRK",
    name: "Dark Arts Stream",
    periods: [
      { id: "FY21-22", name: "Period 2021-2022", specifications: [{ id: "ABC123", name: "Dark Arts" }] },
    ],
  },
];

describe("useOptionsForSpecificationsSelectedForFunding loads data correctly", () => {
  const mock = new MockAdapter(axios);

  beforeAll(() => {
    mock.onGet("/api/specs/funding-selections").reply(200, mockData);
  });

  afterAll(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  it("returns data correctly", async () => {
    const { result } = renderHook(
      () => useOptionsForSpecificationsSelectedForFunding({}),
      { wrapper: QueryClientProviderTestWrapper }
    );

    await waitFor(() => expect(result.current.isLoadingOptions).toBe(false));

    expect(result.current.fundingStreams).toEqual(mockData);
    expect(result.current.isErrorCheckingForOptions).toBe(false);
    expect(result.current.errorCheckingForOptions).toBe("");
  });
});
