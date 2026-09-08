import { Link } from 'react-router-dom';

function NavSign() {
  return (
    <nav>
      <Link to="/organization">Login</Link>
      <Link to="/signin">Sign In</Link>
      <Link to="/signup">Sign Up</Link>
    </nav>
  );
}

export default NavSign;