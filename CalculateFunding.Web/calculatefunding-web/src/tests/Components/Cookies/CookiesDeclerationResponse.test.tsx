import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CookieDeclerationResponse from "../../../components/Cookies/CookieDeclerationResponse"; // Adjust the path as needed

describe("CookieDeclerationResponse Component", () => {
  let mockSetIsHidden: jest.Mock;

  beforeEach(() => {
    mockSetIsHidden = jest.fn();
    localStorage.clear();
  });

  it("displays the appropriate response message for accepted cookies", () => {
    render(
      <CookieDeclerationResponse cookieConsent={true} setIsHidden={mockSetIsHidden} />
    );
    expect(
    screen.getByText(/you've accepted analytics cookies/i)
    ).toBeInTheDocument();
  });

  it("displays the appropriate response message for rejected cookies", () => {
    render(
      <CookieDeclerationResponse cookieConsent={false} setIsHidden={mockSetIsHidden} />
    );
    expect(      
      screen.getByText(/you've rejected analytics cookies/i)
    ).toBeInTheDocument();
    
  });

  it("hides the message when 'Hide cookie message' is clicked", () => {
    render(
      <CookieDeclerationResponse cookieConsent={true} setIsHidden={mockSetIsHidden} />
    );

    fireEvent.click(screen.getByText("Hide cookie message"));
    expect(mockSetIsHidden).toHaveBeenCalledWith(true);
    expect(localStorage.getItem("cookieMessageHidden")).toBe("true");
  });
});
