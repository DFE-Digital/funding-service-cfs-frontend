import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { EditDescriptionModal } from "../../../components/TemplateBuilder/EditDescriptionModal";

test("hides itself when showModal is false", () => {
  const originalDescription = "This is a description";
  const toggleModalMock = jest.fn();
  const saveDescriptionMock = jest.fn();

  const { container } = render(
    <EditDescriptionModal
      originalDescription={originalDescription}
      showModal={false}
      toggleModal={toggleModalMock}
      saveDescription={saveDescriptionMock}
    />
  );
  const modalElement = container.querySelector("#edit-desc-modal");
  if (!modalElement) {
    throw new Error("Modal element not found");
  }
  const style = window.getComputedStyle(modalElement);
  expect(style.display).toBe("none");

});

it("renders original description", () => {
  const originalDescription = "This is a description";
  const toggleModalMock = jest.fn();
  const saveDescriptionMock = jest.fn();
  render(
    <EditDescriptionModal
      originalDescription={originalDescription}
      showModal={true}
      toggleModal={toggleModalMock}
      saveDescription={saveDescriptionMock}
    />
  );
  const description = screen.getByLabelText("Edit description");
  expect(description).toHaveValue(originalDescription);
});

test("hides itself when showModal is false", () => {
  const originalDescription = "This is a description";
  const toggleModalMock = jest.fn();
  const saveDescriptionMock = jest.fn();
  const { container } = render(
    <EditDescriptionModal
      originalDescription={originalDescription}
      showModal={false}
      toggleModal={toggleModalMock}
      saveDescription={saveDescriptionMock}
    />
  );
  const modalElement = container.querySelector("#edit-desc-modal");
  if (!modalElement) {
    throw new Error("Modal element not found");
  }
  const style = window.getComputedStyle(modalElement);
  expect(style.display).toBe("none");
});

it("toggles modal visibility when close button is clicked", () => {
  const originalDescription = "This is a description";
  const toggleModalMock = jest.fn();
  const saveDescriptionMock = jest.fn();
  render(
    <EditDescriptionModal
      originalDescription={originalDescription}
      showModal={true}
      toggleModal={toggleModalMock}
      saveDescription={saveDescriptionMock}
    />
  );
  const closeButton = screen.getByRole("button", { name: /×/ });
  fireEvent.click(closeButton);
  expect(toggleModalMock).toHaveBeenCalledTimes(1);
});

it("toggles modal visibility when save button is clicked", async () => {
  const originalDescription = "This is a description";
  const toggleModalMock = jest.fn();
  const saveDescriptionMock = jest.fn().mockResolvedValue(Promise.resolve(true));
  render(
    <EditDescriptionModal
      originalDescription={originalDescription}
      showModal={true}
      toggleModal={toggleModalMock}
      saveDescription={saveDescriptionMock}
    />
  );
  const saveButton = screen.getByRole("button", { name: /save/i });
  fireEvent.click(saveButton);
  await waitFor(() => {
    expect(saveDescriptionMock).toHaveBeenCalledTimes(1);
    expect(toggleModalMock).toHaveBeenCalledTimes(1);
  });
});
