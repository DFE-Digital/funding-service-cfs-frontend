import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import { SearchBox } from "../../components/SearchBox";

describe("<SearchBox />", () => {
  it("renders correctly", () => {
    const mockCallback = jest.fn();
    render(<SearchBox callback={mockCallback} timeout={0} />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
  });
});
