import { Link } from 'react-router-dom';

function NavSign() {
  return (
    <nav>
      <Link to="/sign/organization">Login</Link>
      <Link to="/signup">Sign Up</Link>
    </nav>
  );
}

export default NavSign;