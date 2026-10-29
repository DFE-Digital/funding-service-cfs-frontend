import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import '@testing-library/jest-dom'; // for additional matchers

import { MapDataSourceFiles } from "../../../pages/Datasets/MapDataSourceFiles";

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

describe("<MapDataSourceFiles />", () => {
  it("renders the page top level div", () => {
    render(
      <MemoryRouter>
        <MapDataSourceFiles />
      </MemoryRouter>
    );
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByTestId("map-datasource-files")).toBeInTheDocument();
  });

  it("has the correct wording for the loading status", () => {
    render(
      <MemoryRouter>
        <MapDataSourceFiles />
      </MemoryRouter>
    );
    expect(screen.getByText("Loading specifications")).toBeInTheDocument();
  });
});
