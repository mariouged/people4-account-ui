import { createContext } from 'react';

const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

export const AuthenticatedContext = createContext(isAuthenticated);
