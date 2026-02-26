import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PasswordFieldControlled } from './index';

interface TestFormValues {
  password: string;
}

const TestForm: React.FC<{ onSubmit: SubmitHandler<TestFormValues> }> = ({
  onSubmit,
}) => {
  const { control, handleSubmit } = useForm<TestFormValues>({
    defaultValues: { password: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PasswordFieldControlled<TestFormValues>
        name="password"
        control={control}
        label="Password"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('PasswordFieldControlled', () => {
  it('submits controlled password value', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<TestForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText('Password'), 'secret123');
    await user.click(screen.getByText('Submit'));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      { password: 'secret123' },
      expect.anything()
    );
  });
});
