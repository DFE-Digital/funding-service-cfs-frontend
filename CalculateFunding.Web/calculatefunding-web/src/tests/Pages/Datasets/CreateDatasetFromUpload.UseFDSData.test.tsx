import { screen, waitFor } from "@testing-library/react";
import { createDatasetTestSetup } from "./CreateDatasetTestData";

describe("<CreateDatasetFromUpload />", () => {
  describe("when page loads for CFS provider source", () => {
    const mockHelper = createDatasetTestSetup();

    beforeEach(async () => {
      jest.clearAllMocks();

      mockHelper.mockSpecificationHook();
      mockHelper.mockFundingConfigurationHook(
        mockHelper.mockFundingConfigurationQueryResult(mockHelper.mockUseFDSDataFundingConfiguration)
      );

      jest.mock("../../../services/datasetService", () => mockHelper.mockDatasetApi());
      jest.mock("../../../services/specificationService", () => mockHelper.mockSpecificationApi());

      await waitFor(() => {
        mockHelper.renderCreateDatasetPage();
      });
    });

    it("renders Specification name in breadcrumbs", async () => {
      expect(await screen.findByRole("link", { name: mockHelper.testSpec.name })).toHaveClass(
        "govuk-breadcrumbs__link"
      );
    });

    it("does not render loading spinner", async () => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    it("renders Specification name in the form heading", async () => {
      expect(await screen.findByRole("heading", { name: mockHelper.testSpec.name })).toBeInTheDocument();
    });

    it("renders 'Set as provider data'", async () => {
      expect(await screen.findByRole("heading", { name: /Set as provider data/ })).toBeInTheDocument();
    });

    it("renders data schema selections", async () => {
      expect(await screen.findByText(/Select data schema/)).toBeInTheDocument();
    });

    it("renders dataset name input", async () => {
      expect(await screen.findByText(/Data set name/)).toBeInTheDocument();
    });

    it("renders dataset description input", async () => {
      expect(await screen.findByText(/Description/)).toBeInTheDocument();
    });
  });
});
