import { Link, useNavigate } from "react-router";
import { Button, SecondaryButton } from "../components/Buttons";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Header from "../components/Header";

export default function Inbox() {
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user?.receivingPaused) {
      setLoading(true);
      auth
        .changeSettings({ receivingPaused: false })
        .then(() => {
          setLoading(false);
        })
        .catch();
    }
  }, []);
  if (loading) return <Loading />;
  return (
    <>
      <Header />
    </>
  );
}
