import { Link } from 'react-router-dom';

function NavMenu() {
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/signout">Sign Out</Link>
    </nav>
  );
}

export default NavMenu;