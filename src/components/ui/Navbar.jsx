import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        Arena Duel
      </Link>
      <div className="space-x-4">
        <Link to="/arena-pvp" className="hover:text-purple-400">
          PvP
        </Link>
        <Link to="/arena-pve" className="hover:text-blue-400">
          PvE
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
