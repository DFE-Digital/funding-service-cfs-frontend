import React from "react";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import { CompilationErrorMessageList } from "../../../components/Calculations/CompilationErrorMessageList";
import {
  CompileErrorSeverity,
  CompilerMessage,
} from "../../../types/Calculations/CalculationCompilePreviewResponse";

const compilerMessages: CompilerMessage[] = [
  {
    location: {
      endChar: 2,
      endLine: 1,
      owner: {
        id: "Test Owner Id 1",
        name: "Test Owner Name 1",
      },
      startChar: 1,
      startLine: 1,
    },
    message: "Test message 1",
    severity: CompileErrorSeverity.Error,
  },
  {
    location: {
      endChar: 2,
      endLine: 1,
      owner: {
        id: "Test Owner Id 2",
        name: "Test Owner Name 2",
      },
      startChar: 1,
      startLine: 1,
    },
    message: "Test message 2",
    severity: CompileErrorSeverity.Error,
  },
];

describe("<CompilationErrorMessageList /> renders", () => {
  it("the title", () => {
    const { getByText } = render(<CompilationErrorMessageList compilerMessages={compilerMessages} />);
    expect(getByText("There was a compilation error")).toBeInTheDocument();
  });

  it("a table of two rows for the compiler messages", () => {
    const { container } = render(<CompilationErrorMessageList compilerMessages={compilerMessages} />);
    const rows = container.querySelectorAll("table>tbody>tr");
    expect(rows.length).toBe(2);
  });
});
