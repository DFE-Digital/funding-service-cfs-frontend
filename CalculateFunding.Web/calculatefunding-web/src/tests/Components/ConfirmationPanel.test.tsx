import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import { ConfirmationPanel } from '../../components/ConfirmationPanel';

describe('<ConfirmationPanel />', () => {
  it('renders a panel with the title as expected', () => {
    render(<ConfirmationPanel title="Test title" children="Test body" hidden={false} />); 
    const titleElement = screen.getByRole('heading', { level: 1, name: /test title/i });
    expect(titleElement).toBeInTheDocument();
  });

  it('renders a panel with the body as expected', () => {
    render(<ConfirmationPanel title="Test title" children="Test body" hidden={false} />);
    const bodyElement = screen.getByText(/test body/i);
    expect(bodyElement).toBeInTheDocument();
  });

  it('hides itself when passed a true in hidden prop', () => {
    render(<ConfirmationPanel title="Test title" children="Test body" hidden={true} />);
    const panelElement = screen.getByTestId('confirmation-panel');
    expect(panelElement).toBeInTheDocument();
    expect(panelElement).toHaveAttribute('hidden');
  });
});