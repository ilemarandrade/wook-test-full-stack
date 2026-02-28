import React from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '../../context/AuthContext';
import type { PageSizeOption } from '../../hooks/users/useUserTableState';
import { Button } from '../ui/Button';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  errorMessage?: string;
  page: number;
  pageSize: PageSizeOption;
  total: number;
  pageSizeOptions: readonly PageSizeOption[];
  nextPage?: number;
  prevPage?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: PageSizeOption) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  errorMessage,
  page,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  nextPage,
  prevPage,
}) => {
  const { t } = useTranslation();
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;

  const handlePrevious = () => {
    prevPage && onPageChange(prevPage);
  };

  const handleNext = () => {
    nextPage && onPageChange(nextPage);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-300">
                {t('users.table.name')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-300">
                {t('users.table.lastname')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-300">
                {t('users.table.email')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-300">
                {t('users.table.document')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-300">
                {t('users.table.phone')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-300">
                {t('users.table.role')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950/40">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-400"
                >
                  {t('users.table.loading')}
                </td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-red-400"
                >
                  {errorMessage}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-400"
                >
                  {t('users.table.noUsers')}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-100">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-100">
                    {user.lastname}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-100">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-100">
                    {user.document}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-100">
                    {user.phone}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-100">
                    {user.role}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-800 bg-slate-900/80 px-4 py-3 text-xs text-slate-300 md:flex-row">
        <div className="flex items-center gap-2">
          <span>{t('users.table.rowsPerPage')}</span>
          <select
            value={pageSize}
            onChange={(e) =>
              onPageSizeChange(Number(e.target.value) as PageSizeOption)
            }
            className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handlePrevious}
            disabled={!prevPage}
            variant="pagination"
          >
            {t('users.table.previous')}
          </Button>
          <span>
            {t('users.table.page')}{' '}
            <span className="font-semibold">{total === 0 ? 0 : page}</span>{' '}
            {t('users.table.of')}{' '}
            <span className="font-semibold">
              {total === 0 ? 0 : totalPages}
            </span>
          </span>
          <Button
            type="button"
            onClick={handleNext}
            disabled={!nextPage}
            variant="pagination"
          >
            {t('users.table.next')}
          </Button>
        </div>
        <div className="text-xs text-slate-400">
          {t('users.table.totalUsers')}{' '}
          <span className="font-semibold text-slate-200">{total}</span>
        </div>
      </div>
    </div>
  );
};
