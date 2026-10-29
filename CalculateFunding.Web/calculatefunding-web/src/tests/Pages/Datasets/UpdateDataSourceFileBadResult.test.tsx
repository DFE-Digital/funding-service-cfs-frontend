import '@testing-library/jest-dom';

import { screen, waitFor } from "@testing-library/react";
import React from "react";

import { UpdateDataSourceFileTestData } from "./UpdateDataSourceFileTestData";
import { useSelectorSpy } from "../Permissions/MyPermissions.shared";

const testData = UpdateDataSourceFileTestData();

describe("<UpdateDataSourceFile /> with validation exception", () => {
  beforeEach(async () => {
    testData.mockDatasetServiceWithBadResult();
    testData.mockProviderService();
    useSelectorSpy.mockReturnValue([
      {
        fundingStreamId: "GAG",
        canUploadDataSourceFiles: true,
      },
    ]);
    await testData.renderPage();
  });

  afterEach(() => {
    jest.clearAllMocks();
    useSelectorSpy.mockReset();
  });

  describe("invalid form submission checks ", () => {
    it("Failed message is displayed given a bad result with validation error is returned ", async () => {
      await testData.givenFormIsCompleted();

      await testData.submitForm();

      await waitFor(() => {
        expect(screen.getByText("Some Validation Error")).toBeInTheDocument();
      });
    });
  });
});
