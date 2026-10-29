import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import { Details } from '../../components/Details';

describe('<Details />', () => {
  it('renders a panel with summary and text', () => {
    render(<Details body="Test Body" title="Test Title" />);
    const detailsElement = screen.getByText(/test title/i);
    expect(detailsElement).toBeInTheDocument();
    const summaryElement = screen.getByText(/test title/i);
    const textElement = screen.getByText(/test body/i);
    expect(summaryElement).toBeInTheDocument();
    expect(textElement).toBeInTheDocument();
  });

  it('has the correct title', () => {
    render(<Details body="Test Body" title="Test Title" />);
    const summaryElement = screen.getByText(/test title/i);
    expect(summaryElement).toBeInTheDocument();
  });

  it('has the correct body text', () => {
    render(<Details body="Test Body" title="Test Title" />);
    const bodyElement = screen.getByText(/test body/i);
    expect(bodyElement).toBeInTheDocument();
  });
});
