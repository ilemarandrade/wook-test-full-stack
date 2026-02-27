import { useState } from 'react';

export interface UserFilterValues {
  name: string;
  document: string;
  phone: string;
}

export interface UseUserFiltersResult {
  appliedFilters: UserFilterValues;
  searchVersion: number;
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
  const [searchVersion, setSearchVersion] = useState(0);

  const applyFilters = (values: UserFilterValues) => {
    setAppliedFilters(values);
    setSearchVersion((prev) => prev + 1);
  };

  const clearFilters = () => {
    setAppliedFilters(INITIAL_FILTERS);
    setSearchVersion((prev) => prev + 1);
  };

  return {
    appliedFilters,
    searchVersion,
    applyFilters,
    clearFilters,
  };
}

