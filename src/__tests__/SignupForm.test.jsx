import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SignupForm from '../components/SignupForm';
import * as api from '../services/api';

vi.mock('../services/api');

const renderSignupForm = () =>
  render(
    <MemoryRouter>
      <SignupForm />
    </MemoryRouter>
  );

const VALID_DATA = {
  legalName: 'Acme Corp Ltd.',
  vatId: 'EU123456789',
  domain: 'acme.com',
  email: 'admin@acme.com',
  password: 'SecurePass1',
};

const fillValidForm = async (user) => {
  await user.type(screen.getByLabelText(/legal name/i), VALID_DATA.legalName);
  await user.type(screen.getByLabelText(/vat id/i), VALID_DATA.vatId);
  await user.type(screen.getByLabelText(/domain/i), VALID_DATA.domain);
  await user.type(screen.getByLabelText(/email/i), VALID_DATA.email);
  await user.type(screen.getByLabelText(/password/i), VALID_DATA.password);
};

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all required form fields', () => {
    renderSignupForm();
    expect(screen.getByLabelText(/legal name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vat id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/domain/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting an empty form', async () => {
    const user = userEvent.setup();
    renderSignupForm();

    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/legal name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/vat id is required/i)).toBeInTheDocument();
    expect(screen.getByText(/domain is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows email format validation error', async () => {
    const user = userEvent.setup();
    renderSignupForm();

    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it('shows password minimum length validation error', async () => {
    const user = userEvent.setup();
    renderSignupForm();

    await user.type(screen.getByLabelText(/password/i), 'short');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it('calls the signup API with correct field values on valid submit', async () => {
    api.signup.mockResolvedValueOnce({ success: true, message: 'Account created.' });
    const user = userEvent.setup();
    renderSignupForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() =>
      expect(api.signup).toHaveBeenCalledWith(VALID_DATA)
    );
  });

  it('disables submit button and shows loading text while request is pending', async () => {
    let resolve;
    api.signup.mockImplementationOnce(() => new Promise((res) => { resolve = res; }));
    const user = userEvent.setup();
    renderSignupForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /create account/i }));

    const loadingBtn = await screen.findByRole('button', { name: /creating account/i });
    expect(loadingBtn).toBeDisabled();

    resolve({ success: true, message: 'Done' });
  });

  it('shows success alert after successful signup', async () => {
    api.signup.mockResolvedValueOnce({ success: true, message: 'Account created. Please sign in.' });
    const user = userEvent.setup();
    renderSignupForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/account created/i);
  });

  it('shows error alert when the API rejects', async () => {
    api.signup.mockRejectedValueOnce(new Error('Email already registered'));
    const user = userEvent.setup();
    renderSignupForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/email already registered/i);
  });

  it('clears a field validation error once the user starts typing', async () => {
    const user = userEvent.setup();
    renderSignupForm();

    await user.click(screen.getByRole('button', { name: /create account/i }));
    expect(await screen.findByText(/legal name is required/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/legal name/i), 'A');
    expect(screen.queryByText(/legal name is required/i)).not.toBeInTheDocument();
  });

  it('does not call the API when validation fails', async () => {
    const user = userEvent.setup();
    renderSignupForm();

    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(api.signup).not.toHaveBeenCalled();
  });
});
