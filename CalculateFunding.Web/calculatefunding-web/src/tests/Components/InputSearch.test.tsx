import '@testing-library/jest-dom';
import "@testing-library/jest-dom";

import { waitFor } from "@testing-library/dom";
import { fireEvent, render, screen, act } from "@testing-library/react";
import React from "react";

import { InputSearch } from "../../components/InputSearch";


const validData = [
  "Bedfordshire",
  "Hertfordshire",
  "Buckinghamshire",
  "Northamptonshire",
  "Norfolk",
  "Oxfordshire",
];

const callbackFunction = jest.fn();
const inputId = "test-id";
function renderComponent() {
  return render(<InputSearch id={inputId} callback={callbackFunction} suggestions={validData} />);
}

describe("<InputSearch />", () => {
  afterEach(() => {
    callbackFunction.mockClear();
  });

  it("renders the input element", () => {
    renderComponent();

    expect(document.querySelector(`input#${inputId}`)).toBeInTheDocument();
  });

  it("renders the dropdown list", async () => {
    renderComponent();

    await waitFor(() => expect(document.querySelector("datalist")).toBeInTheDocument());
  });

  it("fires the callback when selecting something from the dropdown list", async () => {
    renderComponent();
    const actual = await screen.findByRole(`${inputId}-input-search`);

    act(() => {
      fireEvent.change(actual, { target: { value: "Buckinghamshire" } });
    });

    await waitFor(() => expect(callbackFunction).toHaveBeenCalledTimes(1));
  });
});
