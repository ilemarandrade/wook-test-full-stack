import React from 'react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, id, error, className = '', ...rest }, ref) => {
    const inputId = id ?? rest.name?.toString();

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm text-slate-200">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${className}`}
          {...rest}
        />
        {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
