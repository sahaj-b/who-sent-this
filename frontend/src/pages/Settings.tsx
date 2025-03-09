import { useState } from "react";
import { AuthContextType, useAuth } from "../context/AuthContext";
import { isPasswordInvalid } from "../utils/validators";
import Header from "../components/Header";
import Box from "../components/Box";
import { NameInputBox, PasswordInputBox } from "../components/InputBoxes";
import { Button } from "../components/Buttons";
import Toggle from "../components/Toggle";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router";

function DeleteComponent({ auth }: { auth: AuthContextType }) {
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const user = auth.user;
  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await auth.deleteUser(password);
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (e: any) {
      setError(e.message);
    }
    setDeleteLoading(false);
  }
  return (
    <>
      <div
        className={
          "absolute h-screen w-screen backdrop-blur-sm opacity-60 " +
          (deleteClicked || "hidden")
        }
        onClick={() => {
          setError("");
          setPassword("");
          setDeleteClicked(false);
        }}
      ></div>
      <div
        className={
          deleteClicked
            ? "w-sm bg-background shadow-accent/30 ring-accent absolute z-10 flex flex-col space-y-5 rounded-xl p-5 shadow-xl ring-2 backdrop-blur-sm"
            : "my-10"
        }
      >
        <div className={!deleteClicked ? "hidden" : ""}>
          {user?.email ? (
            <PasswordInputBox setPassword={setPassword} value={password} />
          ) : (
            <span className="pl-1 text-text/90 text-xl font-bold">
              Are you sure?
            </span>
          )}
          {error && (
            <p className="text-accent text-md mt-2 -mb-2 pl-1 font-bold">
              {error}
            </p>
          )}
        </div>
        <button
          className={
            "w-full text-center flex justify-center text-accent shadow-accent/20 bg-secondary/30 rounded-xl px-4 py-2 text-xl font-bold shadow-xl inset-ring-1 transition hover:cursor-pointer hover:inset-ring-3 " +
            (deleteLoading && "opacity-80")
          }
          onClick={() => {
            setError("");
            setPassword("");
            deleteClicked ? handleDelete() : setDeleteClicked(true);
          }}
        >
          {deleteLoading ? (
            <Icon icon="svg-spinners:3-dots-move" className="size-7" />
          ) : (
            <>Delete your {!user?.email ? "Anonymous " : ""} Account</>
          )}
        </button>
      </div>
    </>
  );
}

export default function Settings() {
  const auth = useAuth();
  const user = auth.user;

  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(user!.name ?? "");
  const [error, setError] = useState("");
  const [receivingPaused, setReceivingPaused] = useState(user!.receivingPaused);
  const [buttonLoading, setButtonLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    let errMsg = "";
    if (newPassword) errMsg = isPasswordInvalid(newPassword);
    console.log(name, user?.name, receivingPaused, user?.receivingPaused);
    if (
      !newPassword &&
      name === (user?.name ?? "") &&
      receivingPaused === user?.receivingPaused
    ) {
      errMsg = "No changes made";
    }
    setError(errMsg);
    if (errMsg) return;
    setButtonLoading(true);
    try {
      await auth.changeSettings({
        password: password && password,
        newPassword: newPassword && newPassword,
        name,
        receivingPaused,
      });
      toast.success("Settings saved");
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
            Settings
          </span>
          <form onSubmit={handleSave} className="flex flex-col space-y-5">
            <div className="flex items-center w-full">
              <span className="text-text/80 relative -right-0.5 p-2 text-lg font-bold bg-secondary/80 rounded-y-md rounded-l-md ">
                Name:{" "}
              </span>
              <NameInputBox setName={setName} value={name} />
            </div>
            <Toggle
              bool={receivingPaused}
              setBool={setReceivingPaused}
              label="Pause Receiving messages"
              className="relative left-1 text-lg"
            />
            {user?.email && (
              <div className="flex flex-col space-y-5 mt-5">
                <span className="text-primary pl-2 text-xl font-bold">
                  Change Password
                </span>
                <PasswordInputBox
                  setPassword={setPassword}
                  placeholder="Enter Old Password"
                />
                <PasswordInputBox
                  setPassword={setNewPassword}
                  placeholder="Enter New Password"
                />
              </div>
            )}
            <div className="mt-3">
              <p className="pb-3 text-accent text-md pl-2 font-bold">{error}</p>
              <Button type="submit" content="Save" loading={buttonLoading} />
            </div>
          </form>
        </Box>

        <DeleteComponent auth={auth} />
      </div>
    </>
  );
}
