import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordInput from './index';

describe('PasswordInput', () => {
  it('toggles visibility when clicking show/hide', async () => {
    const user = userEvent.setup();

    render(
      <PasswordInput
        label="Password"
        name="password"
        defaultValue="secret"
      />
    );

    const input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');

    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);
    expect(input.type).toBe('text');

    await user.click(toggleButton);
    expect(input.type).toBe('password');
  });

  it('renders error message', () => {
    render(
      <PasswordInput
        label="Password"
        name="password"
        error="Too short"
      />
    );

    expect(screen.getByText('Too short')).toBeInTheDocument();
  });
});
