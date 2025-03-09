import { Link, useNavigate } from "react-router";
import { Button } from "../components/Buttons";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { isEmailInvalid } from "../utils/validators";
import { toast } from "react-toastify";
import { EmailInputBox, PasswordInputBox } from "../components/InputBoxes";
import Header from "../components/Header";
import Box from "../components/Box";

export default function Login() {
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
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = isEmailInvalid(email);
    setError(message);
    if (message) return;
    setButtonLoading(true);
    try {
      await auth.login(email, password);
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
            <Button type="submit" content="Submit" loading={buttonLoading} />
          </form>
        </Box>
        <div className="text-text/70 mt-10 text-lg">
          Don't have an account? {"  "}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </div>
    </>
  );
}
