import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { CircularReferenceErrorSummary } from '../../components/CircularReferenceErrorSummary';
import { CircularReferenceError } from '../../types/Calculations/CircularReferenceError';

describe('<CircularReferenceErrorSummary>', () => {
  it('does not render when there are no circular reference errors', () => {
    const { container } = render(
      <MemoryRouter>
        <CircularReferenceErrorSummary errors={[]} defaultSize={3} />
      </MemoryRouter>
    );
    expect(container.querySelector('.govuk-error-summary')).toBeNull();
  });

  it('renders when there are circular reference errors', () => {
    const { container } = render(
      <MemoryRouter>
        <CircularReferenceErrorSummary errors={mockCircularReferenceErrors} defaultSize={3} />
      </MemoryRouter>
    );
    expect(container.querySelector('.govuk-error-summary')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /show more/i })).toBeNull();
  });

  it('renders "show more" button when there are more errors than default size', () => {
    const { container } = render(
      <MemoryRouter>
        <CircularReferenceErrorSummary errors={mockCircularReferenceErrors} defaultSize={1} />
      </MemoryRouter>
    );
    expect(container.querySelector('.govuk-error-summary')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3); // Initial size

    fireEvent.click(screen.getByRole('button', { name: /show more/i }));
    expect(screen.getAllByRole('listitem')).toHaveLength(4); 
  });

  it('displays all links when "show more" button is clicked', () => {
    const { container } = render(
      <MemoryRouter>
        <CircularReferenceErrorSummary errors={mockCircularReferenceErrors} defaultSize={1} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /show more/i }));
    const linkElements = screen.getAllByRole('link');
    expect(linkElements).toHaveLength(3); // All links should be rendered
  });
});

const mockCircularReferenceErrors: CircularReferenceError[] = [
  {
    node: {
      calculationid: 'f3d3fa7a-df89-445c-b150-2cece75de664',
      specificationId: '36e5c7db-45a1-400a-b436-700f8d512650',
      calculationName: 'Total Allocation',
      calculationType: 'Template',
      fundingStream: 'PSG',
    },
    relationships: [
      {
        source: {
          calculationid: 'f3d3fa7a-df89-445c-b150-2cece75de664',
          specificationId: '36e5c7db-45a1-400a-b436-700f8d512650',
          calculationName: 'Total Allocation',
          calculationType: 'Template',
          fundingStream: 'PSG',
        },
        target: {
          calculationid: 'b58b38d7-60a6-48c7-8cf9-50e7737a5016',
          specificationId: '36e5c7db-45a1-400a-b436-700f8d512650',
          calculationName: 'Pupil rate threshold',
          calculationType: 'Template',
          fundingStream: 'PSG',
        },
      },
    ],
  },
  {
    node: {
      calculationid: 'b58b38d7-60a6-48c7-8cf9-50e7737a5016',
      specificationId: '36e5c7db-45a1-400a-b436-700f8d512650',
      calculationName: 'Pupil rate threshold',
      calculationType: 'Template',
      fundingStream: 'PSG',
    },
    relationships: [
      {
        source: {
          calculationid: 'b58b38d7-60a6-48c7-8cf9-50e7737a5016',
          specificationId: '36e5c7db-45a1-400a-b436-700f8d512650',
          calculationName: 'Pupil rate threshold',
          calculationType: 'Template',
          fundingStream: 'PSG',
        },
        target: {
          calculationid: '9995b57e-1033-4f54-a4e2-d5b3cb691353',
          specificationId: '36e5c7db-45a1-400a-b436-700f8d512650',
          calculationName: 'Eligible Pupils',
          calculationType: 'Template',
          fundingStream: 'PSG',
        },
      },
    ],
  },
  {
    node: {
      calculationid: '9995b57e-1033-4f54-a4e2-d5b3cb691353',
      specificationId: '36e5c7db-45a1-400a-b436-700f8d512650',
      calculationName: 'Eligible Pupils',
      calculationType: 'Template',
      fundingStream: 'PSG',
    },
    relationships: [
      {
        source: {
          calculationid: '9995b57e-1033-4f54-a4e2-d5b3cb691353',
          specificationId: '36e5c7db-45a1-400a-b436-700f8d512650',
          calculationName: 'Eligible Pupils',
          calculationType: 'Template',
          fundingStream: 'PSG',
        },
        target: {
          calculationid: 'f3d3fa7a-df89-445c-b150-2cece75de664',
          specificationId: '36e5c7db-45a1-400a-b436-700f8d512650',
          calculationName: 'Total Allocation',
          calculationType: 'Template',
          fundingStream: 'PSG',
        },
      },
    ],
  },
];
