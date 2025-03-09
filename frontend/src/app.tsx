import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Send from "./pages/Send";
import { ToastContainer } from "react-toastify";
import Inbox from "./pages/Inbox";
import Private from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="font-[Funnel_Sans] bg-background h-screen">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/settings"
              element={<Private component={<Settings />} />}
            />
            <Route path="/inbox" element={<Private component={<Inbox />} />} />
            <Route
              path="/send/:id"
              element={<Private component={<Send />} />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <ToastContainer autoClose={4000} theme="dark" />
    </div>
  );
}
