import React, { useState } from 'react';
import TextInput, { TextInputProps } from '../TextInput';
import EyeClosedIcon from '../../../icons/EyeClosedIcon';
import EyeIcon from '../../../icons/EyeIcon';

export interface PasswordInputProps extends Omit<
  TextInputProps,
  'type' | 'error'
> {
  error?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = '', ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="flex flex-col gap-1">
        <div className="relative">
          <TextInput
            ref={ref}
            label={label}
            type={showPassword ? 'text' : 'password'}
            className={className}
            {...rest}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 bottom-0 flex items-center text-xs text-slate-400 hover:text-slate-200 h-[37px]"
            tabIndex={-1}
          >
            {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
