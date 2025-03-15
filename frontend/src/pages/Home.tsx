import { useNavigate } from "react-router";
import { Button, SecondaryButton } from "../components/Buttons";
import { useAuth } from "../context/AuthContext";
import WhoSentThis from "../components/WST";
import ProfileButton from "../components/ProfileButton";
import { useState } from "react";
import { toastifyAndThrowError } from "../utils/errorHandler";
import { Icon } from "@iconify/react/dist/iconify.js";
import GlowDrop from "../components/GlowDrop";
import GridBackground from "../components/GridBackground";

function Card({
  icon,
  desc,
}: {
  icon: string;
  desc: React.ReactNode;
  fade?: boolean;
}) {
  return (
    <div className="bg-secondary/20 ring-accent/30 flex shrink-0 flex-col items-center gap-y-4 rounded-2xl px-4 py-5 ring-1">
      <div className="relative">
        <Icon icon={icon} className="text-primary stroke-accent/20 size-22" />
        <div className="absolute top-0 left-0 h-full w-full bg-linear-60 via-[#200C1C55] to-[#200C1C]" />
      </div>
      <div className="text-text/90 text-2xl text-center">{desc}</div>
    </div>
  );
}

function Underline({ text }: { text: string }) {
  return (
    <mark className="bg-transparent text-text relative px-1 -mx-1">
      <span className="relative z-10">{text}</span>
      <span className="absolute inset-x-0 bottom-0 w-[98%] h-2.5 md:h-3 bg-accent/80 -rotate-[0.5deg] transform"></span>
    </mark>
  );
}

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
      <GridBackground />
      <GlowDrop home />
      <div className="flex justify-end px-3 pt-4 pb-3">
        <ProfileButton />
      </div>
      <WhoSentThis className="mt-7 text-[2.9rem] md:mb-10 md:text-6xl" />
      <p className="text-nowrap text-text mx-6 mt-5 text-center text-xl opacity-90 md:text-2xl">
        Send and receive <Underline text="Anonymous Messages" />
        <br />
        without revealing your identity
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
                    className="bg-secondary relative mr-3 size-10 rounded-full p-1"
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
      <div className="mx-auto mt-20 grid w-[90%] max-w-xl grid-cols-2 gap-5 pb-20">
        <Card
          icon="mdi:link-variant"
          desc={
            <div className="text-text/90 text-2xl text-center">
              Share <Underline text="Links" />
            </div>
          }
        />
        <Card
          icon="mdi:file-question-outline"
          desc={
            <div className="text-text/90 text-2xl text-center">
              Post <Underline text="Questions" />
            </div>
          }
        />
        <Card
          icon="uil:message"
          desc={
            <div className="text-text/90 text-2xl text-center">
              <Underline text="Send" />, <Underline text="Receive" />,{" "}
              <Underline
                text="Reply
          "
              />
            </div>
          }
        />
        <Card
          icon="mdi:incognito"
          desc={
            <div className="text-text/90 text-2xl text-center">
              Completely <Underline text="Anonymous" />
            </div>
          }
        />
      </div>
    </>
  );
}
