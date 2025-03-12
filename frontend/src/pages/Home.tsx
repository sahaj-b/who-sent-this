import { useNavigate } from "react-router";
import { Button, SecondaryButton } from "../components/Buttons";
import { useAuth } from "../context/AuthContext";
import WhoSentThis from "../components/WST";
import ProfileButton from "../components/ProfileButton";
import { useState } from "react";
import { toastifyAndThrowError } from "../utils/errorHandler";
import { Icon } from "@iconify/react/dist/iconify.js";
import GlowDrop from "../components/GlowDrop";
export default function Home() {
  const auth = useAuth();
  const [buttonLoading, setButtonLoading] = useState(false);
  const navigate = useNavigate();

  async function handleClick() {
    setButtonLoading(true);
    window.localStorage.setItem("accountOrReceiver", "true");
    if (!auth.user) {
      await auth.registerAnonymous().catch((e) => {
        setButtonLoading(false);
        toastifyAndThrowError(e);
      });
    }
    if (auth.user) {
      if (!auth.user?.receivingPaused) {
        navigate("/inbox");
      } else {
        await auth.changeSettings({ receivingPaused: false }).catch((e) => {
          setButtonLoading(false);
          toastifyAndThrowError(e);
        });
      }
      navigate("/inbox");
    }
    setButtonLoading(false);
  }
  return (
    <>
      <GlowDrop />
      <div className="flex justify-end px-3 pt-4 pb-3">
        <ProfileButton />
      </div>
      <WhoSentThis className="mt-7 text-[2.5rem] sm:text-5xl md:text-6xl" />
      <p className="text-text mx-8 mt-5 text-center text-lg opacity-80 md:text-xl">
        Send and receive anonymous messages without revealing your identity
      </p>
      <div className="mt-10 flex justify-center">
        {auth.user &&
        (auth.user?.email ||
          window.localStorage.getItem("accountOrReceiver") === "true") ? (
          <Button
            content={
              (auth.user?.receivingPaused ?? true)
                ? "Start receiving messages"
                : "View received messages"
            }
            loading={buttonLoading}
            onClick={handleClick}
            className="max-w-xs"
          />
        ) : (
          <div className="flex space-x-5 md:space-x-8">
            <Button
              content={
                <div className="flex items-center justify-center">
                  <Icon
                    icon="mdi:account"
                    className="bg-accent/40 relative mr-3 inline size-10 rounded-full p-1"
                  />{" "}
                  Register
                </div>
              }
              onClick={() => navigate("/register")}
              className="h-full"
            />
            <SecondaryButton
              content={
                <div className="flex items-center">
                  <Icon
                    icon="mdi:anonymous"
                    className="bg-secondary relative size-10 mr-3 rounded-full p-1"
                  />
                  <span>Guest</span>
                </div>
              }
              loading={buttonLoading}
              onClick={handleClick}
            />
          </div>
        )}
      </div>
    </>
  );
}
