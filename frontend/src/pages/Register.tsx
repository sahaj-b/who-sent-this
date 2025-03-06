import { Link, useNavigate } from "react-router";
import { Button, SecondaryButton } from "../components/Buttons";
import { useAuth } from "../context/AuthContext";
import { Icon } from "@iconify/react";
import {
  EmailInputBox,
  NameInputBox,
  PasswordInputBox,
} from "../components/InputBoxes";
import { useEffect, useState } from "react";
import { isEmailInvalid, isPasswordInvalid } from "../utils/validators";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth.user;
  useEffect(() => {
    if (user?.email) {
      toast.info("You are already logged in");
      navigate("/dashboard");
    }
  }, [user]);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(name, email, password);
    const message = isEmailInvalid(email) || isPasswordInvalid(password);
    setError(message);
    if (message) return;
    if (user) {
      await auth.registerEmail(email, password, name?.trim());
    } else {
      await auth.registerWithEmail(email, password, name?.trim());
    }
    if (user) navigate("/dashboard");
  }

  return (
    <div className="bg-background h-screen">
      <div className="px-5 pt-5">
        <Link to="/">
          <SecondaryButton
            content={<Icon icon="mdi:arrow-back" width={25}></Icon>}
            className="px-4 py-3"
          />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="ring-primary/80 shadow-primary/15 mt-32 flex min-w-sm flex-col space-y-10 rounded-2xl px-8 py-10 shadow-xl ring-2 md:w-md">
          <span className="text-primary font-[Sigmar] text-5xl opacity-90 md:text-6xl">
            Register
          </span>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <NameInputBox setName={setName} />
            <EmailInputBox email={email} setEmail={setEmail} />
            <PasswordInputBox setPassword={setPassword} />
            {error && (
              <span className="text-accent text-md pl-2 font-bold">
                {error}
              </span>
            )}
            <Button type="submit" content="Submit" />
          </form>
        </div>
        <div className="text-text/70 mt-10 text-lg">
          Already have an account? {"  "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
