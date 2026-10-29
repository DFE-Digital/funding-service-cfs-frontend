import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DateInput } from '../../components/DateInput';

describe('<DateInput />', () => {
  const mockCallback = jest.fn();

  beforeEach(() => {
    mockCallback.mockClear();
  });

  it('renders with the correct heading label', () => {
    render(<DateInput date={new Date(0)} callback={mockCallback} inputName="DateInputTest" />);
    const labelElement = screen.getByText(/day/i);
    expect(labelElement).toBeInTheDocument();
  });

  it('renders with the correct input', () => {
    render(<DateInput date={new Date('1970-01-01')} callback={mockCallback} inputName="DateInputTest" />);  
    const inputElement = screen.getByLabelText(/day/i)
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('id', 'DateInputTest');
    expect(inputElement).toHaveAttribute('type', 'date');
  });
});
