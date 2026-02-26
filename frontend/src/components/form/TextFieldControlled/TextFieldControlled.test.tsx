import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextFieldControlled } from './index';

interface TestFormValues {
  email: string;
}

const TestForm: React.FC<{ onSubmit: SubmitHandler<TestFormValues> }> = ({
  onSubmit,
}) => {
  const { control, handleSubmit } = useForm<TestFormValues>({
    defaultValues: { email: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextFieldControlled<TestFormValues>
        name="email"
        control={control}
        label="Email"
        type="email"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('TextFieldControlled', () => {
  it('integrates with react-hook-form and submits value', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<TestForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.click(screen.getByText('Submit'));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      { email: 'test@example.com' },
      expect.anything()
    );
  });
});
