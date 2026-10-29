import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { TagEditor, TagEditorProps } from "../../components/TagEditor";


const mockAddNewValue = jest.fn();
const mockRemoveValue = jest.fn();
const defaultProps: TagEditorProps = {
  allowDuplicates: false,
  tagValuesCsv: "",
  label: "test",
  onAddNewValue: mockAddNewValue,
  onRemoveValue: mockRemoveValue,
};

describe("<TagEditor />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders specified tags without showing error message", () => {
    render(
      <TagEditor
        {...defaultProps}
        tagValuesCsv={"Option1,Option2,Option2"}
      />
    );
    const tags = screen.getAllByTestId("tag");
    expect(tags).toHaveLength(3);
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByTestId("add-tag-button")).toBeInTheDocument();
    expect(screen.queryByText("Error:")).not.toBeInTheDocument();
  });

  it("renders custom error message when specified", () => {
    render(
      <TagEditor
        {...defaultProps}
        tagValuesCsv={"Option1,Option2,Option2"}
        showErrorMessageOnRender={"There is an error"}
      />
    );
    const tags = screen.getAllByTestId("tag");
    expect(tags).toHaveLength(3);
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByTestId("add-tag-button")).toBeInTheDocument();
  });

  it("clicking on a tag calls remove callback", () => {
    render(
      <TagEditor
        {...defaultProps}
        tagValuesCsv={"Option1,Option2"}
      />
    );
    const tags = screen.getAllByTestId("tag");
    expect(tags).toHaveLength(2);
    fireEvent.click(tags[0]);
    expect(screen.queryByText("Error:")).not.toBeInTheDocument();
    expect(mockRemoveValue).toBeCalledTimes(1);
  });

  it("add new tag calls add callback", () => {
    render(
      <TagEditor
        {...defaultProps}
        tagValuesCsv={""}
      />
    );
    const addTagInput = screen.getByRole('textbox');
    const addButton = screen.getByTestId("add-tag-button");
    fireEvent.change(addTagInput, { target: { value: "Option1" } });
    fireEvent.click(addButton);
    expect(mockAddNewValue).toBeCalledTimes(1);
  });

  it("ignores empty input when trying to add new tag", () => {
    render(
      <TagEditor
        {...defaultProps}
        tagValuesCsv={""}
      />
    );
    const addButton = screen.getByTestId("add-tag-button");
    fireEvent.click(addButton);
    expect(mockAddNewValue).toBeCalledTimes(0);
  });

  it("shows error message when trying to add a duplicate and duplicates set to not allowed", () => {
    render(
      <TagEditor
        {...defaultProps}
        tagValuesCsv={"Option1"}
        duplicateErrorMessage={"No duplicates allowed"}
      />
    );
    const addTagInput = screen.getByRole('textbox');
    const addButton = screen.getByTestId("add-tag-button");
    fireEvent.change(addTagInput, { target: { value: "Option1" } });
    fireEvent.click(addButton);
    expect(mockAddNewValue).toBeCalledTimes(0);
  });

  it("shows default error message when trying to add a duplicate and duplicates set to not allowed", () => {
    render(
      <TagEditor
        {...defaultProps}
        tagValuesCsv={"Option1"}
      />
    );
    const addTagInput = screen.getByRole('button', {name: /add/i});
    const addButton = screen.getByTestId("add-tag-button");
    fireEvent.change(addTagInput, { target: { value: "Option1" } });
    fireEvent.click(addButton);
    expect(screen.getByText(/test/i)).toBeInTheDocument();
    expect(mockAddNewValue).toBeCalledTimes(0);
  });

  it("does not show error message when trying to add a duplicate and duplicates are allowed", () => {
    render(
      <TagEditor
        {...defaultProps}
        allowDuplicates={true}
        tagValuesCsv={"Option1"}
      />
    );
    const addTagInput = screen.getByRole('textbox');
    const addButton = screen.getByTestId("add-tag-button");
    fireEvent.change(addTagInput, { target: { value: "Option1" } });
    fireEvent.click(addButton);
    expect(screen.queryByText("Error:")).not.toBeInTheDocument();
    expect(mockAddNewValue).toBeCalledTimes(1);
  });
});
