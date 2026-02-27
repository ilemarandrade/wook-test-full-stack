import React from 'react';
import { getApiErrorMessage } from '../config/axiosInstance';
import { useUserTableState } from '../hooks/users/useUserTableState';
import { useUserFilters, type UserFilterValues } from '../hooks/users/useUserFilters';
import { useUserListQuery } from '../hooks/api';
import { UserFilterForm } from '../components/users/UserFilterForm';
import { UserTable } from '../components/users/UserTable';

const UserList: React.FC = () => {
  const { page, pageSize, setPage, setPageSize, pageSizeOptions } = useUserTableState();
  const {
    appliedFilters,
    searchVersion,
    applyFilters,
    clearFilters,
  } = useUserFilters();

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useUserListQuery({
    page,
    pageSize,
    filters: appliedFilters,
    searchVersion,
  });

  const errorMessage = error ? getApiErrorMessage(error) : undefined;

  const handleSearch = (values: UserFilterValues) => {
    setPage(1);
    applyFilters(values);
  };

  const handleReset = () => {
    setPage(1);
    clearFilters();
  };

  return (
    <div className="min-h-screen bg-slate-950/90 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-slate-50">Users</h1>
        
        </div>

        <UserFilterForm
          initialValues={appliedFilters}
          onSearch={handleSearch}
          onReset={handleReset}
          isSearching={isFetching && !isLoading}
        />

        <UserTable
          nextPage={data?.nextPage}
          prevPage={data?.prevPage}
          users={data?.users ?? []}
          isLoading={isLoading}
          errorMessage={errorMessage}
          page={data?.page ?? page}
          pageSize={pageSize}
          total={data?.itemsTotal ?? 0}
          pageSizeOptions={pageSizeOptions}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};

export default UserList;

