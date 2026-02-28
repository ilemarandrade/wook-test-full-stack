import { useState } from 'react';

export interface UserFilterValues {
  name: string;
  document: string;
  phone: string;
}

export interface UseUserFiltersResult {
  appliedFilters: UserFilterValues;
  applyFilters: (values: UserFilterValues) => void;
  clearFilters: () => void;
}

export const INITIAL_FILTERS: UserFilterValues = {
  name: '',
  document: '',
  phone: '',
};

export function useUserFilters(): UseUserFiltersResult {
  const [appliedFilters, setAppliedFilters] = useState<UserFilterValues>(INITIAL_FILTERS);

  const applyFilters = (values: UserFilterValues) => {
    setAppliedFilters(values);
  };

  const clearFilters = () => {
    setAppliedFilters(INITIAL_FILTERS);
  };

  return {
    appliedFilters,
    applyFilters,
    clearFilters,
  };
}

