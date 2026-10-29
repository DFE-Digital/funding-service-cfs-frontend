import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import React from "react";
import { DownloadDataSchema } from "../../../pages/Datasets/DownloadDataSchema";

// ToDo: These tests need sorting properly so no errors occur
jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

describe("<DownloadDataSchema />", () => {
  it("will have the correct breadcrumbs", () => {
    render(
      <MemoryRouter>
        <DownloadDataSchema />
      </MemoryRouter>
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("will have the correct <H1 /> title", () => {
    render(
      <MemoryRouter>
        <DownloadDataSchema />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Download data schemas");
  });

  it("will have the correct <Breadcrumb /> for Home", () => {
    render(
      <MemoryRouter>
        <DownloadDataSchema />
      </MemoryRouter>
    );
    expect(screen.getAllByRole("link")[1].textContent).toBe("Home")  
  });

  it("will have the correct <Breadcrumb /> for Manage data", () => {
    render(
      <MemoryRouter>
        <DownloadDataSchema />
      </MemoryRouter>
    );
    expect(screen.getAllByRole("link")[2].textContent).toBe("Manage data");
  });
});
