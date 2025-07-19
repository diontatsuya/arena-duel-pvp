// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#111' }}>
      <Link to="/" style={{ margin: '0 1rem', color: '#fff' }}>Home</Link>
      <Link to="/arena-pvp" style={{ margin: '0 1rem', color: '#fff' }}>Arena PVP</Link>
      <Link to="/arena-pve" style={{ margin: '0 1rem', color: '#fff' }}>Arena PVE</Link>
    </nav>
  );
};

export default Navbar;
