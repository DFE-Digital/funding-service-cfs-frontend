import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { TimeInput } from "../../components/TimeInput";

function mockCallback() {
  return false;
}

describe("Rendering the <TimeInput> component", () => {
  beforeEach(() => {
    render(<TimeInput time={"00:00"} callback={mockCallback} inputName={"TimeInputTest"} />);
  });

  it(" with the correct heading label", () => {
    expect(screen.getByText(/time/i)).toBeInTheDocument();
  });

  it(" with the correct hour box label", () => {
    expect(screen.getByLabelText("Hour")).toBeInTheDocument();
  });

  it(" with the correct minute label", () => {
    expect(screen.getByText(":00")).toBeInTheDocument();
  });

  it(" with the correct input", () => {
    expect(screen.getByRole("textbox", { name: /hour/i })).toBeInTheDocument();
  });
});

describe("Inputting into the <TimeInput> component", () => {
  beforeEach(() => {
    render(<TimeInput time={"00:00"} callback={mockCallback} inputName={"TimeInputTest"} />);
  });

  it(" does not show an error when the value is time valid", () => {
    const timeInput = screen.getByRole("textbox", { name: /hour/i });
    fireEvent.click(timeInput);
    fireEvent.change(timeInput, { target: { value: "2" } });
    expect(screen.queryByText("govuk-form-group--error")).not.toBeInTheDocument();
  });
});
