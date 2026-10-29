import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import { Cookies } from "../../pages/Cookies"; // Adjust the path if needed

const mockSetCookieConsent = jest.fn();

describe("Cookies Component", () => {
  it("renders cookie page correctly", () => {
    render(
      <MemoryRouter>
        <Cookies cookieConsent={null} setCookieConsent={mockSetCookieConsent} />
      </MemoryRouter>
    );
    expect(screen.findByRole("h1"));
  });

  it("displays success message after saving preferences", () => {
    render(
      <MemoryRouter>
        <Cookies cookieConsent={null} setCookieConsent={mockSetCookieConsent} />
      </MemoryRouter>
    );
    const saveButton = screen.getByRole("button", { name: /Save cookie settings/i });
    fireEvent.click(saveButton);
    expect(screen.getByText(/Success/i)).toBeInTheDocument();
  });
});
