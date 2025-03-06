import { Link, useNavigate } from "react-router";
import { Button, SecondaryButton } from "../components/Buttons";
import { useAuth } from "../context/AuthContext";
import { Icon } from "@iconify/react";
import InputBox from "../components/InputBox";
import { useEffect, useState } from "react";
import { validateEmail } from "../utils/validators";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth.user;
  useEffect(() => {
    if (user) {
      navigate("/messages");
    }
  }, [user, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ringColorClass, setRingColorClass] = useState("focus:ring-primary/80");

  useEffect(() => {
    if (!email) {
      setRingColorClass("focus:ring-primary/80");
    } else if (!validateEmail(email)) {
      setRingColorClass("focus:ring-accent");
    } else {
      setRingColorClass("focus:ring-green-300/60");
    }
  }, [email]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid Email");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    setError("");
    await auth.login(email, password);
  }
  return (
    <div className="bg-background h-screen">
      <div className="px-5 pt-5">
        <Link to="/">
          <SecondaryButton
            content={<Icon icon="mdi:arrow-back" width={30}></Icon>}
          />
        </Link>
      </div>
      <div className="flex justify-center">
        <div className="ring-primary/80 shadow-primary/15 mt-32 flex max-w-xl min-w-sm flex-col space-y-8 rounded-2xl p-6 shadow-xl ring-2 md:space-y-10 md:p-10">
          <span className="text-primary font-[Sigmar] text-5xl opacity-90 md:text-6xl">
            Login
          </span>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <InputBox
              placeholder="Enter your email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              ringColorClass={ringColorClass}
            />
            <div className="relative">
              <InputBox
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Icon
                icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                className="absolute right-2 top-3 text-primary hover:cursor-pointer size-6 "
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {error && (
              <span className="text-accent text-md pl-2 font-bold">
                {error}
              </span>
            )}
            <Button type="submit" content="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
