import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { loadIcons } from "@iconify/react/dist/iconify.js";
import AppRoutes from "./routes/AppRoutes";

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
        <AppRoutes />
      </AuthProvider>
      <ToastContainer autoClose={3000} theme="dark" />
    </div>
  );
}
