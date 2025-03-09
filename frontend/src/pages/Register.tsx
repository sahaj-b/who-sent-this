import { Link, useNavigate } from "react-router";
import { Button } from "../components/Buttons";
import { useAuth } from "../context/AuthContext";
import {
  EmailInputBox,
  NameInputBox,
  PasswordInputBox,
} from "../components/InputBoxes";
import { useEffect, useState } from "react";
import { isEmailInvalid, isPasswordInvalid } from "../utils/validators";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Box from "../components/Box";

export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth.user;
  useEffect(() => {
    if (user?.email) {
      toast.info("You are already logged in");
      navigate(-1);
    }
  }, [user]);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = isEmailInvalid(email) || isPasswordInvalid(password);
    setError(message);
    if (message) return;
    setButtonLoading(true);
    try {
      if (!user) {
        await auth.registerWithEmail(email, password, name?.trim());
      } else {
        await auth.registerEmail(email, password, name?.trim());
      }
      if (user) navigate("/inbox");
    } catch (e: any) {
      setError(e.message);
    }
    setButtonLoading(false);
  }

  return (
    <>
      <Header />
      <div className="mx-3 flex flex-col items-center justify-center">
        <Box>
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
            <Button type="submit" content="Submit" loading={buttonLoading} />
          </form>
        </Box>
        <div className="text-text/70 mt-10 text-lg">
          Already have an account? {"  "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
