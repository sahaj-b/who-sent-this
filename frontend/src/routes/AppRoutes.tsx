import { BrowserRouter, Route, Routes } from "react-router";
import Register from "../pages/Register";
import Private from "../components/Private";
import Questions from "../pages/Questions";
import QuestionReplies from "../pages/QuestionReplies";
import Send from "../pages/Send";
import Error404 from "../pages/Error404";
import Reply from "../pages/Reply";
import Settings from "../pages/Settings";
import Inbox from "../pages/Inbox";
import Home from "../pages/Home";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
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
          path="/questions"
          element={<Private component={<Questions />} />}
        />
        <Route
          path="/replies/:id"
          element={<Private component={<QuestionReplies />} />}
        />
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
  );
}
