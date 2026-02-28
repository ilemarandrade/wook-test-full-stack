import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../src/context/AuthContext';

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

export interface AllTheProvidersOptions {
  queryClient?: QueryClient;
  initialEntries?: MemoryRouterProps['initialEntries'];
  withAuth?: boolean;
}

function createWrapper(options: AllTheProvidersOptions = {}) {
  const {
    queryClient = defaultQueryClient,
    initialEntries = ['/'],
    withAuth = false,
  } = options;

  return function AllTheProviders({ children }: { children: React.ReactNode }) {
    const content = withAuth ? (
      <AuthProvider>{children}</AuthProvider>
    ) : (
      children
    );

    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{content}</MemoryRouter>
      </QueryClientProvider>
    );
  };
}

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  initialEntries?: MemoryRouterProps['initialEntries'];
  withAuth?: boolean;
}

/**
 * Custom render que envuelve el componente con QueryClientProvider,
 * MemoryRouter y opcionalmente AuthProvider.
 *
 * @example
 * // Solo router + query (Register, UserList)
 * renderWithProviders(<Register />);
 *
 * @example
 * // Con AuthProvider (Login, Profile)
 * renderWithProviders(<Login />, { withAuth: true });
 *
 * @example
 * // Con ruta inicial
 * renderWithProviders(<Profile />, { withAuth: true, initialEntries: ['/profile'] });
 */
function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): ReturnType<typeof render> {
  const { queryClient, initialEntries, withAuth, ...renderOptions } = options;

  const Wrapper = createWrapper({
    queryClient,
    initialEntries,
    withAuth,
  });

  return render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });
}

// Re-exportar todo de testing-library para poder importar desde un solo sitio
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Sobrescribir render con nuestro custom render
export { customRender as render };

// Exportar para tests que necesiten un QueryClient propio
export { defaultQueryClient, createWrapper };
