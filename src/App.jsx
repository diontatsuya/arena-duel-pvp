import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <AppRoutes />
      </div>
    </Router>
  );
};

export default App;
