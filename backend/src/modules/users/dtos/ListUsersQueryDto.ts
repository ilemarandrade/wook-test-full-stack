export interface ListUsersQueryDto {
  page?: number;
  pageSize?: number;
  name?: string;
  document?: string;
  phone?: string;
}

/**
 * Mapea la query validada por express-validator a ListUsersQueryDto.
 * Normaliza page y pageSize a números y filtra solo campos permitidos.
 */
export function toListUsersQueryDto(query: unknown): ListUsersQueryDto {
  const q = query as {
    page?: unknown;
    pageSize?: unknown;
    name?: unknown;
    document?: unknown;
    phone?: unknown;
  };

  const rawPage = q.page as unknown;
  const rawPageSize = q.pageSize as unknown;

  const pageNumber =
    typeof rawPage === 'number'
      ? rawPage
      : rawPage !== undefined
      ? Number(rawPage)
      : undefined;
  const pageSizeNumber =
    typeof rawPageSize === 'number'
      ? rawPageSize
      : rawPageSize !== undefined
      ? Number(rawPageSize)
      : undefined;

  return {
    page:
      pageNumber !== undefined && !Number.isNaN(pageNumber)
        ? pageNumber
        : undefined,
    pageSize:
      pageSizeNumber !== undefined && !Number.isNaN(pageSizeNumber)
        ? pageSizeNumber
        : undefined,
    name: typeof q.name === 'string' ? q.name : undefined,
    document: typeof q.document === 'string' ? q.document : undefined,
    phone: typeof q.phone === 'string' ? q.phone : undefined,
  };
}
