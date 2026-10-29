import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { WarningText } from "../../components/WarningText";

describe("<WarningText />", () => {
  it("renders a panel", () => {
    render(<WarningText text="Testing Component" />);
    const actual = screen.getByRole("alert");
    expect(actual).toBeInTheDocument();
  });

  it("is visible", () => {
    render(<WarningText text="Testing Component" hidden={false} />);
    const actual = screen.getByRole("alert");
    expect(actual).not.toHaveAttribute("hidden");
  });

  it("has the correct text", () => {
    render(<WarningText text="Testing Component" hidden={false} />);
    const actual = screen.getByText("Testing Component");
    expect(actual).toBeInTheDocument();
  });
});
