import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorSummary } from '../../components/ErrorSummary';

describe('<ErrorSummary />', () => {
  it('renders a panel with error details', () => {
    render(
      <ErrorSummary title="Test title" error="Error message" suggestion="Suggestion to user" />
    );
    const errorSummaryElement = screen.getByRole('alert');
    expect(errorSummaryElement).toBeInTheDocument();
    const titleElement = screen.getByText(/error message/i);
    const titleElementId = titleElement.getAttribute('id');
    expect(titleElementId).toEqual('error-summary-title');
    const titleText = screen.getByText(/test title/i);
    expect(titleText).toBeInTheDocument();
    const suggestionText = screen.getByText(/suggestion to user/i);
    expect(suggestionText).toBeInTheDocument();
  });

  it('hides the error summary when no title is provided', () => {
    render(
      <ErrorSummary title="" error="Error message" suggestion="Suggestion to user" />
    );
    const errorSummaryElement = screen.queryByRole('alert');
    expect(errorSummaryElement).not.toBeInTheDocument();
  });
});
