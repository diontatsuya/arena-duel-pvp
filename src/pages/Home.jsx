// src/pages/Home.jsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import arenaBg from "../assets/arena-bg.jpg"; // Pastikan kamu sudah upload gambar ke src/assets/

const Home = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${arenaBg})` }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <motion.div
        className="relative z-10 text-white text-center px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Arena Duel Turn-Based
        </h1>
        <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-xl mx-auto">
          Choose your game mode and enter the battle arena!
        </p>
        <motion.div
          className="flex flex-col md:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <Link
            to="/arena-pvp"
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-2xl shadow-lg transition duration-300"
          >
            Player vs Player
          </Link>
          <Link
            to="/arena-pve"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg transition duration-300"
          >
            Player vs AI
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
