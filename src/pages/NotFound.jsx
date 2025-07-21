import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
      <h1 className="text-5xl font-bold text-red-500">404</h1>
      <p className="text-xl">Halaman tidak ditemukan.</p>
      <Link
        to="/"
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;
