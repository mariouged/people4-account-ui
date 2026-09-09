import { Link } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { signout } from '../services/api';

function SignOut({ setAccount }) {

  useEffect(() => {
    signout();
    setAccount(null);
  }, []);

  return (
    <div className="sign-out">
      <h3>You have been signed out.</h3>
      <p>
        <Link to="/sign/organization">Login again</Link>
      </p>
    </div>
  );
}

export default SignOut;