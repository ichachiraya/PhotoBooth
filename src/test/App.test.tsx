import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { I18nProvider } from '../i18n/useI18n';

describe('App', () => {
  it('renders the step indicator and app name', () => {
    render(
      <I18nProvider>
        <App />
      </I18nProvider>,
    );
    expect(screen.getByText('Photo Booth')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Progress' })).toBeInTheDocument();
  });
});
