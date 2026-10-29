import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingFieldStatus } from '../../components/LoadingFieldStatus';

describe('<LoadingFieldStatus />', () => {
  it('renders a loading status', () => {
    render(<LoadingFieldStatus id="testLoading" title="test title" />);
    const actual = screen.getByRole('alert', { name: 'test title' });
    expect(actual).toBeInTheDocument();
    expect(actual).toHaveAttribute('id', 'testLoading');
    expect(actual.children.length).toBe(1);
  });

  it('has the correct description', () => {
    render(<LoadingFieldStatus title="test title" hidden={false} />);
    const actual = screen.getByText('test title', { selector: '.loader-text' });
    expect(actual).toBeInTheDocument();
    expect(actual).toHaveTextContent('test title');
  });

  it('hides component given hidden property is set to true', () => {
    render(<LoadingFieldStatus id="testLoading" title="test title" hidden={true} />);
    const actual = screen.getByRole('alert', { name: 'test title' }).querySelector('span');
    expect(actual).toBeInTheDocument();
    expect(actual).toHaveAttribute('hidden');
  });
});
