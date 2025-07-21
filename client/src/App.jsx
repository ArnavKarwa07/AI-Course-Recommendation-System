import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";

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
