import { Link } from 'react-router-dom';
import { useCallback } from 'react';
import { signout } from '../services/api';

function SignOut() {

  useCallback(() => {
    signout();
  }, []);

  return (
    <div className="sign-out">
      <h3>You have been signed out.</h3>
      <p>
        <Link to="/signin">Sign in again</Link>
      </p>
    </div>
  );
}

export default SignOut;