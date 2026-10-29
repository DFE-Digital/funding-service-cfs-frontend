import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BackToTop } from '../../components/BackToTop';

describe('<BackToTop />', () => {
  it('renders a panel', () => {
    render(<BackToTop id="testId" />);
    const panel = screen.getByRole('button', { name: /back to top/i });
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveClass('govuk-link');
    expect(panel.children.length).toBe(1);
  });

  it('has the correct body text', () => {
    render(<BackToTop id="testId" />);
    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toHaveTextContent('Back to top');
  });

  it('is hidden', () => {
    render(<BackToTop id="testId" hidden={true} />);
    const panel = screen.getByTestId('back-to-top');
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute('hidden');
  });

  it('is visible', () => {
    render(<BackToTop id="testId" hidden={false} />);
    const panel = screen.getByRole('button', {
    name: /back to top/i});
    expect(panel).toBeInTheDocument();
    expect(panel).not.toHaveAttribute('hidden');
  });

  it('is visible when hidden is not used', () => {
    render(<BackToTop id="testId" />);
    const panel = screen.getByRole('button', {
    name: /back to top/i});
    expect(panel).toBeInTheDocument();
    expect(panel).not.toHaveAttribute('hidden');
  });
});
