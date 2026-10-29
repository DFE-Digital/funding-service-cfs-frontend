import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Section } from '../../types/Sections';

describe('<Header>', () => {
  it('shows the Beta panel', () => {
    render(
      <MemoryRouter>
        <Header location={Section.Home} />
      </MemoryRouter>
    )
    const betaPanel = screen.getByText('beta', { selector: 'strong.govuk-tag.govuk-phase-banner__content__tag' });
    expect(betaPanel).toBeInTheDocument();
  });

  it('shows header feedback string', () => {
    render(
      <MemoryRouter>
        <Header location={Section.Home} />
      </MemoryRouter>
    );
    const serviceNameLink =screen.getByText(/this is a new service – your will help us to improve it\./i)
    expect(serviceNameLink).toBeInTheDocument();
});

  it('shows beta in the logotype text area', () => {
    render(
      <MemoryRouter>
        <Header location={Section.Home} />
      </MemoryRouter>
    );
    const govUkLogotype = screen.getByText(/beta/i)
    expect(govUkLogotype).toBeInTheDocument();
  });
});
