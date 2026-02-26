import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextInput from './index';

describe('TextInput', () => {
  it('renders label and input', () => {
    render(
      <TextInput
        label="Email"
        name="email"
        defaultValue="test@example.com"
      />
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(
      (screen.getByLabelText('Email') as HTMLInputElement).value
    ).toBe('test@example.com');
  });

  it('renders error message', () => {
    render(
      <TextInput
        label="Email"
        name="email"
        error="Required"
      />
    );

    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
