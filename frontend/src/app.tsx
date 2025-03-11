import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Send from "./pages/Send";
import { ToastContainer } from "react-toastify";
import Inbox from "./pages/Inbox";
import Private from "./components/Private";
import Reply from "./pages/Reply";
import Error404 from "./pages/Error404";
import { useEffect } from "react";
import { loadIcons } from "@iconify/react/dist/iconify.js";

export default function App() {
  useEffect(
    () =>
      loadIcons([
        "tabler:copy-check",
        "svg-spinners:3-dots-move",
        "svg-spinners:90-ring-with-bg",
        "svg-spinners:pulse-rings-2",
        "mdi:eye-off",
      ]),
    [],
  );
  return (
    <div className="font-[Funnel_Sans] bg-background min-h-screen">
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
              element={<Private component={<Send />} allowAnonymous />}
            />
            <Route
              path="/reply/:id"
              element={<Private component={<Reply />} allowAnonymous />}
            />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <ToastContainer autoClose={4000} theme="dark" />
    </div>
  );
}
