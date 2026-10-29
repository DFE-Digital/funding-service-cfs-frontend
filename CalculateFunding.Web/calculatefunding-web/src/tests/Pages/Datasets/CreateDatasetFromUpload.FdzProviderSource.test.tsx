import { screen, waitFor } from "@testing-library/react";
import { createDatasetTestSetup } from "./CreateDatasetTestData";

describe("<CreateDatasetFromUpload />", () => {
  describe("when page loads for FDZ provider source", () => {
    const mockHelper = createDatasetTestSetup();

    beforeEach(async () => {
      jest.clearAllMocks();
      mockHelper.mockSpecificationHook();
      mockHelper.mockFundingConfigurationHook(
        mockHelper.mockFundingConfigurationQueryResult(mockHelper.mockFdzFundingConfiguration)
      );
    
      jest.mock("../../../services/datasetService", () => mockHelper.mockDatasetApi());
      jest.mock("../../../services/specificationService", () => mockHelper.mockSpecificationApi());

      await waitFor(() => {
        mockHelper.renderCreateDatasetPage();
      });
    });

    it("renders Specification name in breadcrumbs", async () => {
      await waitFor(() => {
        expect(screen.getByRole("link", { name: mockHelper.testSpec.name })).toHaveClass("govuk-breadcrumbs__link");
      });
    });

    it("does not render loading spinner", async () => {
      await waitFor(() => {
        expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
      });
    });

    it("renders Specification name in the form heading", async () => {
      await waitFor(() => {
        expect(screen.getByRole("heading", { name: mockHelper.testSpec.name })).toBeInTheDocument();
      });
    });

    it("does not render Set as provider data for FDZ", async () => {
      await waitFor(() => {
        expect(screen.queryByRole("heading", { name: /Set as provider data/ })).not.toBeInTheDocument();
      });
    });

    it("renders data schema selections", async () => {
      await waitFor(() => {
        expect(screen.getByText(/Select data schema/)).toBeInTheDocument();
      });
    });

    it("renders dataset name input", async () => {
      await waitFor(() => {
        expect(screen.getByText(/Data set name/)).toBeInTheDocument();
      });
    });

    it("renders dataset description input", async () => {
      await waitFor(() => {
        expect(screen.getByText(/Description/)).toBeInTheDocument();
      });
    });
  });
});
