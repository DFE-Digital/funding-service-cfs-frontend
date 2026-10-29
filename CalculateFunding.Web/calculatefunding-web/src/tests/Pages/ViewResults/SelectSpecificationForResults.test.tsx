import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { SelectSpecificationForResults } from "../../../pages/Specifications/SelectSpecificationForResults";

// Mock the service that fetches funding streams
jest.mock("../../../services/policyService", () => ({
  getFundingStreamsService: jest.fn().mockResolvedValue({
    data: [{ id: "DSG", name: "Dedicated Schools Grant" }]
  }),
}));

describe("<SelectSpecificationForResults />", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests to avoid interference
  });

  it("finds the correct heading", async () => {
    render(
      <BrowserRouter>
        <SelectSpecificationForResults />
      </BrowserRouter>
    );

    // Wait for the heading to appear
    const heading = await screen.findByText("Specification results");
    expect(heading).toBeInTheDocument();
  });

  it("finds the correct caption", async () => {
    render(
      <BrowserRouter>
        <SelectSpecificationForResults />
      </BrowserRouter>
    );

    // Wait for the caption to appear
    const caption = await screen.findByText("Select a specification to view the specification results.");
    expect(caption).toBeInTheDocument();
  });
});
