import { createContext } from 'react';

const INITIAL_ACCOUNT = {
    apiKey: '',
    domain: '',
    legalName: '',
    vatId: '',
};

const AccountContext = createContext(INITIAL_ACCOUNT);

export function createAccountContext(account) {
  const AccountContext = createContext(account);
}
