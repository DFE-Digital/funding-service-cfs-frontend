import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CookiesDeclaration from "../../../components/Cookies/CookiesDeclaration"; // Adjust the path as needed

describe("CookiesDeclaration Component", () => {
  let mockSetCookieConsent: jest.Mock;

  beforeEach(() => {
    mockSetCookieConsent = jest.fn();
    localStorage.clear();
  });

  it("renders cookie consent options", () => {
    render(<CookiesDeclaration setCookieConsent={mockSetCookieConsent} cookieConsent={null} />);
    expect(
      screen.getByText("We use some essential cookies to make this service work.")
    ).toBeInTheDocument();
    expect(screen.getByText("Accept analytics cookies")).toBeInTheDocument();
    expect(screen.getByText("Reject analytics cookies")).toBeInTheDocument();
  });

  it("handles accept button click", () => {
    render(<CookiesDeclaration setCookieConsent={mockSetCookieConsent} cookieConsent={null} />);

    fireEvent.click(screen.getByText("Accept analytics cookies"));
    expect(mockSetCookieConsent).toHaveBeenCalledWith(true);
    expect(localStorage.getItem("cookie-consent")).toBe("accepted");
  });

  it("handles reject button click", () => {
    render(<CookiesDeclaration setCookieConsent={mockSetCookieConsent} cookieConsent={null} />);

    fireEvent.click(screen.getByText("Reject analytics cookies"));
    expect(mockSetCookieConsent).toHaveBeenCalledWith(false);
    expect(localStorage.getItem("cookie-consent")).toBe("rejected");
  });
});
