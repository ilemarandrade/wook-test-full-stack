import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { UserFilterValues } from '../../hooks/users/useUserFilters';
import { INITIAL_FILTERS } from '../../hooks/users/useUserFilters';
import { TextFieldControlled } from '../form/TextFieldControlled';
import { Button } from '../ui/Button';

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
          maxLength={25}
          inputFilterType="letters"
        />
        <TextFieldControlled
          name="document"
          control={control}
          label="Document"
          placeholder="Document"
          maxLength={20}
          inputFilterType="numbers"
        />
        <TextFieldControlled
          name="phone"
          control={control}
          label="Phone"
          placeholder="Phone"
          maxLength={20}
          inputFilterType="numbers"
        />
        <div className="grid grid-cols-2 items-end gap-2">
          {onReset && (
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
          <Button type="submit" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>
    </form>
  );
};

