import { Dispatch, JSX, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { signIn } from "../../services/services.user";

export default function SignIn({
  setIsLogged,
  onClose,
  onAlreadyHasAcc,
}: {
  setIsLogged: Dispatch<SetStateAction<boolean | null>>;
  onClose: () => void;
  onAlreadyHasAcc: () => void;
}): JSX.Element {
  const [userdetails, setuserdetails] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [isloading, setIsLoading] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const res = await signIn(userdetails);
      if (!res || !res.success) {
        alert(res.message);
        return;
      }
      if (!res.token) {
        alert("Login succeeded but no token was received");
        return;
      }
      localStorage.setItem("token", res.token);
      setIsLogged(true);
      navigate("/");
    } catch (error) {
      alert("An unexpected error occurred");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col justify-center bg-neutral-800 items-center text-white gap-5 w-[30rem] h-[25rem]">
      <div className="flex flex-col border p-6 gap-5 w-full h-full">
        <div className="flex flex-col gap-2">
          <label htmlFor="">Username</label>
          <input
            className="bg-transparent border p-2"
            type="text"
            onChange={(e) => {
              setuserdetails((prev) => ({ ...prev, username: e.target.value }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">email</label>
          <input
            required
            className="bg-transparent border p-2"
            type="email"
            onChange={(e) => {
              setuserdetails((prev) => ({ ...prev, email: e.target.value }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Password</label>
          <input
            className="bg-transparent border p-2"
            type="password"
            onChange={(e) => {
              setuserdetails((prev) => ({ ...prev, password: e.target.value }));
            }}
          />
        </div>
        <div className="flex flex-row gap-3">
          <Button
            className=" px-4 py-1 border rounded-md"
            onClick={handleSignIn}
          >
            {isloading ? "Loading" : "sign in"}
          </Button>
          <Button
            onClick={onClose}
            className=" px-4 py-1 bg-red-700 rounded-md"
          >
            Close
          </Button>
          <Button onClick={onAlreadyHasAcc} className="font-normal text-sm">
            Already have an account
          </Button>
        </div>
      </div>
    </div>
  );
}
