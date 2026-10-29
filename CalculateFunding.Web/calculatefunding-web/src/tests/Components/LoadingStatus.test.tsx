import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { LoadingStatus } from "../../components/LoadingStatus";

describe("<LoadingStatus />", () => {
  it("renders a loading status", () => {
    render(<LoadingStatus id="testLoading" title="test title" />);
    const actual = screen.getByTestId("loader");
    expect(actual).toBeInTheDocument();
    expect(actual.children.length).toBe(1);
  });

  it("has the correct title", () => {
    render(<LoadingStatus title="test title" />);
    const actual = screen.getByText("test title", { selector: "h2.govuk-heading-l" });
    expect(actual).toBeInTheDocument();
  });

  it("has the correct sub title", () => {
    render(<LoadingStatus title="test title" subTitle="test sub title" />);
    const actual = screen.getByText("test sub title", { selector: "h3.govuk-heading-m" });
    expect(actual).toBeInTheDocument();
  });

  it("has the correct description", () => {
    render(<LoadingStatus title="test title" description="test description" />);
    const actual = screen.getByText("test description", { selector: "p" });
    expect(actual).toBeInTheDocument();
  });

  it("hides component given hidden property is set to true", () => {
    render(<LoadingStatus id="testLoading" title="test title" hidden={true} />);
    const actual = screen.getByTestId("loader");
    expect(actual).toHaveAttribute("hidden");
  });
});
