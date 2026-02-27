import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';

const mockChangeLanguage = vi.fn().mockResolvedValue(undefined);
const mockT = vi.fn((key: string) => (key === 'language.es' ? 'Español' : key === 'language.en' ? 'Inglés' : key));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: {
      language: 'es',
      changeLanguage: mockChangeLanguage,
    },
  }),
  initReactI18next: { type: '3rdParty' },
}));

const mockUpdateProfile = vi.fn().mockResolvedValue(undefined);
vi.mock('../../src/services/authService', () => ({
  authService: {
    updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  },
}));

const mockUseAuth = vi.fn().mockReturnValue({ user: null });
vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: null });
    (global as unknown as { localStorage: Storage }).localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
  });

  it('renders select with current language options', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Inglés')).toBeInTheDocument();
  });

  it('calls i18n.changeLanguage when selecting another language', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.selectOptions(screen.getByRole('combobox'), 'en');

    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  it('stores selected language in localStorage', async () => {
    const setItem = vi.fn();
    (global as unknown as { localStorage: Storage }).localStorage = {
      ...(global as unknown as { localStorage: Storage }).localStorage,
      setItem,
    };

    const user = userEvent.setup();
    render(<LanguageSwitcher />);
    await user.selectOptions(screen.getByRole('combobox'), 'en');

    expect(setItem).toHaveBeenCalled();
  });

  it('calls authService.updateProfile with lang when user is logged in', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        name: 'John',
        lastname: 'Doe',
        email: 'j@t.com',
        document: '1',
        phone: '1',
        lang: 'es',
        role: 'USER',
      },
    });

    const user = userEvent.setup();
    render(<LanguageSwitcher />);
    await user.selectOptions(screen.getByRole('combobox'), 'en');

    await vi.waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({ lang: 'en' });
    });
  });
});
