import { createContext, useState } from 'react';

const INITIAL_ACCOUNT = {
    apiKey: '508e022c1168f5b7eca80003e8e5991a4ddabd64a7337ceed56f54ce26a946a0',
    domain: 'example.com',
    legalName: 'Example Inc.',
    vatId: 'EU123456789',
};

const AccountContext = createContext(INITIAL_ACCOUNT);

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(INITIAL_ACCOUNT);

  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
}

export default AccountContext;