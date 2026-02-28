import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import PasswordInput, { PasswordInputProps } from '../../inputs/PasswordInput';

export interface PasswordFieldControlledProps<
  T extends FieldValues,
> extends Omit<
  PasswordInputProps,
  'name' | 'value' | 'onChange' | 'onBlur' | 'ref'
> {
  name: Path<T>;
  control: Control<T>;
}

export function PasswordFieldControlled<T extends FieldValues>({
  name,
  control,
  label,
  ...rest
}: PasswordFieldControlledProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <PasswordInput
          {...rest}
          {...field}
          label={label}
          error={fieldState.error?.message as string | undefined}
        />
      )}
    />
  );
}
