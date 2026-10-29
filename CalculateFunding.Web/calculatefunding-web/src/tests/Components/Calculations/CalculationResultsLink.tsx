import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { CalculationResultsLink } from "../../../components/Calculations/CalculationResultsLink";

describe("<CalculationResultsLink />", () => {
  it("renders a link", () => {
    render(<CalculationResultsLink calculationId="1234" />);
    const linkElement = screen.getByRole("link");
    expect(linkElement).toBeInTheDocument();
  });
});
