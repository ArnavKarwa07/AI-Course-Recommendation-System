import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import ChatBot from "./components/Layout/ChatBot";

export default function App({ children }) {
  const { empId } = useAuth();

  // "null", 0 or empty string => force login
  if (!empId || empId === "") return <Navigate to="/login" replace />;

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
      <ChatBot />
    </div>
  );
}
