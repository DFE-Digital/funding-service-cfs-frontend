import '@testing-library/jest-dom';
import "@testing-library/jest-dom";

import { fireEvent, getByText, screen, waitFor, render } from "@testing-library/react";
import React from "react";

import SortableButton from "../../components/SortableButton";

const callbackFunction = jest.fn();

describe("<SortableButton />", () => {
  afterEach(() => {
    callbackFunction.mockClear();
  });

  it("renders a button", () => {
    render(<SortableButton callback={callbackFunction} sortName={"name"} title={"First name"} />);
    expect(screen.getByText("First name"));
  });

  it("changes aria-sortable on click", () => {
     render(
      <SortableButton callback={callbackFunction} sortName={"name"} title={"First name"} />
    );

    fireEvent(
      screen.getByText("First name"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: false,
      })
    );

    waitFor(() =>
      expect(screen.getByText("First name").parentElement).toHaveAttribute("aria-sortable", "ascending")
    );
  });

  it("triggers a callback on click", () => {
    render(
      <SortableButton callback={callbackFunction} sortName={"name"} title={"First name"} />
    );

    fireEvent(
      screen.getByText("First name"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: false,
      })
    );

    expect(callbackFunction).toHaveBeenCalledTimes(1);
  });
});
