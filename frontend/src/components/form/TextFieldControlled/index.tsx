import React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
} from 'react-hook-form';
import TextInput, { TextInputProps } from '../../inputs/TextInput';
import { filterLetters, filterNumbers } from '../../../utils/inputFilters';

export interface TextFieldControlledProps<T extends FieldValues>
  extends Omit<TextInputProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'ref'> {
  name: Path<T>;
  control: Control<T>;
  inputFilterType?: 'numbers' | 'letters';
}

export function TextFieldControlled<T extends FieldValues>({
  name,
  control,
  label,
  inputFilterType,
  ...rest
}: TextFieldControlledProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { onChange, ...fieldRest } = field;

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          let { value } = event.target;

          if (inputFilterType === 'numbers') {
            value = filterNumbers(value);
          } else if (inputFilterType === 'letters') {
            value = filterLetters(value);
          }

          onChange(value);
        };

        return (
          <TextInput
            {...rest}
            {...fieldRest}
            onChange={handleChange}
            label={label}
            error={fieldState.error?.message as string | undefined}
          />
        );
      }}
    />
  );
}

