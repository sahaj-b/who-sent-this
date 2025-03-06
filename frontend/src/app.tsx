import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Send from "./pages/Send";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import Private from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
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
            <Route
              path="/dashboard"
              element={<Private component={<Dashboard />} />}
            />
            <Route path="/send" element={<Private component={<Send />} />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <ToastContainer autoClose={4000} theme="dark" />
    </>
  );
}
