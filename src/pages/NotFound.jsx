import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Halaman tidak ditemukan.</p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;
