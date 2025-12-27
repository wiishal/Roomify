import { JSX, useState } from "react";
import { login } from "../../services/services.user";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

export default function Login({
  onClose,
  onAlreadyHasAcc,
}: {
  onClose: () => void;
  onAlreadyHasAcc: () => void;
}): JSX.Element {
  const [userdetails, setuserdetails] = useState({
    username: "",
    password: "",
  });
  const [isloading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = useAuth();
  const setLogin = auth.login;
  const googleLogin = () => {
    window.location.href = "http://localhost:4000/api/v1/auth/google";
  };

  const handleLoginIn = async () => {
    if (!userdetails.username || !userdetails.password) {
      setLoginError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    try {
      const res = await login(userdetails);

      if (!res || !res.success) {
        setLoginError(
          res?.message || "Login failed. Please check your credentials."
        );
        return;
      }

      if (!res.token) {
        setLoginError("Login succeeded but session token was not received.");
        return;
      }

      setLogin(res.token);
      onClose();
      navigate("/");
    } catch (error) {
      console.error("login error : ", error);
      setLoginError("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100 mx-auto transition-all duration-300">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
        Welcome Back!
      </h2>
      <p className="text-sm text-gray-500 mb-8 text-center">
        Sign in to access your account.
      </p>

      {loginError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
          role="alert"
        >
          {loginError}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none"
            type="text"
            placeholder="Enter your username"
            value={userdetails.username}
            onChange={(e) => {
              setuserdetails((prev) => ({ ...prev, username: e.target.value }));
            }}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none"
            type="password"
            placeholder="Enter your password"
            value={userdetails.password}
            onChange={(e) => {
              setuserdetails((prev) => ({ ...prev, password: e.target.value }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLoginIn();
            }}
          />
        </div>
        <div>
          <button onClick={googleLogin}>SignIn with google</button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          className="w-full flex justify-center items-center px-4 py-2.5 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
          onClick={handleLoginIn}
          disabled={isloading}
        >
          {isloading ? <Spinner /> : "Login"}
        </button>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-red-600 transition duration-150"
          >
            Cancel
          </button>

          <button
            onClick={onAlreadyHasAcc}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-150"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
