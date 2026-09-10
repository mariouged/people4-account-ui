import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { signoutApi } from '../services/signoutApi';

function SignOut({ account, setAccount }) {

  useEffect(() => {
    signoutApi(account);
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