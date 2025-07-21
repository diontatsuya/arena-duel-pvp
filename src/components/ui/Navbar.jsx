// src/components/ui/Navbar.jsx
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Arena Duel
      </Link>
      <div className="space-x-4">
        <Link
          to="/arena-pvp"
          className={`hover:underline ${
            pathname === "/arena-pvp" ? "font-bold text-blue-400" : ""
          }`}
        >
          PvP
        </Link>
        <Link
          to="/arena-pve"
          className={`hover:underline ${
            pathname === "/arena-pve" ? "font-bold text-green-400" : ""
          }`}
        >
          PvE
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
