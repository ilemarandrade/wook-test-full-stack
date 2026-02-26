import React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
} from 'react-hook-form';
import TextInput, { TextInputProps } from '../../inputs/TextInput';

export interface TextFieldControlledProps<T extends FieldValues>
  extends Omit<TextInputProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'ref'> {
  name: Path<T>;
  control: Control<T>;
}

export function TextFieldControlled<T extends FieldValues>({
  name,
  control,
  label,
  ...rest
}: TextFieldControlledProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextInput
          {...rest}
          {...field}
          label={label}
          error={fieldState.error?.message as string | undefined}
        />
      )}
    />
  );
}
