import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { UserFilterValues } from '../../hooks/users/useUserFilters';
import { INITIAL_FILTERS } from '../../hooks/users/useUserFilters';
import { TextFieldControlled } from '../form/TextFieldControlled';

interface UserFilterFormProps {
  initialValues: UserFilterValues;
  onSearch: (values: UserFilterValues) => void;
  onReset?: () => void;
  isSearching?: boolean;
}

export const UserFilterForm: React.FC<UserFilterFormProps> = ({
  initialValues,
  onSearch,
  onReset,
  isSearching,
}) => {
  const { control, handleSubmit, reset } = useForm<UserFilterValues>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleSearchSubmit = (values: UserFilterValues) => {
    onSearch(values);
  };

  const handleClear = () => {
    reset(INITIAL_FILTERS);
    if (onReset) {
      onReset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSearchSubmit)}
      className="mb-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4"
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <TextFieldControlled
          name="name"
          control={control}
          label="Name"
          placeholder="Name"
        />
        <TextFieldControlled
          name="document"
          control={control}
          label="Document"
          placeholder="Document"
        />
        <TextFieldControlled
          name="phone"
          control={control}
          label="Phone"
          placeholder="Phone"
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={isSearching}
          className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:bg-slate-600"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
        {onReset && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center rounded-md border border-slate-600 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
};

