import { Dispatch, SetStateAction, useState } from "react";
import { login } from "../../services/services.user";
import { useNavigate } from "react-router-dom";

export default function Login({
  setIsLogged,
}: {
  setIsLogged: Dispatch<SetStateAction<boolean | null>>;
}) {
  const [userdetails, setuserdetails] = useState({
    username: "",
    password: "",
  });
  const [isloading, setIsLoading] = useState<boolean | null>(null);
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center">
      <div className="border">
        <div>
          <label htmlFor="">Username</label>
          <input
            type="text"
            onChange={(e) => {
              setuserdetails((prev) => ({ ...prev, username: e.target.value }));
            }}
          />
        </div>
        <div>
          <label htmlFor="">Password</label>
          <input
            type="password"
            onChange={(e) => {
              setuserdetails((prev) => ({ ...prev, password: e.target.value }));
            }}
          />
        </div>
        <button
          onClick={async () => {
            setIsLoading(true);
            try {
              const res = await login(userdetails);
              if (!res) {
                alert("failed during login");
                setIsLoading(false);
                return;
              }
              if (res.status === 401) {
                alert(res.data.message);
                setIsLoading(false);
                return;
              }
              localStorage.setItem("token", res.token);
              setIsLogged(true);
              navigate("/");
            } catch (error) {
              console.error("login error : ", error);
              alert("An unexpected error occurred");
              setIsLoading(false);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {isloading ? "Loading" : "login"}
        </button>
      </div>
    </div>
  );
}
