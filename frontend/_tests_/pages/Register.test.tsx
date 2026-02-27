import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test-utils';
import Register from '../../src/pages/Register';

const renderRegister = () => render(<Register />);

describe('Register page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders register form with required fields', () => {
    renderRegister();
    expect(screen.getByLabelText(/nombre|name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email|correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/documento|document/i)).toBeInTheDocument();
    const passwordFields = screen.getAllByLabelText(/password|contraseña|confirmar/i);
    expect(passwordFields.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /registrarse|register/i })).toBeInTheDocument();
  });

  it('shows link to login', () => {
    renderRegister();
    expect(screen.getByText(/ya tienes cuenta|already have an account|iniciar sesión/i)).toBeInTheDocument();
  });
});
