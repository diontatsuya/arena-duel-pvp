import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">Halaman yang kamu cari tidak tersedia.</p>
      <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;
