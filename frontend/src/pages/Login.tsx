import { Link, useNavigate } from "react-router";
import { Button, SecondaryButton } from "../components/Buttons";
import { useAuth } from "../context/AuthContext";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { isEmailInvalid } from "../utils/validators";
import { toast } from "react-toastify";
import { EmailInputBox, PasswordInputBox } from "../components/InputBoxes";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth.user;
  useEffect(() => {
    if (user) {
      toast.info("You are already logged in");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = isEmailInvalid(email);
    setError(message);
    if (message) return;
    await auth.login(email, password);
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
            Login
          </span>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
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
          Don't have an account? {"  "}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
